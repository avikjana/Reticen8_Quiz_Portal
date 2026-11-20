import { authenticate, requireRole } from '../middlewares/auth.middleware.js'
import db from '../db/index.js'
import AppError from '../utils/AppError.js'

const MAX_ATTEMPTS = 2

export default async function handleQuizRoutes(req, res, pathname, method) {
  // POST /api/quiz/attempt — record a quiz attempt (user)
  if (pathname === '/api/quiz/attempt' && method === 'POST') {
    await authenticate(req, res)
    const { courseId, moduleIndex, passed } = req.body
    if (!courseId || moduleIndex === undefined) throw new AppError('courseId and moduleIndex are required', 400)

    const col = db.db.collection('quizAttempts')
    const key = { userId: req.user.id, courseId, moduleIndex: Number(moduleIndex) }
    const existing = await col.findOne(key)

    if (existing && existing.attemptsUsed >= MAX_ATTEMPTS && !existing.passed) {
      return { success: false, locked: true, attemptsUsed: existing.attemptsUsed, maxAttempts: MAX_ATTEMPTS, message: 'Maximum attempts reached. Please contact your administrator to reset.' }
    }

    const attemptsUsed = (existing?.attemptsUsed || 0) + 1
    const isPassed = !!passed || !!existing?.passed

    await col.updateOne(key, {
      $set: { attemptsUsed, passed: isPassed, userName: req.user.name, userEmail: req.user.email, userRole: req.user.role, updatedAt: new Date().toISOString() },
      $setOnInsert: { createdAt: new Date().toISOString() }
    }, { upsert: true })

    return { success: true, attemptsUsed, maxAttempts: MAX_ATTEMPTS, passed: isPassed, locked: attemptsUsed >= MAX_ATTEMPTS && !isPassed }
  }

  // GET /api/quiz/attempts/:courseId — get user's attempts for a course
  const attemptsMatch = pathname.match(/^\/api\/quiz\/attempts\/([^/]+)$/)
  if (attemptsMatch && method === 'GET') {
    await authenticate(req, res)
    const courseId = decodeURIComponent(attemptsMatch[1])
    const col = db.db.collection('quizAttempts')
    const docs = await col.find({ userId: req.user.id, courseId }).toArray()
    const attempts = {}
    for (const d of docs) {
      attempts[d.moduleIndex] = { attemptsUsed: d.attemptsUsed, maxAttempts: MAX_ATTEMPTS, passed: !!d.passed, locked: d.attemptsUsed >= MAX_ATTEMPTS && !d.passed }
    }
    return { success: true, attempts }
  }

  // --- Admin routes ---

  // GET /api/admin/quiz/locked — list all locked-out users
  if (pathname === '/api/admin/quiz/locked' && method === 'GET') {
    await authenticate(req, res)
    requireRole('Administrator')(req, res)
    const col = db.db.collection('quizAttempts')
    const docs = await col.find({ passed: false, attemptsUsed: { $gte: MAX_ATTEMPTS } }).sort({ updatedAt: -1 }).toArray()
    const locked = docs.map(d => ({
      userId: d.userId, userName: d.userName, userEmail: d.userEmail, userRole: d.userRole,
      courseId: d.courseId, moduleIndex: d.moduleIndex,
      attemptsUsed: d.attemptsUsed, updatedAt: d.updatedAt,
    }))
    return { success: true, locked }
  }

  // POST /api/admin/quiz/reset — admin resets a user's attempts
  if (pathname === '/api/admin/quiz/reset' && method === 'POST') {
    await authenticate(req, res)
    requireRole('Administrator')(req, res)
    const { userId, courseId, moduleIndex } = req.body
    if (!userId || !courseId || moduleIndex === undefined) throw new AppError('userId, courseId, and moduleIndex are required', 400)

    const col = db.db.collection('quizAttempts')
    const result = await col.updateOne(
      { userId, courseId, moduleIndex: Number(moduleIndex) },
      { $set: { attemptsUsed: 0, passed: false, updatedAt: new Date().toISOString() } }
    )
    if (result.matchedCount === 0) throw new AppError('No attempt record found for this user/quiz', 404)
    return { success: true, message: 'Quiz attempts reset successfully' }
  }

  return null
}
