import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 5000

// Helper to read JSON data files safely
const readJsonFile = (filename) => {
  const filePath = path.join(__dirname, 'data', filename)
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    console.error(`Failed to read data file ${filename}:`, err.message)
    return []
  }
}

// In-memory data collections
const courses = readJsonFile('courses.json')
const certifications = readJsonFile('certifications.json')
const statistics = readJsonFile('statistics.json')
const credentials = readJsonFile('credentials.json')
const users = readJsonFile('users.json')

// Set CORS & JSON headers
const setHeaders = (res, statusCode = 200) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
}

// Request parser
const getRequestBody = (req) => {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        resolve({})
      }
    })
  })
}

// In-memory active sessions map (token -> user)
const activeSessions = new Map()

// Router dispatcher
const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`)
  const pathname = urlObj.pathname
  const method = req.method

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    setHeaders(res, 204)
    res.end()
    return
  }

  // --- API Endpoints ---

  // Health check
  if (pathname === '/api/health' && method === 'GET') {
    setHeaders(res, 200)
    res.end(JSON.stringify({ status: 'OK', uptime: process.uptime(), timestamp: new Date().toISOString() }))
    return
  }

  // --- AUTHENTICATION ENDPOINTS (Administrator, Employee, Partner) ---

  // GET /api/auth/roles - Available categories info
  if (pathname === '/api/auth/roles' && method === 'GET') {
    setHeaders(res, 200)
    res.end(JSON.stringify({
      success: true,
      roles: [
        {
          id: 'Administrator',
          label: 'Administrator',
          description: 'Full enterprise control, audit logging, system settings, and user provisioning.',
          badge: '🛡️',
          color: 'purple'
        },
        {
          id: 'Employee',
          label: 'Employee',
          description: 'Internal security operations, firewall sandbox labs, and technical training.',
          badge: '💼',
          color: 'emerald'
        },
        {
          id: 'Partner',
          label: 'Partner',
          description: 'Authorized training partner portal, organization seat management, and co-branded credentials.',
          badge: '🤝',
          color: 'blue'
        }
      ]
    }))
    return
  }

  // POST /api/auth/login - Role-based authentication
  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = await getRequestBody(req)
    const email = (body.email || '').trim().toLowerCase()
    const password = (body.password || '').trim()
    const role = (body.role || '').trim() // 'Administrator' | 'Employee' | 'Partner'

    if (!email || !password || !role) {
      setHeaders(res, 400)
      res.end(JSON.stringify({
        success: false,
        error: 'Email, password, and category selection (Administrator, Employee, or Partner) are required.'
      }))
      return
    }

    // Match user by email & role
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === email && u.role.toLowerCase() === role.toLowerCase()
    )

    if (!matchedUser) {
      setHeaders(res, 401)
      res.end(JSON.stringify({
        success: false,
        error: `No ${role} account found matching this email address.`
      }))
      return
    }

    if (matchedUser.password !== password) {
      setHeaders(res, 401)
      res.end(JSON.stringify({
        success: false,
        error: 'Incorrect password for this account.'
      }))
      return
    }

    // Successful login - generate token & session
    const token = `r8_auth_${matchedUser.id}_${Date.now()}`
    const { password: _, ...userSafe } = matchedUser
    activeSessions.set(token, userSafe)

    setHeaders(res, 200)
    res.end(JSON.stringify({
      success: true,
      message: `Authenticated successfully as ${matchedUser.role}`,
      token,
      user: userSafe
    }))
    return
  }

  // GET /api/auth/me - Current user session check
  if (pathname === '/api/auth/me' && method === 'GET') {
    const authHeader = req.headers['authorization'] || ''
    const token = authHeader.replace('Bearer ', '').trim() || urlObj.searchParams.get('token')

    if (token && activeSessions.has(token)) {
      setHeaders(res, 200)
      res.end(JSON.stringify({ success: true, user: activeSessions.get(token) }))
    } else {
      setHeaders(res, 401)
      res.end(JSON.stringify({ success: false, error: 'Unauthorized or session expired' }))
    }
    return
  }

  // POST /api/auth/logout - Clear session
  if (pathname === '/api/auth/logout' && method === 'POST') {
    const authHeader = req.headers['authorization'] || ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (token) activeSessions.delete(token)

    setHeaders(res, 200)
    res.end(JSON.stringify({ success: true, message: 'Logged out successfully' }))
    return
  }

  // GET /api/statistics
  if (pathname === '/api/statistics' && method === 'GET') {
    setHeaders(res, 200)
    res.end(JSON.stringify({ success: true, data: statistics }))
    return
  }

  // GET /api/courses
  if (pathname === '/api/courses' && method === 'GET') {
    const search = urlObj.searchParams.get('search')?.toLowerCase() || ''
    const category = urlObj.searchParams.get('category') || ''
    const difficulty = urlObj.searchParams.get('difficulty') || ''

    let result = [...courses]

    if (search) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search) ||
          (c.skills && c.skills.some((s) => s.toLowerCase().includes(search)))
      )
    }

    if (category && category !== 'All Categories') {
      result = result.filter((c) => c.category === category)
    }

    if (difficulty && difficulty !== 'All Difficulties') {
      result = result.filter((c) => c.difficulty === difficulty)
    }

    setHeaders(res, 200)
    res.end(JSON.stringify({ success: true, count: result.length, data: result }))
    return
  }

  // GET /api/courses/:id
  if (pathname.startsWith('/api/courses/') && method === 'GET') {
    const id = pathname.replace('/api/courses/', '')
    const course = courses.find((c) => c.id === id)

    if (course) {
      setHeaders(res, 200)
      res.end(JSON.stringify({ success: true, data: course }))
    } else {
      setHeaders(res, 404)
      res.end(JSON.stringify({ success: false, error: 'Course not found' }))
    }
    return
  }

  // GET /api/certifications
  if (pathname === '/api/certifications' && method === 'GET') {
    setHeaders(res, 200)
    res.end(JSON.stringify({ success: true, count: certifications.length, data: certifications }))
    return
  }

  // GET /api/certifications/:id
  if (pathname.startsWith('/api/certifications/') && method === 'GET') {
    const id = pathname.replace('/api/certifications/', '').toLowerCase()
    const cert = certifications.find((c) => c.id === id || c.code.toLowerCase() === id)

    if (cert) {
      setHeaders(res, 200)
      res.end(JSON.stringify({ success: true, data: cert }))
    } else {
      setHeaders(res, 404)
      res.end(JSON.stringify({ success: false, error: 'Certification not found' }))
    }
    return
  }

  // POST /api/verify - Verify candidate credentials
  if (pathname === '/api/verify' && method === 'POST') {
    const body = await getRequestBody(req)
    const serial = (body.serial || body.credentialId || '').trim().toUpperCase()

    if (!serial) {
      setHeaders(res, 400)
      res.end(JSON.stringify({ success: false, error: 'Credential serial number is required' }))
      return
    }

    const match = credentials.find((c) => c.credentialId.toUpperCase() === serial)

    if (match) {
      setHeaders(res, 200)
      res.end(JSON.stringify({ success: true, verified: true, data: match }))
    } else {
      // Simulate dynamic verification for sandbox demonstration if formatted with R8-
      if (serial.startsWith('R8-')) {
        setHeaders(res, 200)
        res.end(
          JSON.stringify({
            success: true,
            verified: true,
            data: {
              credentialId: serial,
              status: 'ACTIVE_VERIFIED',
              candidateName: body.candidateName || 'Verified Security Engineer',
              certificationCode: 'RCFP',
              certificationTitle: 'Reticen8 Certified Firewall Professional',
              issueDate: 'October 2026',
              expirationDate: 'October 2029',
              score: '880 / 1000',
              proctoredCenter: 'Reticen8 Authorized Global PearsonVUE',
            },
          })
        )
      } else {
        setHeaders(res, 404)
        res.end(JSON.stringify({ success: false, verified: false, error: 'No verified credential found for this serial' }))
      }
    }
    return
  }

  // POST /api/terminal/exec - Sandbox CLI execution
  if (pathname === '/api/terminal/exec' && method === 'POST') {
    const body = await getRequestBody(req)
    const cmd = (body.command || '').trim().toLowerCase()

    let output = `Command not recognized: "${cmd}". Type "help" for a list of commands.`
    if (cmd === 'help') {
      output = 'Available commands: show firewall policy, show interfaces, verify, set rule, commit, clear'
    } else if (cmd.includes('show firewall policy')) {
      output = 'ID  NAME             ACTION  SRC-ZONE  DST-ZONE  APP-ID\n1   WAN-to-LAN-Web   ALLOW   WAN       LAN       HTTPS/TLS1.3\n2   Threat-Deny-C2   DENY    WAN       LAN       Malware/Botnet\n3   Default-Deny     DENY    ANY       ANY       ANY'
    } else if (cmd.includes('show interfaces')) {
      output = 'ge-0/0/0 (WAN)  IP: 203.0.113.10/24  STATUS: UP   SPEED: 1Gbps\nge-0/0/1 (LAN)  IP: 192.168.1.1/24   STATUS: UP   SPEED: 1Gbps'
    } else if (cmd.includes('verify')) {
      output = '✓ Verification test: PASS\nAll ingress traffic correctly inspected against Reticen8 Heuristic Threat Engine.'
    }

    setHeaders(res, 200)
    res.end(JSON.stringify({ success: true, command: cmd, output }))
    return
  }

  // 404 Fallback
  setHeaders(res, 404)
  res.end(JSON.stringify({ success: false, error: 'API route not found' }))
})

server.listen(PORT, () => {
  console.log(`\n🚀 Reticen8 Academy REST API Server running at http://localhost:${PORT}`)
  console.log(`🔐 Auth Endpoints:`)
  console.log(`   - POST /api/auth/login   (Administrator, Employee, Partner)`)
  console.log(`   - GET  /api/auth/me`)
  console.log(`   - POST /api/auth/logout`)
  console.log(`   - GET  /api/auth/roles\n`)
})
