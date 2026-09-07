export function jsonToEnv(jsonString: string): string {
  const data = JSON.parse(jsonString) as Record<string, unknown>

  const lines = Object.keys(data).map((key) => {
    const value = data[key]
    let valueString: string

    switch (Object.prototype.toString.call(value)) {
      case '[object Null]':
      case '[object Undefined]':
        valueString = ''
        break
      case '[object String]':
        valueString = value as string
        break
      case '[object Object]':
      case '[object Array]':
        valueString = JSON.stringify(value)
        break
      case '[object Number]':
        valueString = String(value)
        break
      case '[object Boolean]':
        valueString = value ? 'true' : 'false'
        break
      default:
        valueString = String(value)
    }

    if (valueString.includes('\n')) {
      valueString = valueString.replace(/[\r\n]/g, '\\n')
    }

    return `${key}=${valueString}`
  })

  return lines.join('\n')
}
