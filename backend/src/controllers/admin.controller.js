import UserModel from '../models/user.model.js'
import CourseModel from '../models/course.model.js'
import EnrollmentModel from '../models/enrollment.model.js'
import db from '../db/index.js'
import AppError from '../utils/AppError.js'
import { validate } from '../middlewares/validate.middleware.js'
import { adminCreateUserSchema } from '../validation/schemas.js'

export class AdminController {
  static async getOverview(req, res) {
    // 2 aggregations + 1 count instead of 6 separate countDocuments
    const [usersByRole, totalCourses, totalEnrollments] = await Promise.all([
      db.cachedAggregate('users', [
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      db.countDocs('courses', {}),
      db.countDocs('enrollments', { status: { $ne: 'dropped' } }),
    ])

    const roleMap = Object.fromEntries(usersByRole.map(r => [r._id, r.count]))
    const totalUsers = usersByRole.reduce((sum, r) => sum + r.count, 0)

    return {
      success: true,
      data: {
        totalUsers,
        usersByRole: {
          administrators: roleMap['Administrator'] || 0,
          customers: roleMap['Customer'] || 0,
          partners: roleMap['Partner'] || 0,
        },
        totalCourses,
        totalEnrollments,
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
    // Load users and enrollments in parallel, then pre-load courses into a map
    const [rawUsers, allEnrollments, allCourses] = await Promise.all([
      UserModel.getAll(),
      db.findMany('enrollments', { status: { $ne: 'dropped' } }),
      CourseModel.getAll(),
    ])

    const users = rawUsers.map(UserModel.sanitize)
    const courseMap = new Map(allCourses.map(c => [c.id, c]))

    // Group enrollments by userId for O(1) lookup
    const enrollmentsByUser = new Map()
    for (const e of allEnrollments) {
      if (!enrollmentsByUser.has(e.userId)) enrollmentsByUser.set(e.userId, [])
      enrollmentsByUser.get(e.userId).push(e)
    }

    const enriched = users.map(u => {
      const userEnrollments = enrollmentsByUser.get(u.id) || []
      const courses = userEnrollments.map(e => ({
        enrollmentId: e.id,
        courseId: e.courseId,
        courseTitle: courseMap.get(e.courseId)?.title || e.courseId,
        status: e.status,
        enrolledAt: e.enrolledAt,
      }))
      return { ...u, enrolledCourses: courses }
    })

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
      const adminCount = await db.countDocs('users', { role: 'Administrator' })
      if (adminCount <= 1) throw new AppError("You can't delete the last administrator.", 400)
    }

    const success = await UserModel.delete(id)
    return { success, message: success ? 'User removed' : 'User not found' }
  }

  static async getCourses(req, res) {
    // Load all data in parallel, build lookup maps
    const [courses, allEnrollments, allUsers] = await Promise.all([
      CourseModel.getAll(),
      db.findMany('enrollments', { status: { $ne: 'dropped' } }),
      UserModel.getAll(),
    ])

    const userMap = new Map(allUsers.map(u => [u.id, UserModel.sanitize(u)]))

    // Group enrollments by courseId
    const enrollmentsByCourse = new Map()
    for (const e of allEnrollments) {
      if (!enrollmentsByCourse.has(e.courseId)) enrollmentsByCourse.set(e.courseId, [])
      enrollmentsByCourse.get(e.courseId).push(e)
    }

    const enriched = courses.map(c => {
      const courseEnrollments = enrollmentsByCourse.get(c.id) || []
      const enrolledUsers = courseEnrollments.map(e => {
        const user = userMap.get(e.userId)
        return {
          enrollmentId: e.id,
          userId: e.userId,
          userName: user?.name || 'Unknown',
          userEmail: user?.email || 'Unknown',
          userRole: user?.role || 'Unknown',
          status: e.status,
          enrolledAt: e.enrolledAt,
        }
      })
      return {
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
      }
    })

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

    const enrollment = await db.findById('enrollments', enrollmentId)
    if (!enrollment) throw new AppError('Enrollment not found.', 404)

    await db.update('enrollments', enrollmentId, { status: 'dropped' })

    const [user, course] = await Promise.all([
      UserModel.findById(enrollment.userId),
      CourseModel.findById(enrollment.courseId),
    ])

    return {
      success: true,
      message: `Removed ${user?.name || 'user'} from "${course?.title || enrollment.courseId}".`,
    }
  }
}

export default AdminController
