import { Link } from 'react-router-dom'
import {
  Users, BookOpen, AlertCircle, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import useApi from '../../hooks/useApi'
import { ErrorState } from '../../components/ui/DataState'

export default function AdminDashboard() {
  const { user, } = useAuth()
  // No fallback numbers: if the API fails the page shows the error
  const { data: stats, loading, error, reload } = useApi('/admin/overview', { cacheResult: false })

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                Administrator Control Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Enterprise Academy Administration
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Logged in as {user?.name} ({user?.email})
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/admin/courses"
              className="flex items-center gap-1.5 px-4 py-2 bg-action-600 hover:bg-action-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <BookOpen size={14} />
              <span>Course Design Manager</span>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              <Users size={14} />
              <span>Manage Users</span>
            </Link>
          </div>
        </div>

        {/* Course Design Notice Banner */}
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900">
                Course Design &amp; Lab Materials Status: Ready for Author Input
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                All placeholder lab materials, modules, and fake curriculums have been cleanly removed. The system structure is primed to accept your custom course syllabus, module definitions, and lab exercises.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Link
                  to="/admin/courses"
                  className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  Configure Course Catalog →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {error && <ErrorState error={error} onRetry={reload} title="We couldn't load the admin overview" className="mb-8" />}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Total Accounts
            </div>
            <div className="text-3xl font-black text-slate-900">
              {stats?.totalUsers ?? '—'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active in 3 role categories
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Active Courses
            </div>
            <div className="text-3xl font-black text-slate-900">
              {stats?.totalCourses ?? '—'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Awaiting course design input
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              System Health
            </div>
            {stats ? (
              <div className="text-2xl font-black text-brand-600 flex items-center gap-2">
                <CheckCircle2 size={22} />
                <span>{stats.systemHealth?.status || 'Operational'}</span>
              </div>
            ) : (
              <div className={`text-2xl font-black flex items-center gap-2 ${error ? 'text-rose-600' : 'text-slate-400'}`}>
                <AlertCircle size={22} />
                <span>{loading ? 'Checking…' : 'Unreachable'}</span>
              </div>
            )}
            <div className="text-[11px] text-slate-500 mt-1">
              {stats?.systemHealth?.memoryUsageMB ? `API memory: ${stats.systemHealth.memoryUsageMB} MB` : 'Backend API'}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Active Role Categories
            </div>
            <div className="text-xs font-bold text-slate-800 space-y-1">
              <div className="text-purple-700">🛡️ Administrator</div>
              <div className="text-emerald-700">💼 Employee (Engineer)</div>
              <div className="text-blue-700">🤝 Training Partner</div>
            </div>
          </div>
        </div>

        {/* Quick Role Navigation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Role Portals &amp; Navigation</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              to="/employee"
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-800">Employee / Engineer View</div>
                <div className="text-[11px] text-slate-500">Student &amp; learning dashboard</div>
              </div>
              <ArrowRight size={14} className="text-brand-600" />
            </Link>

            <Link
              to="/partner"
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-800">Partner Organization Portal</div>
                <div className="text-[11px] text-slate-500">Seat &amp; trainee management</div>
              </div>
              <ArrowRight size={14} className="text-blue-600" />
            </Link>

            <Link
              to="/courses"
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-800">Public Academy Catalog</div>
                <div className="text-[11px] text-slate-500">Public course discovery</div>
              </div>
              <ArrowRight size={14} className="text-slate-500" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
