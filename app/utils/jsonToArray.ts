function pickValue(item: unknown, key: string): unknown {
  if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
    return (item as Record<string, unknown>)[key] ?? null
  }
  return null
}

function distinctValues(values: unknown[]): unknown[] {
  const seen = new Set<string>()
  const result: unknown[] = []
  for (const value of values) {
    const key = JSON.stringify(value)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(value)
    }
  }
  return result
}

function sortAsc(values: unknown[]): unknown[] {
  return [...values].sort((a, b) => {
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b
    }
    return String(a).localeCompare(String(b), undefined, { numeric: true })
  })
}

interface JsonToArrayOptions {
  sort?: boolean
  distinct?: boolean
}

export function jsonToArray(
  jsonString: string,
  attributeInput: string,
  options: JsonToArrayOptions = {}
): unknown[] {
  const { sort = false, distinct = true } = options
  const keys = attributeInput.split(',').map(a => a.trim()).filter(Boolean)
  if (keys.length === 0) {
    throw new Error('Vui lòng nhập tên attribute.')
  }

  const data = JSON.parse(jsonString) as unknown

  if (!Array.isArray(data)) {
    throw new Error('JSON đầu vào phải là một mảng (array) các object.')
  }

  if (keys.length === 1) {
    const key = keys[0] as string
    let values = data.map(item => pickValue(item, key))
    if (distinct) {
      values = distinctValues(values)
    }
    if (sort) {
      values = sortAsc(values)
    }
    return values
  }

  return data.map((item) => {
    const record: Record<string, unknown> = {}
    keys.forEach((key) => {
      record[key] = pickValue(item, key)
    })
    return record
  })
}
