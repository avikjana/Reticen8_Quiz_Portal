import CourseModel from '../models/course.model.js'
import EnrollmentModel from '../models/enrollment.model.js'
import { authenticate, authenticateOptional } from '../middlewares/auth.middleware.js'
import AppError from '../utils/AppError.js'

export const handleCourseRoutes = async (req, res, pathname, method) => {
  if (pathname === '/api/courses' && method === 'GET') {
    await authenticateOptional(req, res)
    const courses = (await CourseModel.getVisibleTo(req.user?.role)).map(({ curriculum, ...summary }) => ({
      ...summary,
      modulesCount: summary.modulesCount || (curriculum ? curriculum.length : 0),
    }))
    const enriched = await Promise.all(courses.map(async (c) => ({
      ...c,
      studentsCount: await EnrollmentModel.countByCourse(c.id),
    })))
    return { success: true, data: enriched }
  }

  // Full course content is for signed-in members only
  if (pathname.startsWith('/api/courses/') && method === 'GET') {
    await authenticate(req, res)
    const id = decodeURIComponent(pathname.replace('/api/courses/', ''))
    const course = await CourseModel.findById(id)
    if (!course) throw new AppError('Course not found', 404)
    if (!CourseModel.isVisibleTo(course, req.user.role)) {
      throw new AppError(`This course isn't available for ${req.user.role} accounts.`, 403)
    }
    return {
      success: true,
      data: { ...course, studentsCount: await EnrollmentModel.countByCourse(course.id) },
    }
  }

  return null
}

export default handleCourseRoutes
