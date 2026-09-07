import type { Dayjs } from 'dayjs'
import { useDayjs } from '#dayjs'

export type PartitionInterval = '10_DAY' | 'NUA_THANG' | '1_THANG' | '2_THANG' | '3_THANG' | '4_THANG' | '5_THANG' | '6_THANG'

export const PARTITION_INTERVAL_OPTIONS: { label: string, value: PartitionInterval }[] = [
  { label: '10 Ngày', value: '10_DAY' },
  { label: '15 Ngày', value: 'NUA_THANG' },
  { label: '1 Tháng', value: '1_THANG' },
  { label: '2 Tháng', value: '2_THANG' },
  { label: '3 Tháng', value: '3_THANG' },
  { label: '4 Tháng', value: '4_THANG' },
  { label: '5 Tháng', value: '5_THANG' },
  { label: '6 Tháng', value: '6_THANG' }
]

function partitionClause(startDate: Dayjs, endDate: Dayjs, engine = 'InnoDB'): string {
  const dateKey = `p${startDate.format('YYYYMMDD')}`
  return `PARTITION ${dateKey} VALUES LESS THAN (TO_DAYS('${endDate.format('YYYY-MM-DD')}')) ENGINE = ${engine}`
}

/**
 * Sinh danh sách PARTITION BY RANGE dựa trên khoảng ngày và chu kỳ, giữ nguyên
 * logic chia chu kỳ 10 ngày / nửa tháng / N tháng của công cụ tool-env gốc.
 */
export function generatePartitionPlan(fieldName: string, startDateInput: string, endDateInput: string, interval: PartitionInterval): string {
  if (!fieldName || !startDateInput || !endDateInput) {
    return ''
  }

  const dayjs = useDayjs()
  let cursor = dayjs(startDateInput)
  const maxDate = dayjs(endDateInput)
  const clauses: string[] = []

  while (cursor.format('YYYY-MM-DD') <= maxDate.format('YYYY-MM-DD')) {
    if (interval === '10_DAY') {
      cursor = cursor.startOf('month')
      clauses.push(partitionClause(cursor, cursor.add(10, 'day')))

      cursor = cursor.add(10, 'day')
      clauses.push(partitionClause(cursor, cursor.add(10, 'day')))

      cursor = cursor.add(10, 'day')
      clauses.push(partitionClause(cursor, cursor.add(1, 'month').startOf('month')))

      cursor = cursor.add(1, 'month')
    } else if (interval === 'NUA_THANG') {
      cursor = cursor.startOf('month')
      clauses.push(partitionClause(cursor, cursor.add(15, 'day')))

      cursor = cursor.add(15, 'day')
      clauses.push(partitionClause(cursor, cursor.add(1, 'month').startOf('month')))

      cursor = cursor.add(1, 'month')
    } else {
      const month = Number.parseInt(interval.split('_THANG')[0] ?? '', 10)
      if (Number.isNaN(month) || month <= 0) {
        throw new Error(`Chu kỳ [${interval}] không đúng định dạng.`)
      }

      cursor = cursor.startOf('month')
      clauses.push(partitionClause(cursor, cursor.add(month, 'month').startOf('month')))
      cursor = cursor.add(month, 'month')
    }
  }

  clauses.push('PARTITION pm VALUES LESS THAN MAXVALUE ENGINE = InnoDB')

  return `PARTITION BY RANGE (TO_DAYS(${fieldName})) (\n    ${clauses.join(',\n    ')}\n)`
}

export interface ReorganizePartitionPlan {
  sql: string
  period: number
  currentPeriod: number
}

/**
 * Phân tích DDL bảng đã có partition để sinh câu lệnh DROP PARTITION các
 * partition cũ và REORGANIZE PARTITION pMax để thêm các partition mới.
 */
export function parsePartitionDdl(ddl: string, periodOverride?: number, rangeStart = '2026-01-01', rangeEnd = '2031-01-01'): ReorganizePartitionPlan {
  const tableMatch = ddl.match(/CREATE TABLE `([^`]+)` /)
  if (!tableMatch) {
    throw new Error('Không phân tích được DDL ra table name')
  }
  const tableName = tableMatch[1] as string

  const partitions = [...ddl.matchAll(/PARTITION (p[^ ]+) VALUES/g)].map(match => match[1] as string)
  if (partitions.length < 3) {
    throw new Error('DDL cần có ít nhất 3 partition để xác định được chu kỳ hiện tại')
  }

  const pMaxName = partitions.pop() as string

  const p2 = Number.parseInt((partitions[partitions.length - 1] as string).replace(/\D/g, ''), 10)
  const p1 = Number.parseInt((partitions[partitions.length - 2] as string).replace(/\D/g, ''), 10)
  const currentPeriod = p2 - p1

  const period = periodOverride && Number.isInteger(periodOverride) && periodOverride > 0
    ? periodOverride
    : currentPeriod

  const engineMatch = ddl.match(/ENGINE = ([^, ]+)/)
  const engine = engineMatch?.[1] || 'InnoDB'

  const dropSql = `ALTER TABLE ${tableName} DROP PARTITION \n` + partitions.join(', ') + ';'
  const addSql = createReorganizePartitionSql(tableName, period, pMaxName, engine, rangeStart, rangeEnd)

  return {
    sql: `${dropSql}\n${addSql}`,
    period,
    currentPeriod
  }
}

function createReorganizePartitionSql(tableName: string, interval: number, pMaxName: string, engine: string, rangeStart: string, rangeEnd: string): string {
  const dayjs = useDayjs()
  let cursor = dayjs(rangeStart)
  const maxDate = dayjs(rangeEnd)

  const data: string[] = []
  while (cursor.format('YYYY-MM-DD') <= maxDate.format('YYYY-MM-DD')) {
    cursor = cursor.startOf('month')
    data.push(partitionClause(cursor, cursor.add(interval, 'month').startOf('month'), engine))
    cursor = cursor.add(interval, 'month')
  }

  data.push(`PARTITION ${pMaxName} VALUES LESS THAN MAXVALUE ENGINE = ${engine}`)

  return `ALTER TABLE ${tableName} REORGANIZE PARTITION ${pMaxName} INTO  (\n    ${data.join(',\n    ')}\n);`
}
