import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, Shield, BookOpen, Award, ArrowRight, LogIn, Users, LogOut, RefreshCw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import useDismissable from '../../hooks/useDismissable'

// Signed in: avatar pill with the account dropdown.
// Signed out: Login / Sign Up buttons. (Tablet and up — phones use the drawer.)
export default function UserMenu({ role, roleTheme }) {
  const { user, logout, openLoginModal } = useAuth()
  const { open, setOpen, ref } = useDismissable()

  return user ? (
  <div className="relative hidden sm:block" ref={ref}>
    <button
      onClick={() => setOpen(!open)}
      className="flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs"
      title={`Logged in as ${user.name} (${user.role})`}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${roleTheme.avatarBg}`}>
        {(user.name || user.email || '?')[0].toUpperCase()}
      </div>
      <div className="flex flex-col text-left leading-none">
        <span className="text-xs font-bold text-slate-800">
          {user.name ? user.name.split(' ')[0] : 'Account'}
        </span>
        <span className={`text-[10px] font-semibold ${roleTheme.tagText}`}>
          {roleTheme.label}
        </span>
      </div>
      <ChevronDown size={11} className="text-slate-400 ml-0.5" />
    </button>

    {/* User Dropdown */}
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full mt-3 w-72 origin-top-right bg-white/95 backdrop-blur-xl rounded-2xl shadow-[var(--shadow-lift)] ring-1 ring-slate-900/5 p-4 z-50 text-slate-800 text-xs"
        >
          {/* User Info Header */}
          <div className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-slate-900 block truncate">
                {user.name}
              </span>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${roleTheme.tagBadge}`}>
                {user.role}
              </span>
            </div>
            <span className="text-slate-500 text-[11px] block truncate">
              {user.email}
            </span>
            <span className="text-slate-400 text-[10px] block mt-0.5">
              {user.roleTitle || user.department}
            </span>
          </div>

          {/* Switch account */}
          <div className="py-2.5 border-b border-slate-100">
            <button
              onClick={() => {
                setOpen(false)
                openLoginModal(user.role)
              }}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
            >
              <RefreshCw size={13} className="text-brand-600" /> Switch account
            </button>
          </div>

          {/* Navigation Links */}
          <div className="py-2 space-y-1">
            <Link
              to={role.dashboardPath}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 hover:bg-emerald-50 text-slate-900 font-bold"
            >
              <Shield size={14} className="text-brand-600" />
              <span>{role.dashboardLabel}</span>
            </Link>
            <Link
              to="/courses"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
            >
              <BookOpen size={14} className="text-brand-600" /> Course Catalog
            </Link>
            <Link
              to="/certifications"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
            >
              <Award size={14} className="text-brand-600" /> Certifications &amp; Badges
            </Link>
          </div>

          {/* Account Options: Login, Signup, Forgot Password */}
          <div className="py-2 border-t border-slate-100 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">
              Authentication Options
            </div>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
            >
              <LogIn size={13} className="text-brand-600" />
              <span>Login / Switch Account</span>
            </Link>
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
            >
              <Users size={13} className="text-blue-600" />
              <span>Sign Up / Create Account</span>
            </Link>
            <Link
              to="/forgot-password"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
            >
              <HelpCircle size={13} className="text-amber-500" />
              <span>Forgot Password?</span>
            </Link>
          </div>

          {/* Sign Out */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setOpen(false)
                logout()
              }}
              className="flex items-center gap-1.5 p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg font-medium transition-colors"
            >
              <LogOut size={13} /> Sign Out
            </button>
            <span className="text-[10px] text-slate-400">Reticen8 Auth</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
) : (
  <div className="hidden sm:flex items-center gap-2.5">
    <Link
      to="/login"
      className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
    >
      <LogIn size={13} className="text-brand-600" />
      <span>Login</span>
    </Link>
    <Link
      to="/signup"
      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-action-600 hover:bg-action-700 text-white text-xs font-bold transition-all shadow-[var(--shadow-glow)] hover:-translate-y-px"
    >
      <span>Sign Up</span>
      <ArrowRight size={12} />
    </Link>
  </div>
)
}
