import test, { before, after, describe } from 'node:test'
import assert from 'node:assert/strict'
import { startServer, login } from './helpers.js'

let srv
before(async () => {
  srv = await startServer()
})
after(() => srv.close())

describe('course visibility by role', () => {
  test('visitors see the full catalog', async () => {
    const { status, body } = await srv.api('GET', '/courses')
    assert.equal(status, 200)
    assert.equal(body.data.length, 4)
  })

  test('the catalog never exposes the lesson curriculum', async () => {
    const { body } = await srv.api('GET', '/courses')
    assert.ok(body.data.every((c) => !('curriculum' in c)))
  })

  test('a Partner sees only the NGFW course', async () => {
    const token = await login(srv.api, 'partner')
    const { body } = await srv.api('GET', '/courses', undefined, token)
    assert.deepEqual(
      body.data.map((c) => c.id),
      ['reticen8-ngfw-professional']
    )
  })

  test('an Employee sees every course', async () => {
    const token = await login(srv.api, 'employee')
    const { body } = await srv.api('GET', '/courses', undefined, token)
    assert.equal(body.data.length, 4)
  })

  test('course detail requires a signed-in user', async () => {
    const { status } = await srv.api('GET', '/courses/network-security-fundamentals')
    assert.equal(status, 401)
  })

  test('a Partner is blocked from a course outside their role', async () => {
    const token = await login(srv.api, 'partner')
    const ngfw = await srv.api('GET', '/courses/reticen8-ngfw-professional', undefined, token)
    assert.equal(ngfw.status, 200)
    const blocked = await srv.api('GET', '/courses/advanced-firewall-security', undefined, token)
    assert.equal(blocked.status, 403)
  })
})
