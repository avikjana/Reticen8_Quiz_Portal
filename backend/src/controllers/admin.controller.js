import UserModel from '../models/user.model.js'
import CourseModel from '../models/course.model.js'
import EnrollmentModel from '../models/enrollment.model.js'
import db from '../db/index.js'
import AppError from '../utils/AppError.js'
import { validate } from '../middlewares/validate.middleware.js'
import { adminCreateUserSchema } from '../validation/schemas.js'

export class AdminController {
  static async getOverview(req, res) {
    const users = await UserModel.getAll()
    const courses = await CourseModel.getAll()
    const allEnrollments = (await EnrollmentModel.getAll()).filter(e => e.status !== 'dropped')

    return {
      success: true,
      data: {
        totalUsers: users.length,
        usersByRole: {
          administrators: users.filter((u) => u.role === 'Administrator').length,
          customers: users.filter((u) => u.role === 'Customer').length,
          partners: users.filter((u) => u.role === 'Partner').length,
        },
        totalCourses: courses.length,
        totalEnrollments: allEnrollments.length,
        systemHealth: {
          status: 'Operational',
          uptime: process.uptime(),
          nodeVersion: process.version,
          memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
        },
      },
    }
  }

  static async getUsers(req, res) {
    const users = (await UserModel.getAll()).map(UserModel.sanitize)
    const allEnrollments = (await EnrollmentModel.getAll()).filter(e => e.status !== 'dropped')

    const enriched = []
    for (const u of users) {
      const userEnrollments = allEnrollments.filter(e => e.userId === u.id)
      const courses = []
      for (const e of userEnrollments) {
        const course = await CourseModel.findById(e.courseId)
        courses.push({
          enrollmentId: e.id,
          courseId: e.courseId,
          courseTitle: course?.title || e.courseId,
          status: e.status,
          enrolledAt: e.enrolledAt,
        })
      }
      enriched.push({ ...u, enrolledCourses: courses })
    }

    return { success: true, users: enriched }
  }

  static async createUser(req, res) {
    const { name, email, password, role, roleTitle, department } = validate(adminCreateUserSchema, req.body)

    const existing = await UserModel.findByEmail(email)
    if (existing) {
      throw new AppError('A user with this email already exists.', 409)
    }

    const created = await UserModel.create({ name, email, password, role, roleTitle, department })
    return {
      success: true,
      user: UserModel.sanitize(created),
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params || {}
    if (!id) throw new AppError('User ID is required', 400)
    if (id === req.user.id) throw new AppError("You can't delete your own account.", 400)

    const target = await UserModel.findById(id)
    if (!target) throw new AppError('User not found', 404)

    if (target.role === 'Administrator') {
      const admins = (await UserModel.getAll()).filter((u) => u.role === 'Administrator')
      if (admins.length <= 1) throw new AppError("You can't delete the last administrator.", 400)
    }

    const success = await UserModel.delete(id)
    return { success, message: success ? 'User removed' : 'User not found' }
  }

  static async getCourses(req, res) {
    const courses = await CourseModel.getAll()
    const allEnrollments = (await EnrollmentModel.getAll()).filter(e => e.status !== 'dropped')

    const enriched = []
    for (const c of courses) {
      const courseEnrollments = allEnrollments.filter(e => e.courseId === c.id)
      const enrolledUsers = []
      for (const e of courseEnrollments) {
        const user = await UserModel.findById(e.userId)
        enrolledUsers.push({
          enrollmentId: e.id,
          userId: e.userId,
          userName: user?.name || 'Unknown',
          userEmail: user?.email || 'Unknown',
          userRole: user?.role || 'Unknown',
          status: e.status,
          enrolledAt: e.enrolledAt,
        })
      }
      enriched.push({
        id: c.id,
        title: c.title,
        shortDesc: c.shortDesc,
        category: c.category,
        difficulty: c.difficulty,
        difficultyColor: c.difficultyColor,
        duration: c.duration,
        modulesCount: c.modulesCount || 0,
        lessonsCount: c.lessonsCount || 0,
        certificationCode: c.certificationCode,
        createdAt: c.createdAt,
        enrolledCount: enrolledUsers.length,
        enrolledUsers,
      })
    }

    return { success: true, courses: enriched }
  }

  static async createCourse(req, res) {
    const { title, shortDesc, description, difficulty, category, duration, certificationCode } = req.body || {}
    if (!title) throw new AppError('Course title is required.', 400)

    const course = await CourseModel.create({
      title,
      shortDesc: shortDesc || '',
      description: description || '',
      difficulty: difficulty || 'Beginner',
      difficultyColor:
        difficulty === 'Advanced' ? 'amber' :
        difficulty === 'Expert' ? 'purple' :
        difficulty === 'Intermediate' ? 'blue' : 'green',
      category: category || 'Network Security',
      duration: duration || 'TBD',
      certificationCode: certificationCode || '',
    })

    return { success: true, message: `Course "${course.title}" created.`, course }
  }

  static async deleteCourse(req, res) {
    const { courseId } = req.params || {}
    if (!courseId) throw new AppError('Course ID is required.', 400)

    const course = await CourseModel.findById(courseId)
    if (!course) throw new AppError('Course not found.', 404)

    const success = await CourseModel.delete(courseId)
    return { success, message: success ? `Course "${course.title}" removed.` : 'Course not found.' }
  }

  static async removeEnrollment(req, res) {
    const { enrollmentId } = req.params || {}
    if (!enrollmentId) throw new AppError('Enrollment ID is required.', 400)

    const allEnrollments = await EnrollmentModel.getAll()
    const enrollment = allEnrollments.find(e => e.id === enrollmentId)
    if (!enrollment) throw new AppError('Enrollment not found.', 404)

    await db.update('enrollments', enrollmentId, { status: 'dropped' })

    const user = await UserModel.findById(enrollment.userId)
    const course = await CourseModel.findById(enrollment.courseId)

    return {
      success: true,
      message: `Removed ${user?.name || 'user'} from "${course?.title || enrollment.courseId}".`,
    }
  }
}

export default AdminController
