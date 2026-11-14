import crypto from 'node:crypto'
import db from '../db/index.js'
import { hashPassword, isHashed } from '../utils/password.js'

export const ROLES = {
  ADMIN: 'Administrator',
  EMPLOYEE: 'Employee',
  PARTNER: 'Partner',
}

// Roles a visitor may pick for themselves on the public sign-up form.
// Administrators can only be created by an existing administrator.
export const SELF_SIGNUP_ROLES = [ROLES.EMPLOYEE, ROLES.PARTNER]

const DEFAULT_PERMISSIONS = {
  [ROLES.ADMIN]: ['all', 'system_admin', 'user_management', 'audit_logs', 'lab_provisioning'],
  [ROLES.EMPLOYEE]: ['engineer_labs', 'internal_curriculum', 'firewall_sandbox', 'exam_vouchers'],
  [ROLES.PARTNER]: ['partner_portal', 'seat_allocation', 'discounted_vouchers', 'co_branding'],
}

const normaliseEmail = (email) => String(email || '').toLowerCase().trim()

export class UserModel {
  static getAll() {
    return db.read('users')
  }

  static findById(id) {
    return db.findById('users', id)
  }

  static findByEmail(email) {
    const cleanEmail = normaliseEmail(email)
    return db.findOne('users', (u) => normaliseEmail(u.email) === cleanEmail)
  }

  static findByGoogleId(googleId) {
    return db.findOne('users', (u) => u.googleId === googleId)
  }

  static findByEmailAndRole(email, role) {
    const cleanEmail = normaliseEmail(email)
    return db.findOne(
      'users',
      (u) => normaliseEmail(u.email) === cleanEmail && u.role.toLowerCase() === role.toLowerCase()
    )
  }

  // `password` is plain text here; only its hash is stored. Omit it for
  // Google-only accounts.
  static async create(userData) {
    const role = Object.values(ROLES).includes(userData.role) ? userData.role : ROLES.EMPLOYEE
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
    return db.insert('users', newUser)
  }

  static update(id, updates) {
    // Drop undefined values so partial updates don't wipe existing fields
    const clean = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined))
    return db.update('users', id, clean)
  }

  static delete(id) {
    return db.delete('users', id)
  }

  static sanitize(user) {
    if (!user) return null
    // eslint-disable-next-line no-unused-vars
    const { password, passwordHash, ...safeUser } = user
    return safeUser
  }

  // One-time migration: hash any legacy plain-text `password` fields in users.json.
  static async migratePlaintextPasswords() {
    const users = db.read('users')
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
      db.write('users', users)
      console.log(`[auth] Migrated ${changed} plain-text password(s) to scrypt hashes.`)
    }
  }
}

export default UserModel
