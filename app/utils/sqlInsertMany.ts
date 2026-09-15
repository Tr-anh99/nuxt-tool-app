export type SqlFieldMode = 'attribute' | 'template' | 'static' | 'now'
export type SqlStaticType = 'string' | 'number' | 'boolean' | 'null' | 'raw'

export interface SqlFieldMapping {
  key: string
  mode: SqlFieldMode
  value: string
  staticType?: SqlStaticType
}

export const SQL_FIELD_MODE_OPTIONS: { label: string, value: SqlFieldMode }[] = [
  { label: 'Attribute JSON', value: 'attribute' },
  { label: 'Template chuỗi', value: 'template' },
  { label: 'Giá trị cố định', value: 'static' },
  { label: 'Thời gian hiện tại', value: 'now' }
]

export const SQL_STATIC_TYPE_OPTIONS: { label: string, value: SqlStaticType }[] = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Null', value: 'null' },
  { label: 'Raw (không escape)', value: 'raw' }
]

const IDENTIFIER_RE = /^[A-Za-z_][A-Za-z0-9_]*$/
const TEMPLATE_RE = /\{\{\s*([^}]+?)\s*\}\}/g

class RawExpr {
  constructor(public expr: string) {}
}

function formatIdentifier(name: string): string {
  return IDENTIFIER_RE.test(name) ? name : `\`${name.replace(/`/g, '``')}\``
}

function escapeSqlString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, '\'\'')
}

function formatValue(value: unknown): string {
  if (value instanceof RawExpr) {
    return value.expr
  }
  if (value === null || value === undefined) {
    return 'NULL'
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : 'NULL'
  }
  if (typeof value === 'boolean') {
    return value ? '1' : '0'
  }
  if (typeof value === 'object') {
    return `'${escapeSqlString(JSON.stringify(value))}'`
  }
  return `'${escapeSqlString(String(value))}'`
}

function interpolateTemplate(template: string, source: Record<string, unknown>): string {
  return template.replace(TEMPLATE_RE, (_, key: string) => {
    const value = source[key]
    if (value === undefined || value === null) {
      return ''
    }
    return typeof value === 'object' ? JSON.stringify(value) : String(value)
  })
}

function coerceStatic(value: string, type: SqlStaticType): unknown {
  switch (type) {
    case 'number': {
      const n = Number(value)
      if (Number.isNaN(n)) {
        throw new Error(`Giá trị tĩnh "${value}" không phải là số hợp lệ.`)
      }
      return n
    }
    case 'boolean':
      return value.trim().toLowerCase() === 'true'
    case 'null':
      return null
    case 'raw':
      return new RawExpr(value)
    default:
      return value
  }
}

export interface SqlInsertOptions {
  batchSize?: number
}

export function buildSqlInsertMany(
  jsonString: string,
  table: string,
  mappings: SqlFieldMapping[],
  options: SqlInsertOptions = {}
): string {
  const { batchSize = 0 } = options
  const data = JSON.parse(jsonString) as unknown

  if (!Array.isArray(data)) {
    throw new Error('JSON đầu vào phải là một mảng (array) các object.')
  }
  if (data.length === 0) {
    throw new Error('Mảng JSON đầu vào đang rỗng.')
  }

  const firstItem = data[0]
  if (firstItem === null || typeof firstItem !== 'object' || Array.isArray(firstItem)) {
    throw new Error('Mỗi phần tử trong mảng JSON phải là một object.')
  }

  const effectiveMappings: SqlFieldMapping[] = mappings.length > 0
    ? mappings
    : Object.keys(firstItem as Record<string, unknown>).map(key => ({ key, mode: 'attribute', value: key }))

  if (effectiveMappings.some(m => !m.key.trim())) {
    throw new Error('Tên field không được để trống.')
  }

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

  const rows = data.map((item) => {
    if (item === null || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error('Mỗi phần tử trong mảng JSON phải là một object.')
    }
    const source = item as Record<string, unknown>

    return effectiveMappings.map((mapping) => {
      switch (mapping.mode) {
        case 'attribute':
          return formatValue(source[mapping.value] ?? null)
        case 'template':
          return formatValue(interpolateTemplate(mapping.value, source))
        case 'static':
          return formatValue(coerceStatic(mapping.value, mapping.staticType ?? 'string'))
        case 'now':
          return formatValue(now)
        default:
          return 'NULL'
      }
    })
  })

  const tableName = formatIdentifier(table.trim() || 'table_name')
  const columns = effectiveMappings.map(m => formatIdentifier(m.key)).join(', ')

  if (batchSize <= 0) {
    const body = rows.map(row => `(${row.join(', ')})`).join(',\n')
    return `INSERT INTO ${tableName} (${columns}) VALUES\n${body};`
  }

  const batches: string[] = []
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const body = batch.map(row => `(${row.join(', ')})`).join(',\n')
    batches.push(`INSERT INTO ${tableName} (${columns}) VALUES\n${body};`)
  }

  return batches.join('\n\n')
}
