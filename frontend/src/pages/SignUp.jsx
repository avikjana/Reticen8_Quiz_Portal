import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Lock,
  Mail,
  User,
  Building,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  UserPlus
} from 'lucide-react'
import { SIGNUP_CATEGORIES } from '../config/roles'
import { useAuth, pathAfterAuth, describeGatedPage } from '../context/AuthContext'
import AuthLayout from '../components/Auth/AuthLayout'
import GoogleSignInButton, { OrDivider } from '../components/Auth/GoogleSignInButton'


// Administrator accounts can only be created by an existing admin, so they
// aren't offered on the public sign-up form.
const categories = SIGNUP_CATEGORIES

export default function SignUp() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from
  const gatedPage = describeGatedPage(from)
  const { register } = useAuth()

  const [selectedCategory, setSelectedCategory] = useState('Employee')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const activeCategory = categories.find((c) => c.id === selectedCategory) || categories[0]
  const IconComponent = activeCategory.icon

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const res = await register({
        name,
        email,
        password,
        role: selectedCategory,
        department: department || 'Cybersecurity Division',
        roleTitle: activeCategory.signupRoleTitle,
      })

      if (res.success) {
        setSuccessMsg(`Account created successfully for ${res.user.name}! Logging you in...`)
        setTimeout(() => navigate(pathAfterAuth(from, res.user.role), { replace: true }), 900)
      } else {
        setErrorMsg(res.error || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to register. Please check your backend connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Join for free"
      title="Start learning. Get certified."
      subtitle="Create your free Reticen8 Academy account to unlock every course, the hands-on lab simulator and the certification guides."
      points={['Free introductory courses', 'Interactive firewall lab simulator', 'Industry-recognised certifications']}
    >
      {/* Card Container */}
      <div className="relative w-full max-w-lg mx-auto lg:mr-0 bg-white rounded-3xl shadow-[var(--shadow-lift)] ring-1 ring-slate-200/80 overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-brand-600">
                <UserPlus size={18} />
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Create an Academy Account
              </h1>
            </div>
            <Link
              to="/login"
              state={{ from }}
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              <span>Sign In</span>
              <ArrowRight size={13} />
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            Choose your role category and enter your enterprise credentials to begin.
          </p>

          {gatedPage && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800" role="status">
              <Lock size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="font-bold">Members only.</strong> Please create a free account or sign in to view {gatedPage}. You'll be taken straight there afterwards.
              </span>
            </div>
          )}

          {/* 3 Categories Selector */}
          <div className="mt-5 grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id
              const TabIcon = cat.icon
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id)
                    setErrorMsg('')
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
                >
                  <TabIcon
                    size={16}
                    className={`mb-1 ${
                      isSelected
                        ? cat.id === 'Administrator'
                          ? 'text-purple-600'
                          : cat.id === 'Partner'
                          ? 'text-blue-600'
                          : 'text-brand-600'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {/* Active Category Tag */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-brand-600 flex items-center justify-center font-bold">
                <IconComponent size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">{activeCategory.signupTag || activeCategory.roleTag}</div>
                {!activeCategory.signupTitleOnly && (
                  <div className="text-[10px] text-slate-500">{activeCategory.desc}</div>
                )}
              </div>
            </div>
            {!activeCategory.signupTitleOnly && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${activeCategory.badgeClass}`}>
                {activeCategory.label}
              </span>
            )}
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

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Avik Jana"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Enterprise / Work Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="avik@enterprise.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
              />
            </div>
          </div>

          {/* Department / Company */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Department / Organization</label>
            <div className="relative">
              <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Security Operations Center (SOC)"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                minLength={8}
                autoComplete="new-password"
                className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">At least 8 characters, including a letter and a number.</p>
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create {activeCategory.label} Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Google sign-up */}
        <div className="px-8 pb-7 -mt-2 space-y-4">
          <OrDivider />
          <GoogleSignInButton
            text="signup_with"
            role={selectedCategory}
            onSuccess={(u) => {
              setErrorMsg('')
              setSuccessMsg(`Welcome, ${u.name}! Signed in with Google.`)
              setTimeout(() => navigate(pathAfterAuth(from, u.role), { replace: true }), 500)
            }}
            onError={(msg) => setErrorMsg(msg)}
          />
        </div>

        {/* Footer Links */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-slate-600">
          <div>
            <span>Already have an account? </span>
            <Link to="/login" state={{ from }} className="font-bold text-brand-600 hover:underline">
              Sign In here
            </Link>
          </div>
          <Link to="/forgot-password" className="whitespace-nowrap text-slate-500 hover:text-slate-800 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
