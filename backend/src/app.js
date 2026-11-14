import http from 'node:http'
import handleAuthRoutes from './routes/auth.routes.js'
import handleAdminRoutes from './routes/admin.routes.js'
import handleEmployeeRoutes from './routes/employee.routes.js'
import handlePartnerRoutes from './routes/partner.routes.js'
import handleUserRoutes from './routes/user.routes.js'
import handleCourseRoutes from './routes/course.routes.js'
import errorHandler from './middlewares/error.middleware.js'
import AppError from './utils/AppError.js'
import db from './db/index.js'

// Parse JSON request bodies safely
const MAX_BODY_BYTES = 1024 * 1024 // 1 MB

const parseRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
      if (body.length > MAX_BODY_BYTES) {
        reject(new AppError('Request body too large', 413))
        req.destroy()
      }
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

// Allowed browser origins (comma-separated), e.g. "http://localhost:5173,https://academy.reticen8.com"
const ALLOWED_ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

// Set standard CORS & headers
export const setCorsHeaders = (res, statusCode = 200) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': res.corsOrigin || ALLOWED_ORIGINS[0],
    Vary: 'Origin',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
}

export const createApp = () => {
  return http.createServer(async (req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
    const pathname = urlObj.pathname
    const method = req.method

    const origin = req.headers.origin
    res.corsOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      setCorsHeaders(res, 204)
      res.end()
      return
    }

    try {
      // Parse body for write methods
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        req.body = await parseRequestBody(req)
      } else {
        req.body = {}
      }

      // 1. Health check
      if (pathname === '/api/health' && method === 'GET') {
        setCorsHeaders(res, 200)
        res.end(
          JSON.stringify({
            status: 'OK',
            service: 'Reticen8 Academy REST API',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
          })
        )
        return
      }

      // 2. Statistics check
      if (pathname === '/api/statistics' && method === 'GET') {
        const stats = db.read('statistics')
        setCorsHeaders(res, 200)
        res.end(JSON.stringify({ success: true, data: stats }))
        return
      }

      // 3. Route Handlers
      let result = null

      result = await handleAuthRoutes(req, res, pathname, method)
      if (result === null) result = await handleAdminRoutes(req, res, pathname, method)
      if (result === null) result = await handleEmployeeRoutes(req, res, pathname, method)
      if (result === null) result = await handlePartnerRoutes(req, res, pathname, method)
      if (result === null) result = await handleUserRoutes(req, res, pathname, method)
      if (result === null) result = await handleCourseRoutes(req, res, pathname, method)

      // 4. Return result if route matched
      if (result !== null) {
        setCorsHeaders(res, 200)
        res.end(JSON.stringify(result))
        return
      }

      // 5. 404 Route Not Found
      throw new AppError(`Route ${method} ${pathname} not found`, 404)
    } catch (err) {
      errorHandler(err, req, res)
    }
  })
}

export default createApp
