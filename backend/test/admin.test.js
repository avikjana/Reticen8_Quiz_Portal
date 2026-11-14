import test, { before, after, describe } from 'node:test'
import assert from 'node:assert/strict'
import { startServer, login } from './helpers.js'

let srv
before(async () => {
  srv = await startServer()
})
after(() => srv.close())

describe('admin user management', () => {
  test('non-admins cannot list or create users', async () => {
    const empToken = await login(srv.api, 'employee')
    assert.equal((await srv.api('GET', '/admin/users', undefined, empToken)).status, 403)
    assert.equal(
      (await srv.api('POST', '/admin/users', { name: 'X', email: 'x@t.com', password: 'Password123' }, empToken)).status,
      403
    )
  })

  test('an admin creates a user, who then appears in the list', async () => {
    const token = await login(srv.api, 'admin')
    const created = await srv.api(
      'POST',
      '/admin/users',
      { name: 'Temp User', email: 'temp@test.com', password: 'Password123', role: 'Employee' },
      token
    )
    assert.equal(created.status, 200)
    assert.equal(created.body.user.email, 'temp@test.com')
    assert.equal(created.body.user.passwordHash, undefined)

    const list = await srv.api('GET', '/admin/users', undefined, token)
    assert.ok(list.body.users.some((u) => u.email === 'temp@test.com'))
  })

  test('creating a user rejects weak passwords and duplicate emails', async () => {
    const token = await login(srv.api, 'admin')
    const weak = await srv.api('POST', '/admin/users', { name: 'W', email: 'w@test.com', password: 'short' }, token)
    assert.equal(weak.status, 400)

    await srv.api('POST', '/admin/users', { name: 'Dup', email: 'dup@test.com', password: 'Password123' }, token)
    const again = await srv.api('POST', '/admin/users', { name: 'Dup2', email: 'dup@test.com', password: 'Password123' }, token)
    assert.equal(again.status, 409)
  })

  test('an admin can delete a user; deleting again is a 404', async () => {
    const token = await login(srv.api, 'admin')
    const created = await srv.api(
      'POST',
      '/admin/users',
      { name: 'Doomed', email: 'doomed@test.com', password: 'Password123' },
      token
    )
    const id = created.body.user.id
    assert.equal((await srv.api('DELETE', `/admin/users/${id}`, undefined, token)).status, 200)
    assert.equal((await srv.api('DELETE', `/admin/users/${id}`, undefined, token)).status, 404)
  })

  test('an admin cannot delete their own account', async () => {
    const token = await login(srv.api, 'admin')
    const me = await srv.api('GET', '/auth/me', undefined, token)
    const res = await srv.api('DELETE', `/admin/users/${me.body.user.id}`, undefined, token)
    assert.equal(res.status, 400)
  })
})
