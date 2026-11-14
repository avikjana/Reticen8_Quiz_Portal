import UserModel from '../models/user.model.js'
import AppError from '../utils/AppError.js'
import { verifyToken } from '../utils/jwt.js'

// Tokens explicitly signed out before they expire (jti -> exp). In-memory, so
// it resets on restart; move it to Redis/DB if you need durable revocation.
const revokedTokens = new Map()

export function revokeToken(payload) {
  if (payload?.jti) revokedTokens.set(payload.jti, payload.exp)
}

setInterval(() => {
  const now = Math.floor(Date.now() / 1000)
  for (const [jti, exp] of revokedTokens) if (exp < now) revokedTokens.delete(jti)
}, 60 * 60 * 1000).unref()

export const getBearerToken = (req) => {
  const header = req.headers.authorization || ''
  return header.startsWith('Bearer ') ? header.slice(7).trim() : null
}

export const authenticate = async (req, res, next) => {
  const token = getBearerToken(req)
  if (!token) {
    throw new AppError('Authentication required. Please log in.', 401)
  }

  const payload = verifyToken(token)
  if (!payload || revokedTokens.has(payload.jti)) {
    throw new AppError('Your session is invalid or has expired. Please log in again.', 401)
  }

  // Always load the user fresh so deleted/disabled accounts and role changes
  // take effect immediately rather than when the token expires.
  const user = UserModel.findById(payload.sub)
  if (!user || (user.status && user.status !== 'ACTIVE')) {
    throw new AppError('This account is no longer active.', 401)
  }

  req.user = UserModel.sanitize(user)
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
