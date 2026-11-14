import test, { before, after, describe } from 'node:test'
import assert from 'node:assert/strict'
import { startServer, login, creds } from './helpers.js'

let srv
before(async () => {
  srv = await startServer()
})
after(() => srv.close())

describe('auth', () => {
  test('health check', async () => {
    const { status, body } = await srv.api('GET', '/health')
    assert.equal(status, 200)
    assert.equal(body.status, 'OK')
  })

  test('login succeeds with correct credentials (and is case-insensitive)', async () => {
    const { status, body } = await srv.api('POST', '/auth/login', {
      email: 'Admin@Reticen8.com',
      password: creds.admin.password,
    })
    assert.equal(status, 200)
    assert.ok(body.token)
    assert.equal(body.user.role, 'Administrator')
    assert.equal(body.user.passwordHash, undefined, 'must not leak the password hash')
  })

  test('login fails with a generic message on wrong password', async () => {
    const { status, body } = await srv.api('POST', '/auth/login', {
      email: creds.admin.email,
      password: 'wrong',
    })
    assert.equal(status, 401)
    assert.equal(body.error, 'Invalid email or password.')
  })

  test('login gives the same error for an unknown email (no account enumeration)', async () => {
    const { status, body } = await srv.api('POST', '/auth/login', {
      email: 'nobody@nowhere.test',
      password: 'whatever',
    })
    assert.equal(status, 401)
    assert.equal(body.error, 'Invalid email or password.')
  })

  test('register rejects weak passwords', async () => {
    const { status } = await srv.api('POST', '/auth/register', {
      name: 'Weak',
      email: 'weak@test.com',
      password: 'short',
    })
    assert.equal(status, 400)
  })

  test('register cannot create an Administrator', async () => {
    const { status } = await srv.api('POST', '/auth/register', {
      name: 'Sneaky',
      email: 'sneaky@test.com',
      password: 'Password123',
      role: 'Administrator',
    })
    assert.equal(status, 403)
  })

  test('register succeeds, then the email is taken', async () => {
    const ok = await srv.api('POST', '/auth/register', {
      name: '  New Learner ',
      email: ' New@Test.com ',
      password: 'Password123',
      role: 'Partner',
    })
    assert.equal(ok.status, 200)
    assert.equal(ok.body.user.email, 'new@test.com', 'email is normalised')
    assert.equal(ok.body.user.name, 'New Learner', 'name is trimmed')

    const dup = await srv.api('POST', '/auth/register', {
      name: 'Again',
      email: 'new@test.com',
      password: 'Password123',
    })
    assert.equal(dup.status, 409)
  })

  test('/auth/me requires a token and returns the user', async () => {
    const anon = await srv.api('GET', '/auth/me')
    assert.equal(anon.status, 401)

    const token = await login(srv.api, 'employee')
    const me = await srv.api('GET', '/auth/me', undefined, token)
    assert.equal(me.status, 200)
    assert.equal(me.body.user.email, creds.employee.email)
  })

  test('logout revokes the token', async () => {
    const token = await login(srv.api, 'partner')
    assert.equal((await srv.api('GET', '/auth/me', undefined, token)).status, 200)
    await srv.api('POST', '/auth/logout', {}, token)
    assert.equal((await srv.api('GET', '/auth/me', undefined, token)).status, 401)
  })

  test('a tampered token is rejected', async () => {
    const token = await login(srv.api, 'admin')
    const tampered = token.slice(0, -2) + (token.endsWith('a') ? 'bb' : 'aa')
    assert.equal((await srv.api('GET', '/auth/me', undefined, tampered)).status, 401)
  })

  test('forgot-password always responds the same (no enumeration)', async () => {
    const known = await srv.api('POST', '/auth/forgot-password', { email: creds.employee.email })
    const unknown = await srv.api('POST', '/auth/forgot-password', { email: 'ghost@test.com' })
    assert.equal(known.status, 200)
    assert.equal(known.body.message, unknown.body.message)
  })

  test('reset-password rejects an invalid token', async () => {
    const { status } = await srv.api('POST', '/auth/reset-password', {
      token: 'not-a-real-token',
      password: 'Password123',
    })
    assert.equal(status, 400)
  })
})

describe('credential verification', () => {
  test('a real credential verifies', async () => {
    const { status, body } = await srv.api('GET', '/credentials/R8-2026-RCFP-8492')
    assert.equal(status, 200)
    assert.equal(body.data.certificationCode, 'RCFP')
  })

  test('an unknown credential returns 404', async () => {
    const { status } = await srv.api('GET', '/credentials/FAKE-000')
    assert.equal(status, 404)
  })
})
