import UserModel from '../models/user.model.js'
import AppError from '../utils/AppError.js'
import { verifyToken } from '../utils/jwt.js'

// Tokens explicitly signed out before they expire (jti -> exp). In-memory, so
// it resets on restart; move it to Redis/DB if you need durable revocation.
const revokedTokens = new Map()

export function revokeToken(payload) {
  if (payload?.jti) {
    revokedTokens.set(payload.jti, payload.exp)
    authUserCache.delete(payload.sub)
  }
}

setInterval(() => {
  const now = Math.floor(Date.now() / 1000)
  for (const [jti, exp] of revokedTokens) if (exp < now) revokedTokens.delete(jti)
}, 60 * 60 * 1000).unref()

// Fast in-memory cache for authenticated users — avoids a DB round-trip on
// every protected request. Short TTL (3s) so role/status changes propagate
// quickly. Keyed by user ID, stores the already-sanitized user object.
const AUTH_CACHE_TTL = 3_000
const authUserCache = new Map()

function getCachedUser(userId) {
  const entry = authUserCache.get(userId)
  if (!entry) return undefined
  if (Date.now() - entry.ts > AUTH_CACHE_TTL) {
    authUserCache.delete(userId)
    return undefined
  }
  return entry.user
}

function setCachedUser(userId, user) {
  authUserCache.set(userId, { user, ts: Date.now() })
}

export function invalidateAuthCache(userId) {
  if (userId) authUserCache.delete(userId)
  else authUserCache.clear()
}

setInterval(() => {
  const now = Date.now()
  for (const [id, entry] of authUserCache) {
    if (now - entry.ts > AUTH_CACHE_TTL) authUserCache.delete(id)
  }
}, 30_000).unref()

export const getBearerToken = (req) => {
  const header = req.headers.authorization || ''
  return header.startsWith('Bearer ') ? header.slice(7).trim() : null
}

const AUTH_PROJECTION = { id: 1, name: 1, email: 1, role: 1, status: 1, picture: 1, avatar: 1, permissions: 1, roleTitle: 1, department: 1, authProviders: 1, googleId: 1, createdAt: 1, updatedAt: 1 }

export const authenticate = async (req, res, next) => {
  const token = getBearerToken(req)
  if (!token) {
    throw new AppError('Authentication required. Please log in.', 401)
  }

  const payload = verifyToken(token)
  if (!payload || revokedTokens.has(payload.jti)) {
    throw new AppError('Your session is invalid or has expired. Please log in again.', 401)
  }

  const cached = getCachedUser(payload.sub)
  if (cached) {
    req.user = cached
    req.tokenPayload = payload
    if (next) next()
    return
  }

  const user = await UserModel.findById(payload.sub, AUTH_PROJECTION)
  if (!user || (user.status && user.status !== 'ACTIVE')) {
    throw new AppError('This account is no longer active.', 401)
  }

  const safeUser = UserModel.sanitize(user)
  setCachedUser(payload.sub, safeUser)
  req.user = safeUser
  req.tokenPayload = payload
  if (next) next()
}

// For public routes that show more or less depending on who is asking:
// sets req.user when a valid token is sent, otherwise carries on as a visitor.
export const authenticateOptional = async (req, res) => {
  if (!getBearerToken(req)) return
  try {
    await authenticate(req, res)
  } catch {
    req.user = undefined
  }
}

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('Authentication required.', 401)
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        `Access denied. Role "${req.user.role}" does not have permission for this resource. Required: ${allowedRoles.join(' or ')}`,
        403
      )
    }

    if (next) next()
  }
}

export default { authenticate, requireRole, revokeToken }
