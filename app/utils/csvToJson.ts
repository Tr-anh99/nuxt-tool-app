const JSON_NUMBER_RE = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
          continue
        }
        inQuotes = false
        continue
      }
      field += char
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }

    if (char === ',') {
      row.push(field)
      field = ''
      continue
    }

    if (char === '\r') {
      continue
    }

    if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      continue
    }

    field += char
  }

  if (inQuotes) {
    throw new Error('File CSV không hợp lệ: thiếu dấu ngoặc kép (") đóng.')
  }

  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter(cols => !(cols.length === 1 && cols[0] === ''))
}

function castValue(value: string): string | number {
  const trimmed = value.trim()

  if (trimmed === '' || !JSON_NUMBER_RE.test(trimmed)) {
    return trimmed
  }

  return Number(trimmed)
}

export function csvToJson(csv: string): Record<string, string | number>[] {
  const rows = parseCsvRows(csv)

  if (rows.length === 0) {
    return []
  }

  const header = (rows[0] ?? []).map(key => key.trim())
  if (header.length === 0 || header.some(key => !key)) {
    throw new Error('Dòng tiêu đề (header) không được để trống ở bất kỳ cột nào.')
  }

  return rows.slice(1).map((cols) => {
    const record: Record<string, string | number> = {}
    header.forEach((key, index) => {
      record[key] = castValue(cols[index] ?? '')
    })
    return record
  })
}
