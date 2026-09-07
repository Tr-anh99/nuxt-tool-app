export function parseDotenv(src: string): Record<string, string> {
  const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg

  const result: Record<string, string> = {}
  const lines = src.toString().replace(/\r\n?/mg, '\n')

  let match: RegExpExecArray | null
  while ((match = LINE.exec(lines)) !== null) {
    const key = match[1] as string
    let value = (match[2] || '').trim()

    const maybeQuote = value[0]
    value = value.replace(/^(['"`])([\s\S]*)\1$/m, '$2')

    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, '\n').replace(/\\r/g, '\r')
    }

    result[key] = value
  }

  return result
}
