// RFC 6238 TOTP + RFC 4226 HOTP using node:crypto. Zero dependencies.
import crypto from 'node:crypto'

const DIGITS = 6
const PERIOD = 30
const WINDOW = 1 // accept codes ±1 step (30s each side)
const SECRET_BYTES = 20
const BACKUP_CODE_COUNT = 10
const ISSUER = process.env.MFA_ISSUER || 'Reticen8 Academy'

// --- Base32 encode/decode (RFC 4648) ---

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function base32Encode(buf) {
  let bits = 0, value = 0, out = ''
  for (const byte of buf) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31]
  return out
}

function base32Decode(str) {
  const cleaned = str.replace(/[\s=]/g, '').toUpperCase()
  let bits = 0, value = 0
  const out = []
  for (const ch of cleaned) {
    const idx = B32.indexOf(ch)
    if (idx === -1) throw new Error('Invalid base32 character')
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return Buffer.from(out)
}

// --- Core HOTP/TOTP ---

function hotp(secret, counter) {
  const buf = Buffer.alloc(8)
  buf.writeBigUInt64BE(BigInt(counter))
  const hmac = crypto.createHmac('sha1', secret).update(buf).digest()
  const offset = hmac[hmac.length - 1] & 0x0f
  const code = ((hmac[offset] & 0x7f) << 24 | hmac[offset + 1] << 16 | hmac[offset + 2] << 8 | hmac[offset + 3]) % (10 ** DIGITS)
  return String(code).padStart(DIGITS, '0')
}

function currentCounter(time) {
  return Math.floor((time || Date.now() / 1000) / PERIOD)
}

// --- Public API ---

export function generateSecret() {
  const raw = crypto.randomBytes(SECRET_BYTES)
  return base32Encode(raw)
}

export function generateBackupCodes() {
  const codes = []
  for (let i = 0; i < BACKUP_CODE_COUNT; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase())
  }
  return codes
}

export function totpVerify(secret, code) {
  if (typeof code !== 'string' || code.length !== DIGITS) return false
  const key = base32Decode(secret)
  const counter = currentCounter()
  for (let i = -WINDOW; i <= WINDOW; i++) {
    if (crypto.timingSafeEqual(Buffer.from(hotp(key, counter + i)), Buffer.from(code))) {
      return true
    }
  }
  return false
}

export function totpGenerate(secret) {
  const key = base32Decode(secret)
  return hotp(key, currentCounter())
}

export function buildOtpauthUri(email, secret) {
  const label = encodeURIComponent(`${ISSUER}:${email}`)
  const params = `secret=${secret}&issuer=${encodeURIComponent(ISSUER)}&algorithm=SHA1&digits=${DIGITS}&period=${PERIOD}`
  return `otpauth://totp/${label}?${params}`
}
