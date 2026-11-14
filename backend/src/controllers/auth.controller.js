import UserModel, { SELF_SIGNUP_ROLES } from '../models/user.model.js'
import AppError from '../utils/AppError.js'
import { revokeToken, getBearerToken } from '../middlewares/auth.middleware.js'
import { signToken, verifyToken } from '../utils/jwt.js'
import { verifyPassword, fakeVerify, validatePasswordStrength } from '../utils/password.js'
import { verifyGoogleCredential } from '../utils/google.js'
import { rateLimit, resetRateLimit, clientIp } from '../utils/rateLimit.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const issueSession = (user, message) => {
  const safeUser = UserModel.sanitize(user)
  return {
    success: true,
    message,
    token: signToken({ sub: user.id, role: user.role }),
    user: safeUser,
  }
}

const trimmed = (v, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export class AuthController {
  static async login(req) {
    const { email, password, role } = req.body || {}
    const cleanEmail = trimmed(email, 254).toLowerCase()

    if (!cleanEmail || !password) {
      throw new AppError('Email and password are required', 400)
    }

    // Per 15 min: 30 attempts per IP and 10 per email (slows password guessing)
    const ip = clientIp(req)
    rateLimit(`login:ip:${ip}`, { limit: 30 })
    rateLimit(`login:email:${cleanEmail}`, { limit: 10 })

    const user = UserModel.findByEmail(cleanEmail)

    if (!user) {
      await fakeVerify(password)
      throw new AppError('Invalid email or password.', 401)
    }

    if (!user.passwordHash) {
      throw new AppError(
        'This account was created with Google. Please use "Sign in with Google".',
        400
      )
    }

    if (!(await verifyPassword(password, user.passwordHash))) {
      throw new AppError('Invalid email or password.', 401)
    }

    if (user.status && user.status !== 'ACTIVE') {
      throw new AppError('This account has been disabled. Contact an administrator.', 403)
    }

    // Role check only after the password is verified, so it can't be used to
    // probe which role an email belongs to.
    if (role && user.role.toLowerCase() !== String(role).toLowerCase()) {
      throw new AppError(
        `This account is registered as "${user.role}". Please choose the ${user.role} tab to sign in.`,
        403
      )
    }

    resetRateLimit(`login:email:${cleanEmail}`)
    return issueSession(user, `Authenticated successfully as ${user.role}`)
  }

  static async register(req) {
    const { name, email, password, role, roleTitle, department } = req.body || {}
    const cleanName = trimmed(name, 80)
    const cleanEmail = trimmed(email, 254).toLowerCase()

    rateLimit(`register:ip:${clientIp(req)}`, { limit: 10, windowMs: 60 * 60 * 1000 })

    if (!cleanName || !cleanEmail || !password) {
      throw new AppError('Name, email, and password are required', 400)
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      throw new AppError('Please enter a valid email address.', 400)
    }
    const weak = validatePasswordStrength(password)
    if (weak) throw new AppError(weak, 400)

    const requestedRole = role || 'Employee'
    if (!SELF_SIGNUP_ROLES.includes(requestedRole)) {
      throw new AppError(
        `You can't sign up as "${requestedRole}". Administrator accounts are created by an existing administrator.`,
        403
      )
    }

    if (UserModel.findByEmail(cleanEmail)) {
      throw new AppError('An account with this email already exists. Try signing in instead.', 409)
    }

    const newUser = await UserModel.create({
      name: cleanName,
      email: cleanEmail,
      password,
      role: requestedRole,
      roleTitle: trimmed(roleTitle) || undefined,
      department: trimmed(department) || undefined,
    })

    return issueSession(newUser, 'Account registered successfully')
  }

  // POST /api/auth/google  { credential, role? }
  // `credential` is the ID token returned by Google Identity Services.
  static async googleLogin(req) {
    rateLimit(`google:ip:${clientIp(req)}`, { limit: 30 })

    const { credential, role } = req.body || {}
    const profile = await verifyGoogleCredential(credential)

    let user = UserModel.findByGoogleId(profile.googleId)

    if (!user) {
      const existing = UserModel.findByEmail(profile.email)
      if (existing) {
        // Google has verified ownership of this email, so it's safe to link
        // the Google identity to the existing account.
        user = UserModel.update(existing.id, {
          googleId: profile.googleId,
          picture: existing.picture || profile.picture,
          authProviders: [...new Set([...(existing.authProviders || ['password']), 'google'])],
        })
      } else {
        const newRole = SELF_SIGNUP_ROLES.includes(role) ? role : 'Employee'
        user = await UserModel.create({
          name: profile.name,
          email: profile.email,
          googleId: profile.googleId,
          picture: profile.picture,
          role: newRole,
        })
      }
    }

    if (user.status && user.status !== 'ACTIVE') {
      throw new AppError('This account has been disabled. Contact an administrator.', 403)
    }

    return issueSession(user, `Signed in with Google as ${user.role}`)
  }

  static async getMe(req) {
    if (!req.user) {
      throw new AppError('Not authenticated', 401)
    }
    return { success: true, user: req.user }
  }

  static async logout(req) {
    const payload = verifyToken(getBearerToken(req))
    if (payload) revokeToken(payload)
    return { success: true, message: 'Signed out successfully' }
  }

  static async getRoles() {
    return {
      success: true,
      roles: [
        {
          id: 'Administrator',
          label: 'Administrator',
          description: 'Full enterprise control, audit logging, system settings, and user provisioning.',
          badge: '🛡️',
          color: 'purple',
          selfSignup: false,
        },
        {
          id: 'Employee',
          label: 'Employee',
          description: 'Internal security operations, firewall sandbox labs, and technical training.',
          badge: '💼',
          color: 'emerald',
          selfSignup: true,
        },
        {
          id: 'Partner',
          label: 'Partner',
          description: 'Authorized training partner portal, organization seats, and co-branded certifications.',
          badge: '🤝',
          color: 'blue',
          selfSignup: true,
        },
      ],
    }
  }
}

export default AuthController
