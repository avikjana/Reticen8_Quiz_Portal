import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, ChevronRight, Users, ArrowLeft, Search, Circle } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useAuth } from '../../context/AuthContext'
import useApi from '../../hooks/useApi'
import api from '../../services/api'
import { usePageTitle } from '../../hooks/usePageTitle'

const roleBadge = (role) => {
  if (role === 'Partner') return 'bg-blue-100 text-blue-700 border-blue-200'
  return 'bg-emerald-100 text-emerald-700 border-emerald-200'
}

const avatarColor = (role) => {
  if (role === 'Partner') return 'bg-blue-500'
  return 'bg-emerald-500'
}

function timeAgo(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export default function AdminChat() {
  usePageTitle('Chat Management')
  const { user } = useAuth()
  const { data: courses } = useApi('/courses')
  const [activeCourse, setActiveCourse] = useState(null)
  const [contacts, setContacts] = useState([])
  const [activeContact, setActiveContact] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const bottomRef = useRef(null)

  // Fetch contacts when course changes
  const fetchContacts = async () => {
    if (!activeCourse) return
    try {
      const r = await api.get(`/chat/contacts/${encodeURIComponent(activeCourse)}`)
      if (r.success) setContacts(r.data || [])
    } catch {}
  }

  useEffect(() => {
    if (!activeCourse) { setContacts([]); setActiveContact(null); setMessages([]); return }
    fetchContacts()
    const id = setInterval(fetchContacts, 4000)
    return () => clearInterval(id)
  }, [activeCourse])

  // Fetch thread when contact changes
  const fetchThread = async () => {
    if (!activeCourse || !activeContact) return
    try {
      const r = await api.get(`/chat/thread/${encodeURIComponent(activeCourse)}/${encodeURIComponent(activeContact.userId)}`)
      if (r.success) setMessages(r.data || [])
    } catch {}
  }

  useEffect(() => {
    if (!activeContact) { setMessages([]); return }
    fetchThread()
    const id = setInterval(fetchThread, 3000)
    return () => clearInterval(id)
  }, [activeCourse, activeContact?.userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim() || sending || !activeCourse || !activeContact) return
    setSending(true)
    try {
      await api.post('/chat', { courseId: activeCourse, message: text.trim(), targetUserId: activeContact.userId })
      setText('')
      await fetchThread()
      await fetchContacts()
    } catch {}
    setSending(false)
  }

  const filteredContacts = contacts.filter(c =>
    !searchQuery || c.userName?.toLowerCase().includes(searchQuery.toLowerCase()) || c.userRole?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalUnread = contacts.reduce((s, c) => s + (c.unreadCount || 0), 0)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200">
          <div>
            <nav className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Link to="/admin" className="hover:text-slate-600 transition-colors">Admin</Link>
              <ChevronRight size={12} />
              <span className="text-slate-700 font-medium">Messages</span>
            </nav>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <MessageCircle size={24} className="text-purple-600" />
              Messages
            </h1>
          </div>
          <Link to="/admin" className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors">
            <ArrowLeft size={14} /> Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden" style={{ minHeight: '600px' }}>

          {/* Left panel: Course tabs + Contact list */}
          <div className="lg:col-span-4 border-r border-slate-200 flex flex-col">
            {/* Course selector */}
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
              <select
                value={activeCourse || ''}
                onChange={(e) => { setActiveCourse(e.target.value || null); setActiveContact(null) }}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="">Select a course...</option>
                {(courses || []).map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            {activeCourse && (
              <>
                {/* Search */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search users..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500/30 border-0"
                    />
                  </div>
                </div>

                {/* Contact list */}
                <div className="flex-1 overflow-y-auto">
                  {filteredContacts.length === 0 ? (
                    <div className="p-8 text-center">
                      <Users size={28} className="text-slate-200 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-medium">No conversations yet</p>
                    </div>
                  ) : (
                    filteredContacts.map((contact) => {
                      const isActive = activeContact?.userId === contact.userId
                      return (
                        <button
                          key={contact.userId}
                          onClick={() => setActiveContact(contact)}
                          className={`w-full text-left px-4 py-3.5 flex items-center gap-3 transition-colors border-b border-slate-50 ${
                            isActive ? 'bg-purple-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          {/* Avatar */}
                          <div className={`w-10 h-10 rounded-full ${avatarColor(contact.userRole)} text-white flex items-center justify-center text-sm font-bold shrink-0 relative`}>
                            {(contact.userName || '?')[0].toUpperCase()}
                            {contact.unreadCount > 0 && (
                              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center ring-2 ring-white">
                                {contact.unreadCount > 9 ? '9+' : contact.unreadCount}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-sm font-bold truncate ${isActive ? 'text-purple-700' : 'text-slate-900'}`}>
                                {contact.userName}
                              </span>
                              <span className="text-[9px] text-slate-400 shrink-0">{timeAgo(contact.lastMessageAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${roleBadge(contact.userRole)}`}>
                                {contact.userRole}
                              </span>
                              <span className="text-[10px] text-slate-400 truncate flex-1">
                                {contact.lastMessage?.slice(0, 40)}{contact.lastMessage?.length > 40 ? '...' : ''}
                              </span>
                            </div>
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right panel: Chat thread */}
          <div className="lg:col-span-8 flex flex-col">
            {!activeCourse ? (
              <div className="flex-1 flex items-center justify-center text-center p-10">
                <div>
                  <MessageCircle size={48} className="text-slate-200 mx-auto mb-4" />
                  <p className="text-sm font-bold text-slate-400">Select a course to start</p>
                  <p className="text-xs text-slate-400 mt-1">Choose a course from the dropdown, then pick a conversation</p>
                </div>
              </div>
            ) : !activeContact ? (
              <div className="flex-1 flex items-center justify-center text-center p-10">
                <div>
                  <Users size={48} className="text-slate-200 mx-auto mb-4" />
                  <p className="text-sm font-bold text-slate-400">Select a conversation</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {contacts.length > 0
                      ? `${contacts.length} user${contacts.length !== 1 ? 's' : ''} have messaged${totalUnread > 0 ? ` · ${totalUnread} unread` : ''}`
                      : 'No messages from users in this course yet'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Thread header */}
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3 shrink-0">
                  <div className={`w-10 h-10 rounded-full ${avatarColor(activeContact.userRole)} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
                    {(activeContact.userName || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{activeContact.userName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${roleBadge(activeContact.userRole)}`}>
                        {activeContact.userRole}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {courses?.find(c => c.id === activeCourse)?.title}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/50">
                  {messages.length === 0 && (
                    <div className="text-center py-16">
                      <MessageCircle size={32} className="text-slate-200 mx-auto mb-3" />
                      <p className="text-xs text-slate-400">No messages in this thread yet</p>
                    </div>
                  )}
                  {messages.map((msg, i) => {
                    const isAdmin = msg.userRole === 'Administrator'
                    const showDate = i === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[i - 1].createdAt).toDateString()
                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="flex items-center justify-center my-3">
                            <span className="text-[10px] font-medium text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                              {new Date(msg.createdAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        )}
                        <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isAdmin
                              ? 'bg-purple-600 text-white rounded-br-md'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-2xs'
                          }`}>
                            {msg.message}
                          </div>
                          <span className="text-[9px] text-slate-400 mt-1 px-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Reply input */}
                <form onSubmit={send} className="p-4 border-t border-slate-200 bg-white flex items-center gap-3 shrink-0">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`Reply to ${activeContact.userName?.split(' ')[0]}...`}
                    maxLength={1000}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!text.trim() || sending}
                    className="w-11 h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
                  >
                    <Send size={18} />
                  </motion.button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
