export type MongoFieldMode = 'attribute' | 'template' | 'static' | 'now'
export type MongoStaticType = 'string' | 'number' | 'boolean' | 'null' | 'raw'

export interface MongoFieldMapping {
  key: string
  mode: MongoFieldMode
  value: string
  staticType?: MongoStaticType
}

export const MONGO_FIELD_MODE_OPTIONS: { label: string, value: MongoFieldMode }[] = [
  { label: 'Attribute JSON', value: 'attribute' },
  { label: 'Template chuỗi', value: 'template' },
  { label: 'Giá trị cố định', value: 'static' },
  { label: 'Thời gian hiện tại (ISO)', value: 'now' }
]

export const MONGO_STATIC_TYPE_OPTIONS: { label: string, value: MongoStaticType }[] = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Null', value: 'null' },
  { label: 'Raw (không escape)', value: 'raw' }
]

const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/
const TEMPLATE_RE = /\{\{\s*([^}]+?)\s*\}\}/g

class RawExpr {
  constructor(public expr: string) {}
}

function formatKey(key: string): string {
  return IDENTIFIER_RE.test(key) ? key : JSON.stringify(key)
}

function formatValue(value: unknown, indent: string): string {
  if (value instanceof RawExpr) {
    return value.expr
  }
  if (value === null || value === undefined) {
    return 'null'
  }
  if (typeof value === 'string') {
    return JSON.stringify(value)
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]'
    }
    const inner = value.map(v => `${indent}  ${formatValue(v, indent + '  ')}`).join(',\n')
    return `[\n${inner}\n${indent}]`
  }
  if (typeof value === 'object') {
    return formatObject(value as Record<string, unknown>, indent)
  }
  return JSON.stringify(String(value))
}

function formatObject(obj: Record<string, unknown>, indent: string): string {
  const keys = Object.keys(obj)
  if (keys.length === 0) {
    return '{}'
  }
  const inner = keys
    .map(key => `${indent}  ${formatKey(key)}: ${formatValue(obj[key], indent + '  ')}`)
    .join(',\n')
  return `{\n${inner}\n${indent}}`
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

function coerceStatic(value: string, type: MongoStaticType): unknown {
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

export function buildMongoInsertMany(jsonString: string, collection: string, mappings: MongoFieldMapping[]): string {
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

  const effectiveMappings: MongoFieldMapping[] = mappings.length > 0
    ? mappings
    : Object.keys(firstItem as Record<string, unknown>).map(key => ({ key, mode: 'attribute', value: key }))

  if (effectiveMappings.some(m => !m.key.trim())) {
    throw new Error('Tên field không được để trống.')
  }

  const now = new Date().toISOString()

  const docs = data.map((item) => {
    if (item === null || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error('Mỗi phần tử trong mảng JSON phải là một object.')
    }
    const source = item as Record<string, unknown>
    const doc: Record<string, unknown> = {}

    for (const mapping of effectiveMappings) {
      switch (mapping.mode) {
        case 'attribute':
          doc[mapping.key] = source[mapping.value] ?? null
          break
        case 'template':
          doc[mapping.key] = interpolateTemplate(mapping.value, source)
          break
        case 'static':
          doc[mapping.key] = coerceStatic(mapping.value, mapping.staticType ?? 'string')
          break
        case 'now':
          doc[mapping.key] = now
          break
      }
    }

    return doc
  })

  const collectionName = collection.trim() || 'collection'
  const body = docs.map(doc => `  ${formatObject(doc, '  ')}`).join(',\n')

  return `db.${collectionName}.insertMany([\n${body}\n])`
}
