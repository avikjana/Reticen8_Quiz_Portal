import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, Send, ChevronRight, Users, ArrowLeft } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useAuth } from '../../context/AuthContext'
import useApi from '../../hooks/useApi'
import api from '../../services/api'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function AdminChat() {
  usePageTitle('Chat Management')
  const { user } = useAuth()
  const { data: courses } = useApi('/courses')
  const [activeCourse, setActiveCourse] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  const fetchMessages = async () => {
    if (!activeCourse) return
    try {
      const { data } = await api.get(`/chat/${encodeURIComponent(activeCourse)}`)
      setMessages(data || [])
    } catch {}
  }

  useEffect(() => {
    if (!activeCourse) { setMessages([]); return }
    fetchMessages()
    const id = setInterval(fetchMessages, 4000)
    return () => clearInterval(id)
  }, [activeCourse])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim() || sending || !activeCourse) return
    setSending(true)
    try {
      await api.post('/chat', { courseId: activeCourse, message: text.trim() })
      setText('')
      await fetchMessages()
    } catch {}
    setSending(false)
  }

  const roleColor = (role) => {
    if (role === 'Administrator') return 'bg-purple-100 text-purple-700'
    if (role === 'Partner') return 'bg-blue-100 text-blue-700'
    return 'bg-emerald-100 text-emerald-700'
  }

  const uniqueUsers = [...new Map(messages.filter(m => m.userRole !== 'Administrator').map(m => [m.userId, m])).values()]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <nav className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Link to="/admin" className="hover:text-slate-600 transition-colors">Admin</Link>
              <ChevronRight size={12} />
              <span className="text-slate-700 font-medium">Chat Messages</span>
            </nav>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <MessageCircle size={24} className="text-action-600" />
              Student & Partner Messages
            </h1>
            <p className="text-xs text-slate-500 mt-1">View and reply to messages from learners</p>
          </div>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ minHeight: '500px' }}>
          {/* Course list */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select a Course</p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {(courses || []).map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCourse(c.id)}
                  className={`w-full text-left px-5 py-4 transition-colors ${
                    activeCourse === c.id
                      ? 'bg-action-600/5 border-l-4 border-action-600'
                      : 'hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  <p className={`text-sm font-bold truncate ${activeCourse === c.id ? 'text-action-600' : 'text-slate-900'}`}>
                    {c.title}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{c.category}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            {!activeCourse ? (
              <div className="flex-1 flex items-center justify-center text-center p-10">
                <div>
                  <MessageCircle size={40} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-400">Select a course to view messages</p>
                  <p className="text-xs text-slate-400 mt-1">Messages from students and partners will appear here</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {courses?.find(c => c.id === activeCourse)?.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Users size={10} />
                      {uniqueUsers.length} participant{uniqueUsers.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/50">
                  {messages.length === 0 && (
                    <div className="text-center py-16">
                      <MessageCircle size={32} className="text-slate-200 mx-auto mb-3" />
                      <p className="text-xs text-slate-400">No messages in this course yet</p>
                    </div>
                  )}
                  {messages.map((msg) => {
                    const isAdmin = msg.userRole === 'Administrator'
                    return (
                      <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${roleColor(msg.userRole)}`}>
                            {msg.userName}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${roleColor(msg.userRole)}`}>
                            {msg.userRole}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {new Date(msg.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isAdmin
                            ? 'bg-purple-600 text-white rounded-br-md'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'
                        }`}>
                          {msg.message}
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
                    placeholder="Reply as Administrator..."
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
