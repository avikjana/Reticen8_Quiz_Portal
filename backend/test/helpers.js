// Shared test harness: boots the real HTTP app on an ephemeral port backed by a
// throwaway SQLite database seeded from the committed JSON files.
import { tmpdir } from 'node:os'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'

export async function startServer() {
  process.env.JWT_SECRET = 'test-secret-test-secret-test-secret-123456'
  process.env.LOG_LEVEL = 'silent'
  process.env.NODE_ENV = 'test'
  process.env.CLIENT_ORIGIN = 'http://localhost:5173'
  const dbPath = path.join(tmpdir(), `r8-test-${crypto.randomUUID()}.db`)
  process.env.DB_PATH = dbPath

  const { createApp } = await import('../src/app.js')
  const server = createApp()
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}/api`

  const api = async (method, pathname, body, token) => {
    const res = await fetch(base + pathname, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    let json = null
    try {
      json = await res.json()
    } catch {
      /* no body */
    }
    return { status: res.status, body: json }
  }

  const close = () => {
    server.close()
    for (const suffix of ['', '-wal', '-shm']) fs.rmSync(dbPath + suffix, { force: true })
  }

  return { api, base, close }
}

export const creds = {
  admin: { email: 'admin@reticen8.com', password: 'AdminPassword123!' },
  employee: { email: 'employee@reticen8.com', password: 'EmployeePassword123!' },
  partner: { email: 'partner@reticen8.com', password: 'PartnerPassword123!' },
}

export async function login(api, who) {
  const { body } = await api('POST', '/auth/login', creds[who])
  return body.token
}
