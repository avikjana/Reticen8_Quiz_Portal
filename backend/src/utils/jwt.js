// Minimal HS256 JSON Web Token implementation using node:crypto.
import crypto from 'node:crypto'

let secret = process.env.JWT_SECRET
if (!secret || secret.length < 32) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set (at least 32 characters) in production.')
  }
  secret = crypto.randomBytes(48).toString('hex')
  console.warn(
    '[auth] JWT_SECRET is not set (or too short) — using a random secret. ' +
      'Everyone will be logged out when the server restarts. Set JWT_SECRET in backend/.env.'
  )
}

const TOKEN_TTL_SECONDS = Number(process.env.JWT_EXPIRES_IN_SECONDS) || 60 * 60 * 24 * 7 // 7 days

const b64url = (input) => Buffer.from(input).toString('base64url')

const signPart = (data) => crypto.createHmac('sha256', secret).update(data).digest('base64url')

export function signToken(payload, ttlSeconds = TOKEN_TTL_SECONDS) {
  const now = Math.floor(Date.now() / 1000)
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = b64url(
    JSON.stringify({ ...payload, iat: now, exp: now + ttlSeconds, jti: crypto.randomUUID() })
  )
  return `${header}.${body}.${signPart(`${header}.${body}`)}`
}

// Returns the decoded payload, or null if the token is malformed, forged or expired.
export function verifyToken(token) {
  if (typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [header, body, signature] = parts

  const expected = Buffer.from(signPart(`${header}.${body}`))
  const actual = Buffer.from(signature)
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return null

  try {
    const { alg } = JSON.parse(Buffer.from(header, 'base64url').toString())
    if (alg !== 'HS256') return null
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}
