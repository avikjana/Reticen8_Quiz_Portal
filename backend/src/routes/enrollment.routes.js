import crypto from 'node:crypto'
import EnrollmentModel from '../models/enrollment.model.js'
import CourseModel from '../models/course.model.js'
import CertificationModel from '../models/certification.model.js'
import db from '../db/index.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import AppError from '../utils/AppError.js'

export const handleEnrollmentRoutes = async (req, res, pathname, method) => {
  if (!pathname.startsWith('/api/enrollments')) return null

  await authenticate(req, res)

  // POST /api/enrollments — enroll in a course
  if (pathname === '/api/enrollments' && method === 'POST') {
    const { courseId } = req.body || {}
    if (!courseId) throw new AppError('courseId is required.', 400)

    const course = await CourseModel.findById(courseId)
    if (!course) throw new AppError('Course not found.', 404)

    if (!CourseModel.isVisibleTo(course, req.user.role)) {
      throw new AppError(`This course is not available for ${req.user.role} accounts.`, 403)
    }

    const enrollment = await EnrollmentModel.enroll(req.user.id, courseId)
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
    const [enrollments, allCourses] = await Promise.all([
      EnrollmentModel.getByUser(req.user.id),
      CourseModel.getAll(),
    ])

    const courseMap = new Map(allCourses.map(c => [c.id, c]))

    const enriched = enrollments.map(e => {
      const course = courseMap.get(e.courseId)
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
      enrolled: await EnrollmentModel.isEnrolled(req.user.id, courseId),
    }
  }

  // GET /api/enrollments/learn/:courseId — full course material for enrolled users
  const learnMatch = pathname.match(/^\/api\/enrollments\/learn\/(.+)$/)
  if (learnMatch && method === 'GET') {
    const courseId = decodeURIComponent(learnMatch[1])

    if (!(await EnrollmentModel.isEnrolled(req.user.id, courseId))) {
      throw new AppError('You must enroll in this course to access the learning material.', 403)
    }

    const course = await CourseModel.findById(courseId)
    if (!course) throw new AppError('Course not found.', 404)

    const enrollment = await EnrollmentModel.findByUserAndCourse(req.user.id, courseId)

    return {
      success: true,
      data: {
        course,
        enrollment,
      },
    }
  }

  // POST /api/enrollments/complete/:courseId — mark course completed & issue certificate
  const completeMatch = pathname.match(/^\/api\/enrollments\/complete\/(.+)$/)
  if (completeMatch && method === 'POST') {
    const courseId = decodeURIComponent(completeMatch[1])

    const enrollment = await EnrollmentModel.findByUserAndCourse(req.user.id, courseId)
    if (!enrollment || enrollment.status === 'dropped') {
      throw new AppError('You are not enrolled in this course.', 403)
    }

    // If already completed, return existing certificate
    if (enrollment.status === 'completed') {
      const existing = await db.findOne('certificates', { userId: req.user.id, courseId })
      if (existing) return { success: true, message: 'Course already completed.', data: existing }
    }

    const course = await CourseModel.findById(courseId)
    if (!course) throw new AppError('Course not found.', 404)

    // Verify all quiz modules are passed
    const quizModuleIndices = []
    if (course.curriculum?.length) {
      course.curriculum.forEach((mod, i) => {
        const hasQuiz = (mod.chapters || []).some(ch => ch.type === 'quiz')
        if (hasQuiz) quizModuleIndices.push(i)
      })
    }

    if (quizModuleIndices.length > 0) {
      const quizCol = db.db.collection('quizAttempts')
      const passedQuizzes = await quizCol.find({
        userId: req.user.id,
        courseId,
        passed: true,
      }).toArray()

      const passedModules = new Set(passedQuizzes.map(q => q.moduleIndex))
      const failed = quizModuleIndices.filter(i => !passedModules.has(i))
      if (failed.length > 0) {
        throw new AppError(
          `You must pass all quizzes before completing this course. Missing: module(s) ${failed.map(i => i + 1).join(', ')}.`,
          400
        )
      }
    }

    // Mark enrollment as completed
    await EnrollmentModel.markCompleted(req.user.id, courseId)

    // Look up certification details
    const certCode = course.certificationCode || course.courseCode || 'GEN'
    let certTitle = course.certificationTitle || course.title
    if (course.certificationCode) {
      const cert = await CertificationModel.findById(course.certificationCode)
      if (cert) certTitle = cert.title
    }

    // Generate credential ID: R8-YYYY-CODE-XXXX
    const year = new Date().getFullYear()
    const rand = String(Math.floor(1000 + Math.random() * 9000))
    const credentialId = `R8-${year}-${certCode}-${rand}`

    const now = new Date()
    const issueDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const expDate = new Date(now)
    expDate.setFullYear(expDate.getFullYear() + 3)
    const expirationDate = expDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    const certificate = {
      id: `cert-${crypto.randomUUID()}`,
      credentialId,
      userId: req.user.id,
      userName: req.user.name || 'Student',
      userEmail: req.user.email,
      courseId,
      courseTitle: course.title,
      certificationCode: certCode,
      certificationTitle: certTitle,
      issueDate,
      expirationDate,
      status: 'ACTIVE_VERIFIED',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }

    await db.insert('certificates', certificate)

    // Also insert into credentials collection for public verification
    await db.insert('credentials', {
      credentialId,
      status: 'ACTIVE_VERIFIED',
      candidateName: req.user.name || 'Student',
      certificationCode: certCode,
      certificationTitle: certTitle,
      issueDate,
      expirationDate,
      score: 'PASSED',
      proctoredCenter: 'Reticen8 Academy Online',
    })

    return {
      success: true,
      message: `Congratulations! You have completed "${course.title}" and earned your certificate.`,
      data: certificate,
    }
  }

  // POST /api/enrollments/feedback — submit course feedback
  if (pathname === '/api/enrollments/feedback' && method === 'POST') {
    const { courseId, rating, comment, recommend } = req.body || {}
    if (!courseId) throw new AppError('courseId is required.', 400)
    if (!rating || rating < 1 || rating > 5) throw new AppError('Rating must be between 1 and 5.', 400)

    if (!(await EnrollmentModel.isEnrolled(req.user.id, courseId))) {
      throw new AppError('You must be enrolled in this course to leave feedback.', 403)
    }

    const existing = await db.findOne('feedback', { userId: req.user.id, courseId })
    if (existing) {
      await db.update('feedback', existing.id, {
        rating,
        comment: comment || '',
        recommend: recommend ?? true,
        updatedAt: new Date().toISOString(),
      })
      return { success: true, message: 'Feedback updated. Thank you!' }
    }

    const now = new Date().toISOString()
    await db.insert('feedback', {
      id: `fb-${crypto.randomUUID()}`,
      userId: req.user.id,
      courseId,
      rating,
      comment: comment || '',
      recommend: recommend ?? true,
      createdAt: now,
      updatedAt: now,
    })

    return { success: true, message: 'Thank you for your feedback!' }
  }

  // GET /api/enrollments/feedback/:courseId — get my feedback for a course
  const feedbackMatch = pathname.match(/^\/api\/enrollments\/feedback\/(.+)$/)
  if (feedbackMatch && method === 'GET') {
    const courseId = decodeURIComponent(feedbackMatch[1])
    const feedback = await db.findOne('feedback', { userId: req.user.id, courseId })
    return { success: true, data: feedback || null }
  }

  // DELETE /api/enrollments/:courseId — unenroll
  const deleteMatch = pathname.match(/^\/api\/enrollments\/(.+)$/)
  if (deleteMatch && method === 'DELETE') {
    const courseId = decodeURIComponent(deleteMatch[1])

    if (!(await EnrollmentModel.unenroll(req.user.id, courseId))) {
      throw new AppError('You are not enrolled in this course.', 404)
    }

    return { success: true, message: 'Successfully unenrolled from the course.' }
  }

  return null
}

export default handleEnrollmentRoutes
