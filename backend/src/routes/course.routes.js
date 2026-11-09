import CourseModel from '../models/course.model.js'

export const handleCourseRoutes = async (req, res, pathname, method) => {
  if (pathname === '/api/courses' && method === 'GET') {
    return {
      success: true,
      data: CourseModel.getAll(),
    }
  }

  if (pathname.startsWith('/api/courses/') && method === 'GET') {
    const id = pathname.replace('/api/courses/', '')
    const course = CourseModel.findById(id)
    return {
      success: !!course,
      data: course,
    }
  }

  return null
}

export default handleCourseRoutes
