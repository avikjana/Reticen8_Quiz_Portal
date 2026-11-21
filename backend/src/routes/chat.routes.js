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

    if (req.user.role === 'Administrator' && targetUserId) {
      msg.targetUserId = targetUserId
    }

    await db.insert('chatMessages', msg)
    return { success: true, data: msg }
  }

  // GET /api/chat/contacts/:courseId — admin gets user contact list
  const contactsMatch = pathname.match(/^\/api\/chat\/contacts\/(.+)$/)
  if (contactsMatch && method === 'GET') {
    const courseId = decodeURIComponent(contactsMatch[1])
    if (req.user.role !== 'Administrator') throw new AppError('Forbidden', 403)

    const col = db.db.collection('chatMessages')

    // Aggregate: group non-admin messages by userId, get last message + count
    const pipeline = [
      { $match: { courseId, userRole: { $ne: 'Administrator' } } },
      { $sort: { createdAt: -1 } },
      { $group: {
        _id: '$userId',
        userName: { $first: '$userName' },
        userRole: { $first: '$userRole' },
        lastMessage: { $first: '$message' },
        lastMessageAt: { $first: '$createdAt' },
        totalMessages: { $sum: 1 },
      }},
      { $sort: { lastMessageAt: -1 } },
    ]
    const groups = await col.aggregate(pipeline).toArray()

    // For unread count: find last admin reply per user
    const contacts = []
    for (const g of groups) {
      const lastAdminReply = await col.findOne(
        { courseId, userRole: 'Administrator', targetUserId: g._id },
        { sort: { createdAt: -1 }, projection: { createdAt: 1 } }
      )
      let unreadCount = 0
      if (lastAdminReply) {
        unreadCount = await col.countDocuments({
          courseId, userId: g._id, userRole: { $ne: 'Administrator' },
          createdAt: { $gt: lastAdminReply.createdAt }
        })
      } else {
        unreadCount = g.totalMessages
      }
      contacts.push({
        userId: g._id, userName: g.userName, userRole: g.userRole,
        lastMessage: g.lastMessage, lastMessageAt: g.lastMessageAt, unreadCount,
      })
    }

    return { success: true, data: contacts }
  }

  // GET /api/chat/thread/:courseId/:userId — admin gets 1:1 thread
  const threadMatch = pathname.match(/^\/api\/chat\/thread\/([^/]+)\/([^/]+)$/)
  if (threadMatch && method === 'GET') {
    const courseId = decodeURIComponent(threadMatch[1])
    const targetUserId = decodeURIComponent(threadMatch[2])
    if (req.user.role !== 'Administrator') throw new AppError('Forbidden', 403)

    const messages = await db.findMany('chatMessages', {
      courseId,
      $or: [
        { userId: targetUserId, userRole: { $ne: 'Administrator' } },
        { userRole: 'Administrator', targetUserId }
      ]
    }, { sort: { createdAt: 1 } })

    return { success: true, data: messages }
  }

  // GET /api/chat/:courseId — user gets their own conversation
  const courseMatch = pathname.match(/^\/api\/chat\/([^/]+)$/)
  if (courseMatch && method === 'GET') {
    const courseId = decodeURIComponent(courseMatch[1])

    let messages
    if (req.user.role === 'Administrator') {
      messages = await db.findMany('chatMessages', { courseId }, { sort: { createdAt: 1 } })
    } else {
      messages = await db.findMany('chatMessages', {
        courseId,
        $or: [
          { userId: req.user.id },
          { userRole: 'Administrator', targetUserId: req.user.id }
        ]
      }, { sort: { createdAt: 1 } })
    }

    return { success: true, data: messages }
  }

  return null
}

export default handleChatRoutes
