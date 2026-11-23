const UNICODE_ESCAPE = new RegExp(String.raw`\\u([0-9a-fA-F]{4})`, 'g')
const ESCAPED_SLASH = new RegExp(String.raw`\\/`, 'g')

/**
 * Giải mã các chuỗi escape Unicode (ví dụ: backslash + u00e1, kể cả surrogate pair)
 * thành ký tự thật. Đồng thời bỏ escape của dấu `/` thường gặp trong JSON.
 */
export function unicodeUnescape(text: string): string {
  return text
    .replace(UNICODE_ESCAPE, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .replace(ESCAPED_SLASH, '/')
}
