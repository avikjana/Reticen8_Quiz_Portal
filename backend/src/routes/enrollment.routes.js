import EnrollmentModel from '../models/enrollment.model.js'
import CourseModel from '../models/course.model.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import AppError from '../utils/AppError.js'

export const handleEnrollmentRoutes = async (req, res, pathname, method) => {
  // All enrollment routes require authentication
  if (!pathname.startsWith('/api/enrollments')) return null

  await authenticate(req, res)

  // POST /api/enrollments — enroll in a course
  if (pathname === '/api/enrollments' && method === 'POST') {
    const { courseId } = req.body || {}
    if (!courseId) throw new AppError('courseId is required.', 400)

    const course = CourseModel.findById(courseId)
    if (!course) throw new AppError('Course not found.', 404)

    if (!CourseModel.isVisibleTo(course, req.user.role)) {
      throw new AppError(`This course is not available for ${req.user.role} accounts.`, 403)
    }

    const enrollment = EnrollmentModel.enroll(req.user.id, courseId)
    if (!enrollment) {
      throw new AppError('You are already enrolled in this course.', 409)
    }

    return {
      success: true,
      message: `Successfully enrolled in "${course.title}".`,
      data: enrollment,
    }
  }

  // GET /api/enrollments — list my enrollments (with course details)
  if (pathname === '/api/enrollments' && method === 'GET') {
    const enrollments = EnrollmentModel.getByUser(req.user.id)

    // Attach course info to each enrollment
    const enriched = enrollments.map((e) => {
      const course = CourseModel.findById(e.courseId)
      return {
        ...e,
        course: course
          ? {
              id: course.id,
              title: course.title,
              shortDesc: course.shortDesc,
              category: course.category,
              difficulty: course.difficulty,
              difficultyColor: course.difficultyColor,
              duration: course.duration,
              modulesCount: course.modulesCount,
              lessonsCount: course.lessonsCount,
              badge: course.badge,
              certificationCode: course.certificationCode,
            }
          : null,
      }
    })

    return { success: true, data: enriched }
  }

  // GET /api/enrollments/check/:courseId — check if enrolled
  const checkMatch = pathname.match(/^\/api\/enrollments\/check\/(.+)$/)
  if (checkMatch && method === 'GET') {
    const courseId = decodeURIComponent(checkMatch[1])
    return {
      success: true,
      enrolled: EnrollmentModel.isEnrolled(req.user.id, courseId),
    }
  }

  // GET /api/enrollments/learn/:courseId — full course material for enrolled users
  const learnMatch = pathname.match(/^\/api\/enrollments\/learn\/(.+)$/)
  if (learnMatch && method === 'GET') {
    const courseId = decodeURIComponent(learnMatch[1])

    if (!EnrollmentModel.isEnrolled(req.user.id, courseId)) {
      throw new AppError('You must enroll in this course to access the learning material.', 403)
    }

    const course = CourseModel.findById(courseId)
    if (!course) throw new AppError('Course not found.', 404)

    const enrollment = EnrollmentModel.findByUserAndCourse(req.user.id, courseId)

    return {
      success: true,
      data: {
        course,
        enrollment,
      },
    }
  }

  // DELETE /api/enrollments/:courseId — unenroll
  const deleteMatch = pathname.match(/^\/api\/enrollments\/(.+)$/)
  if (deleteMatch && method === 'DELETE') {
    const courseId = decodeURIComponent(deleteMatch[1])

    if (!EnrollmentModel.unenroll(req.user.id, courseId)) {
      throw new AppError('You are not enrolled in this course.', 404)
    }

    return { success: true, message: 'Successfully unenrolled from the course.' }
  }

  return null
}

export default handleEnrollmentRoutes
