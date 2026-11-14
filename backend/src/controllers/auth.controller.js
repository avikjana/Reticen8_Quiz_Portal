import UserModel, { SELF_SIGNUP_ROLES } from '../models/user.model.js'
import AppError from '../utils/AppError.js'
import { revokeToken, getBearerToken } from '../middlewares/auth.middleware.js'
import { signToken, verifyToken } from '../utils/jwt.js'
import { verifyPassword, fakeVerify, hashPassword } from '../utils/password.js'
import { verifyGoogleCredential } from '../utils/google.js'
import { rateLimit, resetRateLimit, clientIp } from '../utils/rateLimit.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  loginSchema,
  registerSchema,
  googleSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validation/schemas.js'
import ResetTokenModel from '../models/resetToken.model.js'
import { sendPasswordResetEmail } from '../utils/email.js'

const clientBaseUrl = () => (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',')[0].trim()

const issueSession = (user, message) => {
  const safeUser = UserModel.sanitize(user)
  return {
    success: true,
    message,
    token: signToken({ sub: user.id, role: user.role }),
    user: safeUser,
  }
}

export class AuthController {
  static async login(req) {
    // email is trimmed + lowercased by the schema
    const { email: cleanEmail, password, role } = validate(loginSchema, req.body)

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
    rateLimit(`register:ip:${clientIp(req)}`, { limit: 10, windowMs: 60 * 60 * 1000 })

    // Schema trims/validates and defaults role to Employee
    const { name, email, password, role, roleTitle, department } = validate(registerSchema, req.body)

    if (!SELF_SIGNUP_ROLES.includes(role)) {
      throw new AppError(
        `You can't sign up as "${role}". Administrator accounts are created by an existing administrator.`,
        403
      )
    }

    if (UserModel.findByEmail(email)) {
      throw new AppError('An account with this email already exists. Try signing in instead.', 409)
    }

    const newUser = await UserModel.create({ name, email, password, role, roleTitle, department })

    return issueSession(newUser, 'Account registered successfully')
  }

  // POST /api/auth/google  { credential, role? }
  // `credential` is the ID token returned by Google Identity Services.
  static async googleLogin(req) {
    rateLimit(`google:ip:${clientIp(req)}`, { limit: 30 })

    const { credential, role } = validate(googleSchema, req.body)
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

  // POST /api/auth/forgot-password { email }
  // Always responds the same way, so it can't be used to discover which emails
  // are registered. If the account exists, a reset link is emailed.
  static async forgotPassword(req) {
    rateLimit(`forgot:ip:${clientIp(req)}`, { limit: 10, windowMs: 60 * 60 * 1000 })
    const { email } = validate(forgotPasswordSchema, req.body)

    const generic = {
      success: true,
      message: 'If an account exists for that email, a password reset link has been sent.',
    }

    const user = UserModel.findByEmail(email)
    if (!user || (user.status && user.status !== 'ACTIVE')) return generic

    const rawToken = ResetTokenModel.issue(user.id)
    const resetUrl = `${clientBaseUrl()}/reset-password?token=${rawToken}`
    try {
      await sendPasswordResetEmail(user.email, resetUrl)
    } catch (err) {
      console.error('[auth] Failed to send reset email:', err.message)
      // Still respond generically — don't leak that the account exists.
    }
    return generic
  }

  // POST /api/auth/reset-password { token, password }
  static async resetPassword(req) {
    rateLimit(`reset:ip:${clientIp(req)}`, { limit: 20 })
    const { token, password } = validate(resetPasswordSchema, req.body)

    const userId = ResetTokenModel.consume(token)
    if (!userId) {
      throw new AppError('This reset link is invalid or has expired. Please request a new one.', 400)
    }
    const user = UserModel.findById(userId)
    if (!user) throw new AppError('Account not found.', 404)

    const passwordHash = await hashPassword(password)
    const authProviders = [...new Set([...(user.authProviders || []), 'password'])]
    UserModel.update(userId, { passwordHash, authProviders })
    ResetTokenModel.clearForUser(userId) // invalidate any other outstanding links

    return { success: true, message: 'Your password has been reset. You can now sign in.' }
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
