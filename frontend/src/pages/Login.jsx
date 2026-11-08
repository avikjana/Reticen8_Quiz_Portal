import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield,
  Briefcase,
  Users,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowLeft,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const categories = [
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
    demoEmail: 'admin@reticen8.com',
    demoPass: 'AdminPassword123!',
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
    demoEmail: 'employee@reticen8.com',
    demoPass: 'EmployeePassword123!',
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
    demoEmail: 'partner@reticen8.com',
    demoPass: 'PartnerPassword123!',
  },
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [selectedCategory, setSelectedCategory] = useState('Employee')
  const [email, setEmail] = useState('employee@reticen8.com')
  const [password, setPassword] = useState('EmployeePassword123!')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const activeCategory = categories.find((c) => c.id === selectedCategory) || categories[1]
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
      setTimeout(() => {
        navigate('/')
      }, 700)
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please check your credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Back to Home Link */}
      <div className="max-w-md w-full mx-auto mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Reticen8 Academy</span>
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 relative">
        {/* Header */}
        <div className="p-8 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center text-white shadow-xs">
              <Shield size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-xs font-black tracking-widest text-slate-900 uppercase">
              Reticen8 Identity Portal
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose your organization category to access role-specific training and lab resources.
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
                          ? 'text-[#16A34A]'
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
              <button
                type="button"
                onClick={() => {
                  setEmail(activeCategory.demoEmail)
                  setPassword(activeCategory.demoPass)
                }}
                className="text-[11px] font-bold text-[#16A34A] hover:underline flex items-center gap-1"
              >
                <KeyRound size={12} />
                <span>Fill Demo Password</span>
              </button>
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

        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Backend Port: 5000</span>
          <span className="font-mono text-emerald-600 font-bold">API Online</span>
        </div>
      </div>
    </div>
  )
}
