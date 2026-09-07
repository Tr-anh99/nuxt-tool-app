export function parseQueryString(input: string): Record<string, unknown> {
  const params = new URLSearchParams(input.trim().replace(/^\?/, ''))
  const result: Record<string, unknown> = {}

  for (const [rawKey, rawValue] of params.entries()) {
    const keys = rawKey.replace(/\]/g, '').split('[')
    const value = coerceValue(rawValue)
    let target = result

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        target[key] = value
        return
      }

      if (typeof target[key] !== 'object' || target[key] === null) {
        target[key] = {}
      }
      target = target[key] as Record<string, unknown>
    })
  }

  const normalized: Record<string, unknown> = {}
  for (const key in result) {
    normalized[key] = normalizeArrays(result[key])
  }

  return normalized
}

function normalizeArrays(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) {
    return value
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .map(([key, nested]) => [key, normalizeArrays(nested)] as const)

  const isIndexed = entries.length > 0 && entries.every(([key], index) => key === String(index))
  if (isIndexed) {
    return entries.map(([, nested]) => nested)
  }

  return Object.fromEntries(entries)
}

export function stringifyQueryString(data: Record<string, unknown>): string {
  const params = new URLSearchParams()

  function append(object: Record<string, unknown>, prefix?: string) {
    for (const key in object) {
      const keyPath = prefix ? `${prefix}[${key}]` : key
      const value = object[key]

      if (typeof value === 'object' && value !== null) {
        append(value as Record<string, unknown>, keyPath)
      } else if (value !== null && value !== undefined) {
        params.append(keyPath, String(value))
      }
    }
  }

  append(data)

  return params.toString()
}

function coerceValue(value: string): string | number {
  if (value !== '' && /^-?(0|[1-9]\d*)(\.\d+)?$/.test(value)) {
    return Number(value)
  }

  return value
}
