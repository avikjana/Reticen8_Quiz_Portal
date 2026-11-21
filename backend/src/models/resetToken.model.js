import crypto from 'node:crypto'
import db from '../db/index.js'

const TTL_MS = 60 * 60 * 1000
const hashToken = (raw) => crypto.createHash('sha256').update(raw).digest('hex')

export const ResetTokenModel = {
  async issue(userId) {
    const raw = crypto.randomBytes(32).toString('base64url')
    await db.insert('resetTokens', {
      token: hashToken(raw),
      userId,
      expiresAt: Date.now() + TTL_MS,
      createdAt: new Date().toISOString(),
    })
    return raw
  },

  async consume(raw) {
    const record = await db.findById('resetTokens', hashToken(raw))
    if (!record) return null
    await db.delete('resetTokens', record.token)
    if (record.expiresAt < Date.now()) return null
    return record.userId
  },

  async clearForUser(userId) {
    await db.db.collection('resetTokens').deleteMany({ userId })
  },
}

export default ResetTokenModel
