import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import authService from '../../services/authService'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setError('')
    if (password !== confirm) {
      setError('The two passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await authService.resetPassword({ token, password })
      setDone(true)
      setTimeout(() => navigate('/login', { replace: true }), 1800)
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot reach the server. Please try again in a moment.'
          : err.message || 'Could not reset your password. The link may have expired.'
      )
    } finally {
      setLoading(false)
    }
  }

  const card = 'w-full max-w-md mx-auto lg:mr-0 bg-white rounded-3xl ring-1 ring-slate-200/80 p-6 sm:p-8 shadow-[var(--shadow-lift)]'

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Choose a new password."
      subtitle="Pick a strong password you don't use anywhere else. You'll be signed in with it next time."
      points={['At least 8 characters', 'A letter and a number', 'Link is single-use and expires in 1 hour']}
    >
      <div className={card}>
        {!token ? (
          <div role="alert">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5">
              <AlertCircle size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Reset link is missing</h2>
            <p className="text-sm text-slate-500 mb-6">
              This page needs a reset link from your email. Request a new one and open the link it sends you.
            </p>
            <Link to="/forgot-password" className="inline-block px-5 py-2.5 rounded-full text-xs font-bold text-white bg-action-600 hover:bg-action-700 transition-colors">
              Request a reset link
            </Link>
          </div>
        ) : done ? (
          <div role="status">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-brand-600 flex items-center justify-center mb-5">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Password updated</h2>
            <p className="text-sm text-slate-500">Taking you to the sign-in page…</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Set a new password</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">Enter and confirm your new password below.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-medium" role="alert">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="new-password">New password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="new-password"
                    type={show ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    aria-label={show ? 'Hide password' : 'Show password'}
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">At least 8 characters, including a letter and a number.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="confirm-password">Confirm password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="confirm-password"
                    type={show ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-action-600 hover:bg-action-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-60"
              >
                {loading ? 'Updating…' : 'Reset password'}
              </button>
            </form>
          </>
        )}

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </AuthLayout>
  )
}
