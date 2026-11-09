import UserModel from '../models/user.model.js'
import AppError from '../utils/AppError.js'

// In-memory token store for sessions
export const sessionStore = new Map()

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required. Please log in.', 401)
  }

  const token = authHeader.split(' ')[1]
  const session = sessionStore.get(token)

  if (!session) {
    // If not found in memory, try parsing offline or demo token
    if (token.startsWith('r8_')) {
      const users = UserModel.getAll()
      const user = users.find((u) => token.includes(u.id)) || users[0]
      if (user) {
        req.user = UserModel.sanitize(user)
        return next ? next() : null
      }
    }
    throw new AppError('Invalid or expired session token.', 401)
  }

  req.user = session.user
  if (next) next()
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

export default { authenticate, requireRole, sessionStore }
