import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Clock, GraduationCap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import useApi from '../../hooks/useApi'
import { ErrorState, PageSpinner } from '../../components/ui/DataState'

export default function PartnerDashboard() {
  const { user } = useAuth()
  const { data: enrollments, loading, error, reload } = useApi('/enrollments')
  const enrolled = enrollments || []

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 mb-2 inline-block">
              Authorized Partner Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Authorized Partner: {user?.name} • Training &amp; Certification
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{enrolled.length}</p>
                <p className="text-[11px] text-slate-500">Enrolled Courses</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-brand-600 flex items-center justify-center">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{enrolled.filter(e => e.status === 'active').length}</p>
                <p className="text-[11px] text-slate-500">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <GraduationCap size={18} />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{enrolled.filter(e => e.status === 'completed').length}</p>
                <p className="text-[11px] text-slate-500">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          My Enrolled Courses
        </h2>

        {loading && <PageSpinner />}
        {error && <ErrorState error={error} onRetry={reload} className="mb-8" />}

        {!loading && !error && enrolled.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center shadow-xs mb-10">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              No courses enrolled yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mb-6">
              Browse available partner courses and enroll to start your training.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-action-600 hover:bg-action-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
            >
              Browse Courses
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {enrolled.map((enrollment) => {
            const course = enrollment.course
            if (!course) return null
            return (
              <div
                key={enrollment.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {course.category}
                    </span>
                    <span className={`text-xs font-bold ${enrollment.status === 'completed' ? 'text-purple-600' : 'text-blue-600'}`}>
                      {enrollment.status === 'completed' ? 'Completed' : 'Enrolled'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{course.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {course.shortDesc}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-[11px] text-slate-500">
                    {course.modulesCount > 0 && (
                      <span className="flex items-center gap-1">
                        <BookOpen size={12} />
                        {course.modulesCount} Modules
                      </span>
                    )}
                    {course.duration && course.duration !== 'TBD' && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {course.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    course.difficultyColor === 'green' ? 'bg-emerald-50 text-emerald-700' :
                    course.difficultyColor === 'blue' ? 'bg-blue-50 text-blue-700' :
                    course.difficultyColor === 'amber' ? 'bg-amber-50 text-amber-700' :
                    'bg-purple-50 text-purple-700'
                  }`}>
                    {course.difficulty}
                  </span>
                  <Link
                    to={`/learn/${course.id}`}
                    className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  )
}
