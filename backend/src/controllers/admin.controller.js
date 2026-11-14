import { validatePasswordStrength } from '../utils/password.js'
import UserModel from '../models/user.model.js'
import CourseModel from '../models/course.model.js'
import db from '../db/index.js'
import AppError from '../utils/AppError.js'

export class AdminController {
  static async getOverview(req, res) {
    const users = UserModel.getAll()
    const courses = CourseModel.getAll()
    const stats = db.read('statistics')

    return {
      success: true,
      data: {
        totalUsers: users.length,
        usersByRole: {
          administrators: users.filter((u) => u.role === 'Administrator').length,
          employees: users.filter((u) => u.role === 'Employee').length,
          partners: users.filter((u) => u.role === 'Partner').length,
        },
        totalCourses: courses.length,
        courseDesignStatus: 'Awaiting User Course Design',
        systemHealth: {
          status: 'Operational',
          uptime: process.uptime(),
          nodeVersion: process.version,
          memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
        },
        recentAuditLogs: [
          { action: 'SYSTEM_BOOT', timestamp: new Date().toISOString(), user: 'System' },
          { action: 'AUTH_VERIFIED', timestamp: new Date().toISOString(), user: req.user?.email || 'admin@reticen8.com' },
        ],
      },
    }
  }

  static async getUsers(req, res) {
    const users = UserModel.getAll().map(UserModel.sanitize)
    return {
      success: true,
      users,
    }
  }

  static async createUser(req, res) {
    const { name, email, password, role, roleTitle, department } = req.body || {}
    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required', 400)
    }

    const weak = validatePasswordStrength(password)
    if (weak) throw new AppError(weak, 400)

    const existing = UserModel.findByEmail(email)
    if (existing) {
      throw new AppError('User already exists', 409)
    }

    const created = await UserModel.create({ name, email, password, role, roleTitle, department })
    return {
      success: true,
      user: UserModel.sanitize(created),
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params || {}
    if (!id) {
      throw new AppError('User ID is required', 400)
    }
    const success = UserModel.delete(id)
    return {
      success,
      message: success ? 'User removed' : 'User not found',
    }
  }
}

export default AdminController
