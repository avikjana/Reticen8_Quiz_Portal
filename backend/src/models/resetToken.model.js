import crypto from 'node:crypto'
import db from '../db/index.js'

// Password-reset tokens. The raw token is emailed to the user; only its SHA-256
// hash is stored, so a database leak can't be used to reset anyone's password.
const TTL_MS = 60 * 60 * 1000 // 1 hour
const hashToken = (raw) => crypto.createHash('sha256').update(raw).digest('hex')

export const ResetTokenModel = {
  // Returns the raw token to email; stores only its hash.
  issue(userId) {
    const raw = crypto.randomBytes(32).toString('base64url')
    db.insert('resetTokens', {
      token: hashToken(raw),
      userId,
      expiresAt: Date.now() + TTL_MS,
      createdAt: new Date().toISOString(),
    })
    return raw
  },

  // Single-use: the token is deleted on lookup. Returns userId, or null if the
  // token is unknown or expired.
  consume(raw) {
    const record = db.findById('resetTokens', hashToken(raw))
    if (!record) return null
    db.delete('resetTokens', record.token)
    if (record.expiresAt < Date.now()) return null
    return record.userId
  },

  clearForUser(userId) {
    for (const t of db.read('resetTokens')) {
      if (t.userId === userId) db.delete('resetTokens', t.token)
    }
  },
}

export default ResetTokenModel
