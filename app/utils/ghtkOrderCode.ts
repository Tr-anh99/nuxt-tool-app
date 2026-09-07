export function extractGhtkOrderId(code: string): number | string {
  const trimmed = code.trim()
  const lastDotIndex = trimmed.lastIndexOf('.')
  const idStr = lastDotIndex === -1 ? trimmed : trimmed.slice(lastDotIndex + 1)

  const num = Number(idStr)
  return idStr !== '' && Number.isFinite(num) ? num : idStr
}

export function extractGhtkOrderIdsFromList(input: string): (number | string)[] {
  return input
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(extractGhtkOrderId)
}

export function extractGhtkOrderIdsFromJson(jsonString: string, attribute: string): (number | string)[] {
  const key = attribute.trim()
  if (!key) {
    throw new Error('Vui lòng nhập tên attribute.')
  }

  const data = JSON.parse(jsonString) as unknown

  if (!Array.isArray(data)) {
    throw new Error('JSON đầu vào phải là một mảng (array) các object.')
  }

  return data.map((item) => {
    const value = item !== null && typeof item === 'object' && !Array.isArray(item)
      ? (item as Record<string, unknown>)[key]
      : null

    return extractGhtkOrderId(value === null || value === undefined ? '' : String(value))
  })
}
