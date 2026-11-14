import { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, BookOpen, Award, GraduationCap, Sparkles, ArrowRight, User, LogIn } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

// Slide-in navigation panel for phones and small tablets
export default function MobileDrawer({ open, onClose, roleTheme, searchQuery, setSearchQuery, onSearchSubmit }) {
  const { user, logout } = useAuth()

  // Lock page scroll while the drawer is open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Close on Esc, and when the window grows to desktop width
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    const mq = window.matchMedia('(min-width: 1024px)')
    const onWide = (e) => e.matches && onClose()
    document.addEventListener('keydown', onKey)
    mq.addEventListener('change', onWide)
    return () => {
      document.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onWide)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
        <motion.div
          key="drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => onClose()}
          className="lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />
        <motion.div
          key="drawer-panel"
          id="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          className="lg:hidden fixed inset-y-0 right-0 z-[61] w-full max-w-sm bg-white shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 flex-shrink-0">
            <span className="font-display text-base font-bold text-slate-900">Menu</span>
            <button
              onClick={() => onClose()}
              className="p-2 -mr-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {/* Mobile search */}
          <form onSubmit={onSearchSubmit} className="relative mb-5">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, articles..."
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all"
            />
          </form>

          {/* Current Mobile User Role Pill */}
          {user ? (
            <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${roleTheme.avatarBg}`}>
                    {(user.name || user.email || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{user.name}</div>
                    <div className="text-[10px] text-slate-500">{user.email}</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${roleTheme.tagBadge}`}>
                  {user.role}
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <Link
                  to="/signup"
                  onClick={() => onClose()}
                  className="text-brand-600 font-bold hover:underline"
                >
                  + Register Account
                </Link>
                <button
                  onClick={() => {
                    onClose()
                    logout()
                  }}
                  className="text-rose-600 font-semibold hover:underline"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => onClose()}
                  className="py-2.5 px-3 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 flex items-center justify-center gap-1.5"
                >
                  <LogIn size={14} className="text-brand-600" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => onClose()}
                  className="py-2.5 px-3 text-center text-xs font-bold text-white bg-action-600 rounded-xl hover:bg-action-700 flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Sign Up</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  onClick={() => onClose()}
                  className="text-[11px] text-slate-500 hover:text-slate-800 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
          )}

          <nav className="space-y-1">
            {[
              { label: 'Explore Courses', href: '/courses', icon: BookOpen },
              { label: 'Learning Paths', href: '/paths', icon: GraduationCap },
              { label: 'Certifications', href: '/certifications', icon: Award },
              { label: 'Practical Labs', href: '/labs', icon: Sparkles },
              { label: 'My Learning Profile', href: '/courses', icon: User },
            ].map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.label}
                  to={link.href}
                  end
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive ? 'bg-emerald-50 text-brand-600' : 'text-slate-700 hover:text-brand-600 hover:bg-emerald-50'
                    }`
                  }
                >
                  <span className="w-9 h-9 rounded-lg bg-emerald-50 group-hover:bg-white flex items-center justify-center transition-colors">
                    <Icon size={18} className="text-brand-600" />
                  </span>
                  <span className="flex-1">{link.label}</span>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-6 pt-5 border-t border-slate-200 flex gap-3">
            <Link
              to="/courses"
              onClick={() => onClose()}
              className="flex-1 py-2.5 px-4 text-center text-sm font-semibold text-white bg-action-600 rounded-xl hover:bg-action-700"
            >
              Browse Catalog
            </Link>
            <Link
              to="/certifications"
              onClick={() => onClose()}
              className="flex-1 py-2.5 px-4 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
            >
              Certifications
            </Link>
          </div>
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
