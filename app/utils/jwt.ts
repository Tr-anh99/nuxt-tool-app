export function base64UrlDecode(segment: string): string {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')

  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))

  return new TextDecoder('utf-8').decode(bytes)
}

export interface JwtSegments {
  header: string
  payload: string
  signature: string
}

export function splitJwt(token: string): JwtSegments {
  const segments = token.trim().split('.')

  if (segments.length !== 3) {
    throw new Error('Token không hợp lệ, cần đủ 3 phần header.payload.signature')
  }

  const [header, payload, signature] = segments as [string, string, string]

  return { header, payload, signature }
}

export function decodeJwtSegment(segment: string): unknown {
  return JSON.parse(base64UrlDecode(segment))
}
