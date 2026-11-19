import crypto from 'node:crypto'
import db from '../db/index.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import AppError from '../utils/AppError.js'

export const handleChatRoutes = async (req, res, pathname, method) => {
  if (!pathname.startsWith('/api/chat')) return null

  await authenticate(req, res)

  // POST /api/chat — send a message
  if (pathname === '/api/chat' && method === 'POST') {
    const { courseId, message } = req.body || {}
    if (!courseId) throw new AppError('courseId is required.', 400)
    if (!message || !message.trim()) throw new AppError('message is required.', 400)

    const now = new Date().toISOString()
    const msg = {
      id: `msg-${crypto.randomUUID()}`,
      courseId,
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      message: message.trim().slice(0, 1000),
      createdAt: now,
    }
    await db.insert('chatMessages', msg)
    return { success: true, data: msg }
  }

  // GET /api/chat/:courseId — get messages for a course
  const courseMatch = pathname.match(/^\/api\/chat\/(.+)$/)
  if (courseMatch && method === 'GET') {
    const courseId = decodeURIComponent(courseMatch[1])
    const all = await db.read('chatMessages')

    let messages
    if (req.user.role === 'Administrator') {
      messages = all.filter(m => m.courseId === courseId)
    } else {
      messages = all.filter(m =>
        m.courseId === courseId &&
        (m.userId === req.user.id || m.userRole === 'Administrator')
      )
    }

    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    return { success: true, data: messages }
  }

  return null
}

export default handleChatRoutes
