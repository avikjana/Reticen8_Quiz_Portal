import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BookOpen, GraduationCap, ShieldCheck, X } from 'lucide-react'
import useDismissable from '../../hooks/useDismissable'
import useApi from '../../hooks/useApi'
import { useAuth } from '../../context/AuthContext'

export default function NotificationDropdown() {
  const { user } = useAuth()
  const { open, setOpen, ref } = useDismissable()
  const buttonRef = useRef(null)

  // Fetch enrollments to generate notifications
  const { data: enrollments } = useApi(user ? '/enrollments' : null)
  const enrolled = enrollments || []

  // Build notifications from real data
  const notifications = []

  // Welcome notification (always present for logged-in users)
  if (user) {
    notifications.push({
      id: 'welcome',
      icon: ShieldCheck,
      iconBg: 'bg-blue-100 text-blue-600',
      title: `Welcome, ${user.name?.split(' ')[0] || 'Learner'}!`,
      message: `You're signed in as ${user.role}. Explore courses and start learning.`,
      time: 'Now',
      link: '/courses',
    })
  }

  // Enrollment notifications
  enrolled.forEach((e) => {
    if (e.course) {
      notifications.push({
        id: `enr-${e.id}`,
        icon: BookOpen,
        iconBg: 'bg-emerald-100 text-emerald-600',
        title: 'Course Enrolled',
        message: `You enrolled in "${e.course.title}".`,
        time: formatTimeAgo(e.enrolledAt),
        link: `/courses/${e.courseId}`,
      })
    }
  })

  // Static notifications
  notifications.push({
    id: 'cert-update',
    icon: GraduationCap,
    iconBg: 'bg-purple-100 text-purple-600',
    title: 'Certifications Available',
    message: 'Explore RCFA, RCFP and RCSA certification tracks.',
    time: 'Info',
    link: '/certifications',
  })

  const hasUnread = enrolled.length > 0

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false)
      buttonRef.current?.focus()
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
        title="Notifications"
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell size={18} />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            onKeyDown={handleKeyDown}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-[min(380px,calc(100vw-2rem))] origin-top-right bg-white rounded-2xl shadow-[var(--shadow-lift)] ring-1 ring-slate-900/5 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close notifications"
              >
                <X size={16} />
              </button>
            </div>

            {/* Notification list */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={24} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No notifications yet</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-50">
                  {notifications.map((notif, idx) => {
                    const Icon = notif.icon
                    return (
                      <motion.li
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.2 }}
                      >
                        <Link
                          to={notif.link}
                          onClick={() => setOpen(false)}
                          className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                        >
                          <div className={`w-8 h-8 rounded-lg ${notif.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                            <Icon size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                              {notif.message}
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium shrink-0 mt-0.5">
                            {notif.time}
                          </span>
                        </Link>
                      </motion.li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
              <Link
                to="/courses"
                onClick={() => setOpen(false)}
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Browse all courses →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
