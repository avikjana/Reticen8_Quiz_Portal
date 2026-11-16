import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Clock, Star, Award, ChevronRight, CheckCircle2,
  AlertCircle, Sparkles, ChevronDown, FileText, Play, Loader2, PartyPopper
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useApi from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { ErrorState, NotFoundState, PageSpinner } from '../components/ui/DataState'
import api from '../services/api'

// Loads the course from the API, then renders it. Unknown IDs get a proper
// "not found" page instead of silently showing a different course.
export default function CourseDetail() {
  const { id } = useParams()
  const { data: course, loading, error, reload } = useApi(`/courses/${encodeURIComponent(id)}`)

  if (course) return <CourseDetailView course={course} />

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

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
  const { user } = useAuth()
  const { data: enrollmentCheck, reload: recheckEnrollment } = useApi(
    user ? `/enrollments/check/${encodeURIComponent(course.id)}` : null
  )
  const [enrolling, setEnrolling] = useState(false)
  const [enrollMsg, setEnrollMsg] = useState('')
  const [justEnrolled, setJustEnrolled] = useState(false)

  const isEnrolled = enrollmentCheck?.enrolled === true

  const handleEnroll = async () => {
    setEnrolling(true)
    setEnrollMsg('')
    setJustEnrolled(false)
    try {
      const res = await api.post('/enrollments', { courseId: course.id })
      setEnrollMsg(res.message || 'Enrolled successfully!')
      setJustEnrolled(true)
      recheckEnrollment()
      setTimeout(() => setJustEnrolled(false), 3000)
    } catch (err) {
      setEnrollMsg(err.message || 'Failed to enroll.')
    } finally {
      setEnrolling(false)
    }
  }

  const handleUnenroll = async () => {
    setEnrolling(true)
    setEnrollMsg('')
    try {
      const res = await api.delete(`/enrollments/${encodeURIComponent(course.id)}`)
      setEnrollMsg(res.message || 'Unenrolled successfully.')
      recheckEnrollment()
    } catch (err) {
      setEnrollMsg(err.message || 'Failed to unenroll.')
    } finally {
      setEnrolling(false)
    }
  }

  usePageTitle(course.title)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

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
                  <span>{course.duration && course.duration !== 'TBD' ? course.duration : 'Self-Paced'}</span>
                </div>
                {course.modulesCount > 0 && (
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={16} />
                    <span>{course.modulesCount} Modules · {course.lessonsCount} Chapters</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Award size={16} />
                  <span>Official Reticen8 Training</span>
                </div>
              </div>
            </div>

            {/* Right Action Card */}
            <div className="lg:col-span-4">
              <motion.div
                className={`bg-white rounded-2xl p-6 text-slate-900 border shadow-xl overflow-hidden relative ${
                  justEnrolled ? 'border-emerald-300' : 'border-slate-200'
                }`}
                animate={justEnrolled ? { scale: [1, 1.02, 1], borderColor: ['#d1d5db', '#6ee7b7', '#d1d5db'] } : {}}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {/* Success celebration overlay */}
                <AnimatePresence>
                  {justEnrolled && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 pointer-events-none overflow-hidden"
                    >
                      {/* Animated rings */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0.4 }}
                        animate={{ scale: 4, opacity: 0 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-emerald-400"
                      />
                      <motion.div
                        initial={{ scale: 0, opacity: 0.3 }}
                        animate={{ scale: 4, opacity: 0 }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-emerald-300"
                      />
                      {/* Shimmer */}
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/50 to-transparent skew-x-12"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {justEnrolled ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-center py-4 relative"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                        className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3"
                      >
                        <PartyPopper size={28} />
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg font-black text-slate-900"
                      >
                        You're In!
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs text-slate-500 mt-1"
                      >
                        Successfully enrolled. Start learning now!
                      </motion.p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Course Enrollment
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900 mb-4">
                        {isEnrolled ? 'You\'re Enrolled' : 'Complimentary Access'}
                      </div>
                      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                        {isEnrolled
                          ? 'You have access to this course. Explore the curriculum and start learning.'
                          : 'Available for registered Reticen8 Academy students, authorized engineers, and enterprise partners.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Messages */}
                <AnimatePresence>
                  {enrollMsg && !justEnrolled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className={`mb-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                        enrollMsg.includes('success') || enrollMsg.includes('Successfully')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {enrollMsg.includes('success') || enrollMsg.includes('Successfully')
                          ? <CheckCircle2 size={14} />
                          : <AlertCircle size={14} />}
                        <span>{enrollMsg}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Buttons */}
                <div className="space-y-3 relative">
                  <AnimatePresence mode="wait">
                    {isEnrolled && !justEnrolled ? (
                      <motion.button
                        key="unenroll"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={handleUnenroll}
                        disabled={enrolling}
                        className="w-full py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        {enrolling && <Loader2 size={16} className="animate-spin" />}
                        {enrolling ? 'Processing...' : 'Unenroll from Course'}
                      </motion.button>
                    ) : !justEnrolled ? (
                      <motion.button
                        key="enroll"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="w-full py-3 px-4 bg-action-600 hover:bg-action-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {enrolling ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Enrolling...</span>
                          </>
                        ) : (
                          <>
                            <span>Enroll in Course</span>
                            <motion.span
                              animate={{ x: [0, 4, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                            >
                              →
                            </motion.span>
                          </>
                        )}
                      </motion.button>
                    ) : null}
                  </AnimatePresence>
                  <Link
                    to="/courses"
                    className="block text-center w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                  >
                    ← Browse Other Courses
                  </Link>
                </div>
              </motion.div>
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

            {/* TAB: Curriculum */}
            {activeTab === 'curriculum' && (
              course.curriculum && course.curriculum.length > 0 ? (
                <CurriculumView course={course} />
              ) : (
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
              )
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

function CurriculumView({ course }) {
  const [expandedModule, setExpandedModule] = useState(null)
  const totalChapters = course.curriculum.reduce((sum, m) => sum + m.chapters.length, 0)

  const toggle = (idx) => setExpandedModule(expandedModule === idx ? null : idx)

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Course Curriculum</h3>
            {course.courseCode && (
              <p className="text-xs text-slate-500 mt-0.5">
                {course.courseCode} · {course.format || 'Self-paced'} · {course.duration}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <BookOpen size={14} className="text-brand-600" />
              {course.curriculum.length} Modules
            </span>
            <span className="flex items-center gap-1.5">
              <FileText size={14} className="text-brand-600" />
              {totalChapters} Chapters
            </span>
            {course.duration && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-brand-600" />
                {course.duration}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Module accordion */}
      <div className="space-y-3">
        {course.curriculum.map((mod, idx) => {
          const isOpen = expandedModule === idx
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-shadow hover:shadow-sm"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {String(mod.module).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{mod.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {mod.chapters.length} chapter{mod.chapters.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0">
                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    {mod.chapters.map((chapter, cIdx) => (
                      <div
                        key={cIdx}
                        className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                          <Play size={10} className="ml-0.5" />
                        </div>
                        <span className="text-xs text-slate-700 font-medium">{chapter}</span>
                        <span className="ml-auto text-[10px] text-slate-400 font-mono shrink-0">
                          {String(mod.module).padStart(2, '0')}.{String(cIdx + 1).padStart(2, '0')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
