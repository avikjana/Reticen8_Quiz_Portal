import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Lock, CheckCircle2, AlertCircle, Users } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import api from '../../services/api'

export default function AdminQuizAttempts() {
  const [locked, setLocked] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [resetting, setResetting] = useState(null)
  const [toast, setToast] = useState(null)

  const fetchLocked = async () => {
    setLoading(true)
    try {
      const r = await api.get('/admin/quiz/locked')
      if (r.success) setLocked(r.locked)
      else setError('Failed to load locked quiz attempts')
    } catch (e) {
      setError(e.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLocked() }, [])

  const handleReset = async (item) => {
    const key = `${item.userId}-${item.courseId}-${item.moduleIndex}`
    setResetting(key)
    try {
      const r = await api.post('/admin/quiz/reset', {
        userId: item.userId,
        courseId: item.courseId,
        moduleIndex: item.moduleIndex,
      })
      if (r.success) {
        setLocked(prev => prev.filter(l => !(l.userId === item.userId && l.courseId === item.courseId && l.moduleIndex === item.moduleIndex)))
        setToast({ type: 'success', message: `Reset quiz for ${item.userName || item.userEmail}` })
        setTimeout(() => setToast(null), 3000)
      }
    } catch (e) {
      setToast({ type: 'error', message: e.message || 'Reset failed' })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setResetting(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quiz Attempt Management</h1>
            <p className="text-xs text-slate-500 mt-1">Users who have exhausted their quiz attempts and need a reset</p>
          </div>
          <button onClick={fetchLocked} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            <RotateCcw size={13} /> Refresh
          </button>
        </div>

        {toast && (
          <div className={`mb-4 p-3 rounded-xl border flex items-center gap-2.5 text-xs font-medium ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            {toast.message}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-8 h-8 rounded-full border-[3px] border-emerald-100 border-t-brand-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-sm text-rose-700">{error}</div>
        ) : locked.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">All Clear</h3>
            <p className="text-sm text-slate-500">No users are currently locked out of any quizzes.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <Lock size={14} className="text-rose-500" />
              <span className="text-xs font-bold text-slate-700">{locked.length} locked attempt{locked.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="divide-y divide-slate-100">
              {locked.map((item) => {
                const key = `${item.userId}-${item.courseId}-${item.moduleIndex}`
                return (
                  <div key={key} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <Users size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{item.userName || 'Unknown User'}</p>
                        <p className="text-[11px] text-slate-500 truncate">{item.userEmail}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {item.courseId}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Module {item.moduleIndex + 1} — {item.attemptsUsed} attempts used
                          </span>
                          {item.userRole && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              item.userRole === 'Partner' ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {item.userRole}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleReset(item)}
                      disabled={resetting === key}
                      className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50 shrink-0"
                    >
                      {resetting === key ? (
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <RotateCcw size={13} />
                      )}
                      Reset Attempts
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
