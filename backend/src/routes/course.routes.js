import CourseModel from '../models/course.model.js'
import { authenticate, authenticateOptional } from '../middlewares/auth.middleware.js'
import AppError from '../utils/AppError.js'

export const handleCourseRoutes = async (req, res, pathname, method) => {
  if (pathname === '/api/courses' && method === 'GET') {
    // Catalog (everything except the lesson-by-lesson curriculum).
    // Visitors see the full catalog; signed-in users see the courses their
    // role is allowed to take (e.g. Partners only see partner courses).
    await authenticateOptional(req, res)
    return {
      success: true,
      data: CourseModel.getVisibleTo(req.user?.role).map(({ curriculum, ...summary }) => ({
        ...summary,
        modulesCount: summary.modulesCount || (curriculum ? curriculum.length : 0),
      })),
    }
  }

  // Full course content is for signed-in members only
  if (pathname.startsWith('/api/courses/') && method === 'GET') {
    await authenticate(req, res)
    const id = decodeURIComponent(pathname.replace('/api/courses/', ''))
    const course = CourseModel.findById(id)
    if (!course) throw new AppError('Course not found', 404)
    if (!CourseModel.isVisibleTo(course, req.user.role)) {
      throw new AppError(`This course isn't available for ${req.user.role} accounts.`, 403)
    }
    return {
      success: true,
      data: course,
    }
  }

  return null
}

export default handleCourseRoutes
