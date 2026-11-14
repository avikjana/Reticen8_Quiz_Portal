import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import useFocusTrap from '../hooks/useFocusTrap'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react'
import { ROLE_CATEGORIES, getRole } from '../config/roles'
import Logo from './ui/Logo'
import { useAuth } from '../context/AuthContext'
import GoogleSignInButton, { OrDivider } from './Auth/GoogleSignInButton'

const categories = ROLE_CATEGORIES

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login, loginModalDefaultCategory } = useAuth()

  const [selectedCategory, setSelectedCategory] = useState(loginModalDefaultCategory || 'Employee')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const trapRef = useFocusTrap(isLoginModalOpen)

  // Close on Escape while the modal is open
  useEffect(() => {
    if (!isLoginModalOpen) return
    const onKey = (e) => e.key === 'Escape' && closeLoginModal()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isLoginModalOpen, closeLoginModal])

  // Sync category when opened with specific parameter
  useEffect(() => {
    if (loginModalDefaultCategory) {
      setSelectedCategory(loginModalDefaultCategory)
      const currentCat = categories.find((c) => c.id === loginModalDefaultCategory) || getRole()
      setEmail(currentCat.demoEmail)
      setPassword(currentCat.demoPass)
    }
  }, [loginModalDefaultCategory, isLoginModalOpen])

  // When switching category tabs, auto-fill the demo credentials for that category
  const handleCategorySwitch = (catId) => {
    setSelectedCategory(catId)
    setErrorMsg('')
    const target = categories.find((c) => c.id === catId)
    if (target) {
      setEmail(target.demoEmail)
      setPassword(target.demoPass)
    }
  }

  const activeCategory = categories.find((c) => c.id === selectedCategory) || getRole()
  const IconComponent = activeCategory.icon

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    const result = await login({
      email,
      password,
      role: selectedCategory,
    })

    setLoading(false)

    if (result.success) {
      setSuccessMsg(`Welcome, ${result.user.name}! Connected as ${result.user.role}.`)
      setTimeout(() => {
        closeLoginModal()
        setSuccessMsg('')
      }, 700)
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please check your credentials.')
    }
  }

  if (!isLoginModalOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={closeLoginModal}
    >
      <motion.div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative outline-none"
      >
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="p-7 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <Logo size="sm" label="Identity Access" asLink={false} className="mb-3" />

          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Your Workspace
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Choose your account category and authenticate via the Reticen8 Security Gateway.
          </p>

          {/* 3 Categories Tab Switcher */}
          <div className="mt-5 grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
            {categories.map((cat) => {
              const CatIcon = cat.icon
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySwitch(cat.id)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                  }`}
                >
                  <CatIcon
                    size={16}
                    className={
                      isSelected
                        ? cat.color === 'purple'
                          ? 'text-purple-600'
                          : cat.color === 'emerald'
                          ? 'text-brand-600'
                          : 'text-blue-600'
                        : 'text-slate-400'
                    }
                  />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-7 pt-5 space-y-4">

          {/* Role Description Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className={`p-2 rounded-lg bg-white border border-slate-200 text-slate-700 flex-shrink-0 shadow-2xs`}>
              <IconComponent size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{activeCategory.label} Portal</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeCategory.badgeClass}`}>
                  {activeCategory.roleTag}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {activeCategory.desc}
              </p>
            </div>
          </div>

          {/* Error & Success Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-semibold">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Work Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@reticen8.com"
                className={`w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${activeCategory.ringClass} transition-all`}
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Password
              </label>
              <div className="flex items-center gap-3">
                <a
                  href="/forgot-password"
                  onClick={() => closeLoginModal()}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:underline"
                >
                  Forgot Password?
                </a>
                {import.meta.env.DEV && (
                <button
                  type="button"
                  onClick={() => {
                    setEmail(activeCategory.demoEmail)
                    setPassword(activeCategory.demoPass)
                  }}
                  className="text-[11px] font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <KeyRound size={12} />
                  <span>Fill Demo Password</span>
                </button>
                )}
              </div>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full h-11 pl-10 pr-11 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${activeCategory.ringClass} transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Backend Connection Indicator */}
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Target: Backend Auth Gateway (Port 5000)</span>
            </span>
            <span className="font-mono text-slate-500">v7.4 API</span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-xl text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${activeCategory.btnClass} disabled:opacity-50`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating with Backend...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {activeCategory.label}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Google sign-in */}
        <div className="px-7 pb-6 -mt-1 space-y-4">
          <OrDivider />
          <GoogleSignInButton
            text="signin_with"
            role={selectedCategory === 'Partner' ? 'Partner' : 'Employee'}
            onSuccess={() => {
              setErrorMsg('')
              closeLoginModal()
            }}
            onError={(msg) => setErrorMsg(msg)}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-7 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            <span>Don't have an account? </span>
            <a
              href="/signup"
              onClick={() => closeLoginModal()}
              className="font-bold text-brand-600 hover:underline"
            >
              Sign Up
            </a>
          </div>
          <a
            href="/forgot-password"
            onClick={() => closeLoginModal()}
            className="text-slate-500 hover:text-slate-800 hover:underline"
          >
            Reset Password
          </a>
        </div>
      </motion.div>
    </div>
  )
}
