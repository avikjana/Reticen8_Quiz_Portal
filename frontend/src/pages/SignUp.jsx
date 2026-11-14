import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield,
  Briefcase,
  Users,
  Lock,
  Mail,
  User,
  Building,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  UserPlus
} from 'lucide-react'
import { useAuth, dashboardPathFor } from '../context/AuthContext'
import GoogleSignInButton, { OrDivider } from '../components/Auth/GoogleSignInButton'

const allCategories = [
  {
    id: 'Administrator',
    label: 'Administrator',
    roleTag: 'System & Security Admin',
    desc: 'Full enterprise control, audit logs, and user provisioning.',
    icon: Shield,
    color: 'purple',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    btnClass: 'bg-purple-600 hover:bg-purple-700',
    ringClass: 'focus:ring-purple-500/20 focus:border-purple-600',
  },
  {
    id: 'Employee',
    label: 'Employee',
    roleTag: 'Security Engineer',
    desc: 'Internal firewall labs, threat defense curriculum, and sandboxes.',
    icon: Briefcase,
    color: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    btnClass: 'bg-[#16A34A] hover:bg-[#15803D]',
    ringClass: 'focus:ring-[#16A34A]/20 focus:border-[#16A34A]',
  },
  {
    id: 'Partner',
    label: 'Partner',
    roleTag: 'Authorized Training Partner',
    desc: 'Partner academy portal, seat management, and co-branded credentials.',
    icon: Users,
    color: 'blue',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    btnClass: 'bg-blue-600 hover:bg-blue-700',
    ringClass: 'focus:ring-blue-500/20 focus:border-blue-600',
  },
]

// Administrator accounts can only be created by an existing admin, so they
// aren't offered on the public sign-up form.
const categories = allCategories.filter((c) => c.id !== 'Administrator')

export default function SignUp() {
  const navigate = useNavigate()
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
        roleTitle:
          selectedCategory === 'Administrator'
            ? 'Enterprise Systems Administrator'
            : selectedCategory === 'Partner'
            ? 'Authorized Training Partner'
            : 'Security Operations Engineer',
      })

      if (res.success) {
        setSuccessMsg(`Account created successfully for ${res.user.name}! Logging you in...`)
        setTimeout(() => navigate(dashboardPathFor(res.user.role), { replace: true }), 900)
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
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] max-w-[90vw] h-[400px] bg-emerald-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Top Brand Link */}
      <div className="relative mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
            <Shield size={22} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[15px] font-black tracking-wide text-white uppercase">
              Reticen8
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#16A34A] uppercase -mt-0.5">
              Academy
            </span>
          </div>
        </Link>
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-[#16A34A]">
                <UserPlus size={18} />
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Create an Academy Account
              </h1>
            </div>
            <Link
              to="/login"
              className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1"
            >
              <span>Sign In</span>
              <ArrowRight size={13} />
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            Choose your role category and enter your enterprise credentials to begin.
          </p>

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
                          : 'text-[#16A34A]'
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
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center font-bold">
                <IconComponent size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">{activeCategory.roleTag}</div>
                <div className="text-[10px] text-slate-500">{activeCategory.desc}</div>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${activeCategory.badgeClass}`}>
              {activeCategory.label}
            </span>
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
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
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
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
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
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
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
                className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
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
              setTimeout(() => navigate(dashboardPathFor(u.role), { replace: true }), 500)
            }}
            onError={(msg) => setErrorMsg(msg)}
          />
        </div>

        {/* Footer Links */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div>
            <span>Already have an account? </span>
            <Link to="/login" className="font-bold text-[#16A34A] hover:underline">
              Sign In here
            </Link>
          </div>
          <Link to="/forgot-password" className="text-slate-500 hover:text-slate-800 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  )
}
