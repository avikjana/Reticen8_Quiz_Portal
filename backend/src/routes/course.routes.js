import CourseModel from '../models/course.model.js'
import EnrollmentModel from '../models/enrollment.model.js'
import db from '../db/index.js'
import { authenticate, authenticateOptional } from '../middlewares/auth.middleware.js'
import AppError from '../utils/AppError.js'

export const handleCourseRoutes = async (req, res, pathname, method) => {
  if (pathname === '/api/courses' && method === 'GET') {
    await authenticateOptional(req, res)
    const [allCourses, countMap] = await Promise.all([
      CourseModel.getVisibleTo(req.user?.role),
      db.aggregateEnrollmentCounts(),
    ])
    const courses = allCourses.map(({ curriculum, ...summary }) => ({
      ...summary,
      modulesCount: summary.modulesCount || (curriculum ? curriculum.length : 0),
      studentsCount: countMap.get(summary.id) || 0,
    }))
    return { success: true, data: courses }
  }

  if (pathname.startsWith('/api/courses/') && method === 'GET') {
    await authenticate(req, res)
    const id = decodeURIComponent(pathname.replace('/api/courses/', ''))
    const course = await CourseModel.findById(id)
    if (!course) throw new AppError('Course not found', 404)
    if (!CourseModel.isVisibleTo(course, req.user.role)) {
      throw new AppError(`This course isn't available for ${req.user.role} accounts.`, 403)
    }
    const count = await EnrollmentModel.countByCourse(course.id)
    return {
      success: true,
      data: { ...course, studentsCount: count },
    }
  }

  return null
}

export default handleCourseRoutes
