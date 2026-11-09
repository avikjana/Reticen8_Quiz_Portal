import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, Mail, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mb-6">
          <KeyRound size={24} />
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-2">Reset Password</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Enter your registered enterprise or academy email to receive password reset instructions.
        </p>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs mb-6">
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle2 size={16} className="text-[#16A34A]" />
              <span>Reset Link Dispatched</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              If an account exists for <strong>{email}</strong>, you will receive instructions shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@reticen8.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#16A34A]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
            >
              Send Password Reset Instructions
            </button>
          </form>
        )}

        {/* Demo note */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 mb-6">
          <span className="font-bold text-slate-700 block mb-1">Demo Environment Credentials:</span>
          Admin: <code className="text-purple-700">admin@reticen8.com</code> / <code className="text-purple-700">AdminPassword123!</code><br />
          Employee: <code className="text-emerald-700">employee@reticen8.com</code> / <code className="text-emerald-700">EmployeePassword123!</code><br />
          Partner: <code className="text-blue-700">partner@reticen8.com</code> / <code className="text-blue-700">PartnerPassword123!</code>
        </div>

        <Link
          to="/login"
          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  )
}
