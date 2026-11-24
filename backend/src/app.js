import http from 'node:http'
import { logRequest } from './utils/logger.js'
import handleAuthRoutes from './routes/auth.routes.js'
import handleAdminRoutes from './routes/admin.routes.js'
import handleCustomerRoutes from './routes/customer.routes.js'
import handlePartnerRoutes from './routes/partner.routes.js'
import handleUserRoutes from './routes/user.routes.js'
import handleCourseRoutes from './routes/course.routes.js'
import handleCertificationRoutes from './routes/certification.routes.js'
import handleEnrollmentRoutes from './routes/enrollment.routes.js'
import handleChatRoutes from './routes/chat.routes.js'
import handleQuizRoutes from './routes/quiz.routes.js'
import errorHandler from './middlewares/error.middleware.js'
import AppError from './utils/AppError.js'
import AuthController from './controllers/auth.controller.js'
import db from './db/index.js'

const MAX_BODY_BYTES = 1024 * 1024

// Pre-serialized static responses — avoids JSON.stringify on every call
const ROLES_JSON = JSON.stringify(AuthController.ROLES_RESPONSE)

const parseRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        reject(new AppError('Request body too large', 413))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString()
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        resolve({})
      }
    })
  })
}

const ALLOWED_ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

const CORS_HEADERS_BASE = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Connection': 'keep-alive',
  Vary: 'Origin',
}

export const setCorsHeaders = (res, statusCode = 200) => {
  res.writeHead(statusCode, {
    ...CORS_HEADERS_BASE,
    'Access-Control-Allow-Origin': res.corsOrigin || ALLOWED_ORIGINS[0],
  })
}

// Prefix-based route dispatch — avoids calling handlers that can't match
const ROUTE_TABLE = [
  { prefix: '/api/auth', handler: handleAuthRoutes },
  { prefix: '/api/admin', handler: handleAdminRoutes },
  { prefix: '/api/customer', handler: handleCustomerRoutes },
  { prefix: '/api/partner', handler: handlePartnerRoutes },
  { prefix: '/api/users', handler: handleUserRoutes },
  { prefix: '/api/courses', handler: handleCourseRoutes },
  { prefix: '/api/certifications', handler: handleCertificationRoutes },
  { prefix: '/api/enrollments', handler: handleEnrollmentRoutes },
  { prefix: '/api/chat', handler: handleChatRoutes },
  { prefix: '/api/admin/quiz', handler: handleQuizRoutes },
  { prefix: '/api/quiz', handler: handleQuizRoutes },
]

const HEALTH_JSON = JSON.stringify({
  status: 'OK',
  service: 'Reticen8 Academy REST API',
})

export const createApp = () => {
  const server = http.createServer(async (req, res) => {
    const start = performance.now()
    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
    const pathname = urlObj.pathname
    const method = req.method

    const origin = req.headers.origin
    res.corsOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]

    logRequest(req, res)

    if (method === 'OPTIONS') {
      setCorsHeaders(res, 204)
      res.end()
      return
    }

    try {
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        req.body = await parseRequestBody(req)
      } else {
        req.body = {}
      }

      // Fast health check — no DB
      if (pathname === '/api/health' && method === 'GET') {
        setCorsHeaders(res, 200)
        res.end(HEALTH_JSON)
        return
      }

      // Fast static response — no DB, no auth
      if (pathname === '/api/auth/roles' && method === 'GET') {
        setCorsHeaders(res, 200)
        res.end(ROLES_JSON)
        return
      }

      if (pathname === '/api/statistics' && method === 'GET') {
        const stats = await db.read('statistics')
        setCorsHeaders(res, 200)
        res.end(JSON.stringify({ success: true, data: stats }))
        console.log(`[PERF] ${method} ${pathname} ${(performance.now() - start).toFixed(1)}ms`)
        return
      }

      // Dispatch by prefix — try matching handlers, fall through on null
      let result = null
      for (const route of ROUTE_TABLE) {
        if (pathname.startsWith(route.prefix)) {
          result = await route.handler(req, res, pathname, method)
          if (result !== null) break
        }
      }

      if (result !== null) {
        setCorsHeaders(res, 200)
        res.end(JSON.stringify(result))
        console.log(`[PERF] ${method} ${pathname} ${(performance.now() - start).toFixed(1)}ms`)
        return
      }

      throw new AppError(`Route ${method} ${pathname} not found`, 404)
    } catch (err) {
      errorHandler(err, req, res)
      console.log(`[PERF] ${method} ${pathname} ${(performance.now() - start).toFixed(1)}ms ERR`)
    }
  })

  server.keepAliveTimeout = 65000
  server.headersTimeout = 66000

  return server
}

export default createApp
