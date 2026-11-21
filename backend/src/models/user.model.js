import crypto from 'node:crypto'
import db from '../db/index.js'
import { hashPassword, isHashed } from '../utils/password.js'

export const ROLES = {
  ADMIN: 'Administrator',
  CUSTOMER: 'Customer',
  PARTNER: 'Partner',
}

export const SELF_SIGNUP_ROLES = [ROLES.CUSTOMER, ROLES.PARTNER]

const DEFAULT_PERMISSIONS = {
  [ROLES.ADMIN]: ['all', 'system_admin', 'user_management', 'audit_logs', 'lab_provisioning'],
  [ROLES.CUSTOMER]: ['customer_labs', 'internal_curriculum', 'firewall_sandbox', 'exam_vouchers'],
  [ROLES.PARTNER]: ['partner_portal', 'seat_allocation', 'discounted_vouchers', 'co_branding'],
}

const normaliseEmail = (email) => String(email || '').toLowerCase().trim()

export class UserModel {
  static async getAll() {
    return await db.read('users')
  }

  static async findById(id) {
    return await db.findById('users', id)
  }

  static async findByEmail(email) {
    const cleanEmail = normaliseEmail(email)
    return await db.findOne('users', { email: cleanEmail })
  }

  static async findByGoogleId(googleId) {
    return await db.findOne('users', { googleId })
  }

  static async findByEmailAndRole(email, role) {
    const cleanEmail = normaliseEmail(email)
    return await db.findOne('users', {
      email: cleanEmail,
      role: { $regex: new RegExp(`^${role}$`, 'i') }
    })
  }

  static async create(userData) {
    const role = Object.values(ROLES).includes(userData.role) ? userData.role : ROLES.CUSTOMER
    const now = new Date().toISOString()
    const newUser = {
      id: `usr-${crypto.randomUUID()}`,
      name: userData.name || 'New Learner',
      email: normaliseEmail(userData.email),
      passwordHash: userData.password ? await hashPassword(userData.password) : null,
      googleId: userData.googleId || null,
      picture: userData.picture || null,
      authProviders: userData.authProviders || (userData.googleId ? ['google'] : ['password']),
      role,
      roleTitle: userData.roleTitle || 'Security Professional',
      department: userData.department || 'Cybersecurity Academy',
      avatar: (userData.name ? userData.name[0] : 'U').toUpperCase(),
      permissions: userData.permissions || DEFAULT_PERMISSIONS[role],
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    }
    return await db.insert('users', newUser)
  }

  static async update(id, updates) {
    const clean = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined))
    return await db.update('users', id, clean)
  }

  static async delete(id) {
    return await db.delete('users', id)
  }

  static sanitize(user) {
    if (!user) return null
    const { password, passwordHash, ...safeUser } = user
    return safeUser
  }

  static async migratePlaintextPasswords() {
    const users = await db.read('users')
    let changed = 0
    for (const u of users) {
      if (typeof u.password === 'string' && !isHashed(u.password)) {
        u.passwordHash = await hashPassword(u.password)
        delete u.password
        u.authProviders = u.authProviders || ['password']
        changed++
      } else if (isHashed(u.password)) {
        u.passwordHash = u.password
        delete u.password
        changed++
      }
    }
    if (changed) {
      await db.write('users', users)
      console.log(`[auth] Migrated ${changed} plain-text password(s) to scrypt hashes.`)
    }
  }
}

export default UserModel
