import UserModel from '../models/user.model.js'
import AppError from '../utils/AppError.js'
import { sessionStore } from '../middlewares/auth.middleware.js'

export class AuthController {
  static async login(req, res) {
    const { email, password, role } = req.body || {}

    if (!email || !password) {
      throw new AppError('Email and password are required', 400)
    }

    const user = UserModel.findByEmail(email)

    if (!user) {
      throw new AppError(`No account registered with email "${email}".`, 404)
    }

    // Role check if specified
    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
      throw new AppError(
        `Role mismatch: This account is registered as "${user.role}", but you attempted to login under "${role}".`,
        403
      )
    }

    // Password verification
    if (user.password !== password) {
      throw new AppError('Incorrect password for this account.', 401)
    }

    // Generate session token
    const token = `r8_auth_${user.role.toLowerCase()}_${user.id}_${Date.now().toString(36)}`
    const safeUser = UserModel.sanitize(user)

    sessionStore.set(token, {
      user: safeUser,
      token,
      loginAt: new Date().toISOString(),
    })

    return {
      success: true,
      message: `Authenticated successfully as ${user.role}`,
      token,
      user: safeUser,
    }
  }

  static async register(req, res) {
    const { name, email, password, role, roleTitle, department } = req.body || {}

    if (!email || !password || !name) {
      throw new AppError('Name, email, and password are required', 400)
    }

    const existing = UserModel.findByEmail(email)
    if (existing) {
      throw new AppError(`User with email "${email}" already exists.`, 409)
    }

    const newUser = UserModel.create({
      name,
      email,
      password,
      role: role || 'Employee',
      roleTitle,
      department,
    })

    const token = `r8_auth_${newUser.role.toLowerCase()}_${newUser.id}_${Date.now().toString(36)}`
    const safeUser = UserModel.sanitize(newUser)

    sessionStore.set(token, {
      user: safeUser,
      token,
      loginAt: new Date().toISOString(),
    })

    return {
      success: true,
      message: 'Account registered successfully',
      token,
      user: safeUser,
    }
  }

  static async getMe(req, res) {
    if (!req.user) {
      throw new AppError('Not authenticated', 401)
    }
    return {
      success: true,
      user: req.user,
    }
  }

  static async logout(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      sessionStore.delete(token)
    }
    return {
      success: true,
      message: 'Signed out successfully',
    }
  }

  static async getRoles(req, res) {
    return {
      success: true,
      roles: [
        {
          id: 'Administrator',
          label: 'Administrator',
          description: 'Full enterprise control, audit logging, system settings, and user provisioning.',
          badge: '🛡️',
          color: 'purple',
        },
        {
          id: 'Employee',
          label: 'Employee',
          description: 'Internal security operations, firewall sandbox labs, and technical training.',
          badge: '💼',
          color: 'emerald',
        },
        {
          id: 'Partner',
          label: 'Partner',
          description: 'Authorized training partner portal, organization seats, and co-branded certifications.',
          badge: '🤝',
          color: 'blue',
        },
      ],
    }
  }
}

export default AuthController
