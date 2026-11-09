import db from '../db/index.js'

export const ROLES = {
  ADMIN: 'Administrator',
  EMPLOYEE: 'Employee',
  PARTNER: 'Partner',
}

export class UserModel {
  static getAll() {
    return db.read('users')
  }

  static findById(id) {
    return db.findById('users', id)
  }

  static findByEmail(email) {
    const cleanEmail = email.toLowerCase().trim()
    return db.findOne('users', (u) => u.email.toLowerCase() === cleanEmail)
  }

  static findByEmailAndRole(email, role) {
    const cleanEmail = email.toLowerCase().trim()
    return db.findOne(
      'users',
      (u) => u.email.toLowerCase() === cleanEmail && u.role.toLowerCase() === role.toLowerCase()
    )
  }

  static create(userData) {
    const newUser = {
      id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name: userData.name || 'New Learner',
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      role: userData.role || ROLES.EMPLOYEE,
      roleTitle: userData.roleTitle || 'Security Professional',
      department: userData.department || 'Cybersecurity Academy',
      avatar: (userData.name ? userData.name[0] : 'U').toUpperCase(),
      permissions: userData.permissions || ['read_courses', 'labs'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return db.insert('users', newUser)
  }

  static update(id, updates) {
    return db.update('users', id, updates)
  }

  static delete(id) {
    return db.delete('users', id)
  }

  static sanitize(user) {
    if (!user) return null
    const { password, ...safeUser } = user
    return safeUser
  }
}

export default UserModel
