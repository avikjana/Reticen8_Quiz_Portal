import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  BookOpen, Clock, Star, Award, ChevronRight, CheckCircle2,
  AlertCircle, Sparkles
} from 'lucide-react'
import Navbar from '../components/Navbar'
import AnnouncementBar from '../components/AnnouncementBar'
import Footer from '../components/Footer'
import useApi from '../hooks/useApi'
import { ErrorState, NotFoundState, PageSpinner } from '../components/ui/DataState'

// Loads the course from the API, then renders it. Unknown IDs get a proper
// "not found" page instead of silently showing a different course.
export default function CourseDetail() {
  const { id } = useParams()
  const { data: course, loading, error, reload } = useApi(`/courses/${encodeURIComponent(id)}`)

  if (course) return <CourseDetailView course={course} />

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        {loading ? (
          <PageSpinner />
        ) : error?.status === 403 ? (
          <NotFoundState
            title="Course not available"
            message={error.message}
            backTo="/courses"
            backLabel="See your courses"
          />
        ) : error?.status === 404 ? (
          <NotFoundState
            title="Course not found"
            message="This course doesn't exist or may have been removed."
            backTo="/courses"
            backLabel="Browse all courses"
          />
        ) : (
          <div className="max-w-md mx-auto px-4 py-16">
            <ErrorState error={error} onRetry={reload} title="We couldn't load this course" />
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

function CourseDetailView({ course }) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AnnouncementBar />
      <Navbar />

      {/* Course Hero Banner */}
      <section className="theme-fixed bg-slate-900 text-white pt-10 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] max-w-[90vw] h-[350px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <ChevronRight size={13} />
            <Link to="/courses" className="hover:text-emerald-400 transition-colors">Courses</Link>
            <ChevronRight size={13} />
            <span className="text-slate-200 truncate max-w-xs">{course.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Header Info */}
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  {course.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {course.difficulty} Level
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-400 border border-blue-800/80 flex items-center gap-1">
                  <Award size={13} />
                  <span>Aligned with {course.certificationCode}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {course.title}
              </h1>

              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                {course.description}
              </p>

              {/* Meta metrics */}
              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star size={16} className="fill-amber-400" />
                  <span>{course.rating} / 5.0</span>
                  <span className="text-slate-400 font-normal">({course.studentsCount.toLocaleString()} enrolled)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} />
                  <span>Self-Paced</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen size={16} />
                  <span>Official Reticen8 Training</span>
                </div>
              </div>
            </div>

            {/* Right Action Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl p-6 text-slate-900 border border-slate-200 shadow-xl">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Course Enrollment
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mb-4">
                  Complimentary Access
                </div>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Available for registered Reticen8 Academy students, authorized engineers, and enterprise partners.
                </p>
                <div className="space-y-3">
                  <button className="w-full py-3 px-4 bg-action-600 hover:bg-action-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
                    Enroll in Course
                  </button>
                  <Link
                    to="/courses"
                    className="block text-center w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                  >
                    ← Browse Other Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Detailed Tabs */}
      <section className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            {/* Tabs Selector */}
            <div className="flex border-b border-slate-200 gap-6 mb-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3.5 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Course Overview &amp; Competencies
              </button>
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`pb-3.5 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'curriculum'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Curriculum &amp; Syllabus
              </button>
            </div>

            {/* TAB: Overview */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Key Competencies &amp; Focus Areas</h3>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {course.skills && course.skills.map((skill, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 size={16} className="text-brand-600 shrink-0 mt-0.5" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Target Audience</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cybersecurity engineers, network administrators, SOC analysts, and partner technical specialists deploying or maintaining Reticen8 enterprise security infrastructure.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: Curriculum (Clean State - Ready for User's Course Design) */}
            {activeTab === 'curriculum' && (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center shadow-xs">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Course Syllabus Under Development
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
                  The syllabus, module design, and technical training materials for this course are currently being finalized. Once published, complete module breakdowns will be available here.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                  <AlertCircle size={14} className="text-slate-400" />
                  <span>Awaiting Course Design Configuration</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Certification Track
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {course.certificationCode}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{course.certificationTitle}</div>
                  <div className="text-[11px] text-slate-500">Official Certification Pathway</div>
                </div>
              </div>
              <Link
                to="/certifications"
                className="mt-4 block text-center text-xs font-bold text-brand-600 hover:underline"
              >
                View Certification Details →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
