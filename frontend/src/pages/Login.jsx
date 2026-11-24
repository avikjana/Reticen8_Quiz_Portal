import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
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
  const from = location.state?.from
  const gatedPage = describeGatedPage(from)
  const goAfterLogin = (u) => navigate(pathAfterAuth(from, u.role), { replace: true })
  const { login, verifyMfa } = useAuth()

  const [selectedCategory, setSelectedCategory] = useState('Customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // MFA state
  const [mfaStep, setMfaStep] = useState(false)
  const [mfaToken, setMfaToken] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const mfaInputRef = useRef(null)

  const activeCategory = categories.find((c) => c.id === selectedCategory) || getRole()
  const IconComponent = activeCategory.icon

  const handleCategorySwitch = (catId) => {
    setSelectedCategory(catId)
    setErrorMsg('')
  }

  // Focus the MFA input when the step appears
  useEffect(() => {
    if (mfaStep && mfaInputRef.current) mfaInputRef.current.focus()
  }, [mfaStep])

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
    } else if (result.mfaRequired) {
      setMfaToken(result.mfaToken)
      setMfaCode('')
      setMfaStep(true)
      setErrorMsg('')
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please check your credentials.')
    }
  }

  const handleMfaSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    const result = await verifyMfa({ mfaToken, code: mfaCode })

    setLoading(false)

    if (result.success) {
      setSuccessMsg(`Welcome, ${result.user.name}! Verified successfully.`)
      setTimeout(() => goAfterLogin(result.user), 700)
    } else {
      setErrorMsg(result.error || 'Invalid verification code. Please try again.')
    }
  }

  const handleBackToLogin = () => {
    setMfaStep(false)
    setMfaToken('')
    setMfaCode('')
    setErrorMsg('')
  }

  // Auto-submit when 6 digits (TOTP) or 8 characters (backup code) are entered
  const handleMfaCodeChange = (val) => {
    const cleaned = val.replace(/\s/g, '')
    setMfaCode(cleaned)
  }

  return (
    <AuthLayout
      eyebrow="Reticen8 Academy"
      title="Your firewall. Your training."
      subtitle="Sign in to access official Reticen8 training — product walkthroughs, hands-on labs and certification pathways built by the team behind your firewall."
    >
      <div className="w-full max-w-md mx-auto lg:mr-0 bg-white rounded-3xl shadow-[var(--shadow-lift)] ring-1 ring-slate-200/80 overflow-hidden text-slate-900 relative">
        {/* Header */}
        <div className="p-8 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <Logo size="sm" label="" asLink={false} className="mb-3" />

          {!mfaStep ? (
            <>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Sign In to Your Account
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose your organization category to access role-specific training and lab resources.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="p-2 rounded-xl bg-blue-50 text-[#4b6cf7]">
                  <ShieldCheck size={20} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Two-Factor Authentication
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Open your authenticator app and enter the 6-digit code, or use a backup code.
              </p>
            </>
          )}

          {gatedPage && !mfaStep && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800" role="status">
              <Lock size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="font-bold">Members only.</strong> Please sign in or create a free account to view {gatedPage}. You'll be taken straight there afterwards.
              </span>
            </div>
          )}

          {/* 3 Categories Tab Switcher — hidden during MFA */}
          {!mfaStep && (
            <div className="mt-5 grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
              {categories.map((cat) => {
                const CatIcon = cat.icon
                const isSelected = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySwitch(cat.id)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all border ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-sm border-slate-200/80'
                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/50'
                    }`}
                  >
                    <CatIcon
                      size={16}
                      className={
                        isSelected
                          ? 'text-[#4b6cf7]'
                          : 'text-slate-400'
                      }
                    />
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ============ MFA VERIFICATION STEP ============ */}
        {mfaStep ? (
          <form onSubmit={handleMfaSubmit} className="p-8 pt-6 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700 font-medium">
                <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2.5 text-xs text-blue-800 font-semibold">
                <CheckCircle2 size={16} className="text-[#4b6cf7] flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Authenticator code */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Verification Code</label>
              <div className="relative">
                <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  ref={mfaInputRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  value={mfaCode}
                  onChange={(e) => handleMfaCodeChange(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={8}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-center text-lg font-mono font-bold text-slate-800 tracking-[0.3em] placeholder:text-slate-400 placeholder:tracking-normal placeholder:text-sm placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#4b6cf7]/20 focus:border-[#4b6cf7] transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Enter the code from your authenticator app, or an 8-character backup code.
              </p>
            </div>

            <div className="pt-1 space-y-2.5">
              <button
                type="submit"
                disabled={loading || mfaCode.length < 6}
                className="w-full py-3.5 px-4 rounded-xl text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 bg-[#4b6cf7] hover:bg-[#3b5ce6] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Verify & Sign In</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Back to sign in</span>
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* ============ NORMAL LOGIN FORM ============ */}
            <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-4">
              {/* Active Category Description */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 flex-shrink-0 shadow-2xs">
                  <IconComponent size={18} />
                </div>
                <span className="text-xs font-bold text-slate-900">{activeCategory.label}</span>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700 font-medium">
                  <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2.5 text-xs text-blue-800 font-semibold">
                  <CheckCircle2 size={16} className="text-[#4b6cf7] flex-shrink-0" />
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
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:underline"
                  >
                    Forgot Password?
                  </Link>
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
                role={selectedCategory === 'Partner' ? 'Partner' : 'Customer'}
                onSuccess={(u) => {
                  setErrorMsg('')
                  setSuccessMsg(`Welcome, ${u.name}! Signed in with Google.`)
                  setTimeout(() => goAfterLogin(u), 500)
                }}
                onError={(msg) => setErrorMsg(msg)}
                onMfaRequired={(token) => {
                  setMfaToken(token)
                  setMfaCode('')
                  setMfaStep(true)
                  setErrorMsg('')
                }}
              />
            </div>

            {/* Card Footer: Sign Up & Help */}
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-slate-600">
              <div>
                <span>New to Reticen8 Academy? </span>
                <Link to="/signup" state={{ from }} className="font-bold text-[#4b6cf7] hover:underline">
                  Create a free account
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
