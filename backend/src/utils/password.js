// Password hashing with Node's built-in scrypt (no native deps needed).
// Stored format: scrypt$<N>$<r>$<p>$<saltB64>$<hashB64>
import crypto from 'node:crypto'

const KEYLEN = 64
const PARAMS = { N: 16384, r: 8, p: 1 }

const scrypt = (password, salt, keylen, opts) =>
  new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, { ...opts, maxmem: 64 * 1024 * 1024 }, (err, key) =>
      err ? reject(err) : resolve(key)
    )
  })

export const isHashed = (value) => typeof value === 'string' && value.startsWith('scrypt$')

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16)
  const key = await scrypt(password, salt, KEYLEN, PARAMS)
  return ['scrypt', PARAMS.N, PARAMS.r, PARAMS.p, salt.toString('base64'), key.toString('base64')].join('$')
}

export async function verifyPassword(password, stored) {
  if (!isHashed(stored) || typeof password !== 'string') return false
  const [, N, r, p, saltB64, hashB64] = stored.split('$')
  const expected = Buffer.from(hashB64, 'base64')
  const actual = await scrypt(password, Buffer.from(saltB64, 'base64'), expected.length, {
    N: Number(N),
    r: Number(r),
    p: Number(p),
  })
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
}

// Run a dummy hash so "unknown email" and "wrong password" take similar time
// (prevents discovering which emails are registered via response timing).
const DUMMY_HASH = hashPassword('timing-equaliser')
export async function fakeVerify(password) {
  await verifyPassword(String(password || ''), await DUMMY_HASH)
  return false
}

export function validatePasswordStrength(password) {
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters long.'
  }
  if (password.length > 128) {
    return 'Password must be at most 128 characters long.'
  }
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return 'Password must contain at least one letter and one number.'
  }
  return null
}
