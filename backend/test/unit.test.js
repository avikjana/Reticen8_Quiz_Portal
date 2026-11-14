import test, { describe, before } from 'node:test'
import assert from 'node:assert/strict'
import { tmpdir } from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'

process.env.JWT_SECRET = 'test-secret-test-secret-test-secret-123456'
process.env.DB_PATH = path.join(tmpdir(), `r8-unit-${crypto.randomUUID()}.db`)
process.env.LOG_LEVEL = 'silent'

describe('password hashing', () => {
  test('hashes verify, and wrong passwords do not', async () => {
    const { hashPassword, verifyPassword, isHashed } = await import('../src/utils/password.js')
    const hash = await hashPassword('Password123')
    assert.ok(isHashed(hash))
    assert.notEqual(hash, 'Password123')
    assert.equal(await verifyPassword('Password123', hash), true)
    assert.equal(await verifyPassword('Password124', hash), false)
  })
})

describe('jwt', () => {
  test('a signed token round-trips; a forged one is rejected', async () => {
    const { signToken, verifyToken } = await import('../src/utils/jwt.js')
    const token = signToken({ sub: 'u1', role: 'Employee' })
    const payload = verifyToken(token)
    assert.equal(payload.sub, 'u1')
    assert.equal(verifyToken(token + 'x'), null)
    assert.equal(verifyToken('a.b.c'), null)
  })

  test('an expired token is rejected', async () => {
    const { signToken, verifyToken } = await import('../src/utils/jwt.js')
    assert.equal(verifyToken(signToken({ sub: 'u1' }, -1)), null)
  })
})

describe('reset tokens', () => {
  test('issue returns a raw token; consume is single-use', async () => {
    const { default: ResetTokenModel } = await import('../src/models/resetToken.model.js')
    const raw = ResetTokenModel.issue('user-123')
    assert.ok(raw.length > 20)
    assert.equal(ResetTokenModel.consume(raw), 'user-123')
    assert.equal(ResetTokenModel.consume(raw), null, 'cannot be reused')
    assert.equal(ResetTokenModel.consume('garbage'), null)
  })
})
