import { Link } from 'react-router-dom'
import {
  Users, BookOpen, AlertCircle, CheckCircle2, ArrowRight, GraduationCap, MessageCircle, RotateCcw
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import useApi from '../../hooks/useApi'
import { ErrorState } from '../../components/ui/DataState'

export default function AdminDashboard() {
  const { user } = useAuth()
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
              <span>Manage Courses</span>
            </Link>
            <Link
              to="/admin/chat"
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <MessageCircle size={14} />
              <span>Messages</span>
            </Link>
            <Link
              to="/admin/quiz-attempts"
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <RotateCcw size={14} />
              <span>Quiz Resets</span>
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

        {error && <ErrorState error={error} onRetry={reload} title="We couldn't load the admin overview" className="mb-8" />}

        {/* Stats Grid — clickable cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Link
            to="/admin/users"
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-purple-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Total Accounts
              </div>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-purple-500 transition-colors" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {stats?.totalUsers ?? '—'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                {stats?.usersByRole?.administrators ?? 0} Admin
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-2" />
                {stats?.usersByRole?.customers ?? 0} Customer
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-2" />
                {stats?.usersByRole?.partners ?? 0} Partner
              </div>
            </div>
          </Link>

          <Link
            to="/admin/courses"
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-emerald-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Active Courses
              </div>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {stats?.totalCourses ?? '—'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Click to manage courses
            </div>
          </Link>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Total Enrollments
            </div>
            <div className="text-3xl font-black text-emerald-700 flex items-center gap-2">
              <GraduationCap size={24} />
              {stats?.totalEnrollments ?? '—'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Active student enrollments
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
              {stats?.systemHealth?.memoryUsageMB ? `Memory: ${stats.systemHealth.memoryUsageMB} MB • Node ${stats.systemHealth.nodeVersion}` : 'Backend API'}
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Navigation</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              to="/admin/users"
              className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-800">User Management</div>
                <div className="text-[11px] text-slate-500">View all accounts &amp; enrollments</div>
              </div>
              <ArrowRight size={14} className="text-purple-600" />
            </Link>

            <Link
              to="/admin/courses"
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-800">Course Management</div>
                <div className="text-[11px] text-slate-500">Add, remove &amp; manage courses</div>
              </div>
              <ArrowRight size={14} className="text-brand-600" />
            </Link>

            <Link
              to="/courses"
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-800">Public Course Catalog</div>
                <div className="text-[11px] text-slate-500">View as students see it</div>
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
