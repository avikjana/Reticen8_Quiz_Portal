import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react'
import { ROLE_CATEGORIES, getRole } from '../config/roles'
import Logo from '../components/ui/Logo'
import { useAuth, pathAfterAuth, describeGatedPage } from '../context/AuthContext'
import AuthLayout from '../components/Auth/AuthLayout'
import GoogleSignInButton, { OrDivider } from '../components/Auth/GoogleSignInButton'

const categories = ROLE_CATEGORIES

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  // Send users back to the protected page they tried to open, else their dashboard
  const from = location.state?.from
  const gatedPage = describeGatedPage(from)
  const goAfterLogin = (u) => navigate(pathAfterAuth(from, u.role), { replace: true })
  const { login } = useAuth()

  const [selectedCategory, setSelectedCategory] = useState('Employee')
  const [email, setEmail] = useState(import.meta.env.DEV ? 'employee@reticen8.com' : '')
  const [password, setPassword] = useState(import.meta.env.DEV ? 'EmployeePassword123!' : '')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const activeCategory = categories.find((c) => c.id === selectedCategory) || getRole()
  const IconComponent = activeCategory.icon

  const handleCategorySwitch = (catId) => {
    setSelectedCategory(catId)
    setErrorMsg('')
    const target = categories.find((c) => c.id === catId)
    if (target) {
      setEmail(target.demoEmail)
      setPassword(target.demoPass)
    }
  }

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
      setTimeout(() => goAfterLogin(result.user), 700)
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please check your credentials.')
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Build your skills. Build your future."
      subtitle="Sign in to pick up where you left off — courses, hands-on firewall labs and certification guides are all waiting for you."
    >
      <div className="w-full max-w-md mx-auto lg:mr-0 bg-white rounded-3xl shadow-[var(--shadow-lift)] ring-1 ring-slate-200/80 overflow-hidden text-slate-900 relative">
        {/* Header */}
        <div className="p-8 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <Logo size="sm" label="Identity Portal" asLink={false} className="mb-3" />

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose your organization category to access role-specific training and lab resources.
          </p>

          {gatedPage && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800" role="status">
              <Lock size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="font-bold">Members only.</strong> Please sign in or create a free account to view {gatedPage}. You'll be taken straight there afterwards.
              </span>
            </div>
          )}

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
        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-4">
          {/* Active Category Description */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 flex-shrink-0 shadow-2xs">
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

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Work Email</label>
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

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="flex items-center gap-3">
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:underline"
                >
                  Forgot Password?
                </Link>
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-xl text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${activeCategory.btnClass} disabled:opacity-50`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connecting to Backend Auth...</span>
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
        <div className="px-8 pb-7 -mt-2 space-y-4">
          <OrDivider />
          <GoogleSignInButton
            text="signin_with"
            role={selectedCategory === 'Partner' ? 'Partner' : 'Employee'}
            onSuccess={(u) => {
              setErrorMsg('')
              setSuccessMsg(`Welcome, ${u.name}! Signed in with Google.`)
              setTimeout(() => goAfterLogin(u), 500)
            }}
            onError={(msg) => setErrorMsg(msg)}
          />
        </div>

        {/* Card Footer: Sign Up & Help */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-slate-600">
          <div>
            <span>New to Reticen8 Academy? </span>
            <Link to="/signup" state={{ from }} className="font-bold text-brand-600 hover:underline">
              Create a free account
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
