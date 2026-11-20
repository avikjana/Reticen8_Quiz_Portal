import crypto from 'node:crypto'
import db from '../db/index.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import AppError from '../utils/AppError.js'

export const handleChatRoutes = async (req, res, pathname, method) => {
  if (!pathname.startsWith('/api/chat')) return null

  await authenticate(req, res)

  // POST /api/chat — send a message
  if (pathname === '/api/chat' && method === 'POST') {
    const { courseId, message, targetUserId } = req.body || {}
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

    // Admin replies are tagged with the target user so they appear in that user's thread
    if (req.user.role === 'Administrator' && targetUserId) {
      msg.targetUserId = targetUserId
    }

    await db.insert('chatMessages', msg)
    return { success: true, data: msg }
  }

  // GET /api/chat/contacts/:courseId — admin gets list of users who have messaged (WhatsApp contact list)
  const contactsMatch = pathname.match(/^\/api\/chat\/contacts\/(.+)$/)
  if (contactsMatch && method === 'GET') {
    const courseId = decodeURIComponent(contactsMatch[1])
    if (req.user.role !== 'Administrator') throw new AppError('Forbidden', 403)

    const all = await db.read('chatMessages')
    const courseMessages = all.filter(m => m.courseId === courseId)

    // Build contact list from non-admin users who have sent messages
    const contactMap = new Map()
    for (const m of courseMessages) {
      if (m.userRole === 'Administrator') continue
      if (!contactMap.has(m.userId)) {
        contactMap.set(m.userId, {
          userId: m.userId,
          userName: m.userName,
          userRole: m.userRole,
          lastMessage: m.message,
          lastMessageAt: m.createdAt,
          unreadCount: 0,
        })
      } else {
        const c = contactMap.get(m.userId)
        if (new Date(m.createdAt) > new Date(c.lastMessageAt)) {
          c.lastMessage = m.message
          c.lastMessageAt = m.createdAt
        }
      }
    }

    // Count unread: messages from user that have no admin reply after them
    for (const [userId, contact] of contactMap) {
      const thread = courseMessages.filter(m =>
        (m.userId === userId && m.userRole !== 'Administrator') ||
        (m.userRole === 'Administrator' && m.targetUserId === userId)
      ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

      let lastAdminReply = null
      for (const m of thread) {
        if (m.userRole === 'Administrator') lastAdminReply = m.createdAt
      }

      if (lastAdminReply) {
        contact.unreadCount = thread.filter(m =>
          m.userRole !== 'Administrator' && new Date(m.createdAt) > new Date(lastAdminReply)
        ).length
      } else {
        contact.unreadCount = thread.filter(m => m.userRole !== 'Administrator').length
      }
    }

    const contacts = [...contactMap.values()].sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
    return { success: true, data: contacts }
  }

  // GET /api/chat/thread/:courseId/:userId — admin gets 1:1 thread with a specific user
  const threadMatch = pathname.match(/^\/api\/chat\/thread\/([^/]+)\/([^/]+)$/)
  if (threadMatch && method === 'GET') {
    const courseId = decodeURIComponent(threadMatch[1])
    const targetUserId = decodeURIComponent(threadMatch[2])

    if (req.user.role !== 'Administrator') throw new AppError('Forbidden', 403)

    const all = await db.read('chatMessages')
    const thread = all.filter(m =>
      m.courseId === courseId && (
        (m.userId === targetUserId && m.userRole !== 'Administrator') ||
        (m.userRole === 'Administrator' && m.targetUserId === targetUserId)
      )
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    return { success: true, data: thread }
  }

  // GET /api/chat/:courseId — user gets their own messages + admin replies to them
  const courseMatch = pathname.match(/^\/api\/chat\/([^/]+)$/)
  if (courseMatch && method === 'GET') {
    const courseId = decodeURIComponent(courseMatch[1])
    const all = await db.read('chatMessages')

    let messages
    if (req.user.role === 'Administrator') {
      // Admin without specific thread: return all messages for the course
      messages = all.filter(m => m.courseId === courseId)
    } else {
      // User sees: own messages + admin replies targeted at them
      messages = all.filter(m =>
        m.courseId === courseId && (
          m.userId === req.user.id ||
          (m.userRole === 'Administrator' && m.targetUserId === req.user.id)
        )
      )
    }

    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    return { success: true, data: messages }
  }

  return null
}

export default handleChatRoutes
