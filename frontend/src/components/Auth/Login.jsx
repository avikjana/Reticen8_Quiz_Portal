import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield, Briefcase, Users, Lock, Mail, Eye, EyeOff,
  ArrowRight, CheckCircle2, AlertCircle, KeyRound
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

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

export default function Login({ onSuccess }) {
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
      setSuccessMsg(`Authenticated as ${selectedCategory}! Redirecting...`)
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(result.user)
        } else {
          if (selectedCategory === 'Administrator') {
            navigate('/admin')
          } else if (selectedCategory === 'Partner') {
            navigate('/partner')
          } else {
            navigate('/employee')
          }
        }
      }, 700)
    } else {
      setErrorMsg(result.error || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Select Role / Category
        </label>
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id
            const TabIcon = cat.icon
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySwitch(cat.id)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <TabIcon size={14} className={isSelected ? 'text-[#16A34A]' : 'text-slate-400'} />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Role Banner */}
      <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
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

      {/* Alert Notices */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0 text-[#16A34A]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`e.g. ${activeCategory.demoEmail}`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-semibold text-[#16A34A] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-70 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          {loading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Sign In as {activeCategory.label}</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
