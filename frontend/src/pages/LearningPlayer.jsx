import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, BookOpen, ChevronDown, ChevronRight, Play, CheckCircle2,
  Clock, FileText, Menu, X, GraduationCap
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useApi from '../hooks/useApi'
import { usePageTitle } from '../hooks/usePageTitle'
import { ErrorState, NotFoundState, PageSpinner } from '../components/ui/DataState'

export default function LearningPlayer() {
  const { id } = useParams()
  const { data, loading, error } = useApi(
    id ? `/enrollments/learn/${encodeURIComponent(id)}` : null
  )

  const course = data?.course
  const enrollment = data?.enrollment

  if (!id) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <NotFoundState title="No course selected" message="Choose a course to start learning." backTo="/courses" backLabel="Browse courses" />
        </main>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1"><PageSpinner /></main>
        <Footer />
      </div>
    )
  }

  if (error?.status === 403) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <NotFoundState
            title="Enrollment Required"
            message="You need to enroll in this course before accessing the learning material."
            backTo={`/courses/${id}`}
            backLabel="Go to course page to enroll"
          />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-4 py-16">
          <ErrorState error={error} title="Couldn't load course material" />
        </main>
        <Footer />
      </div>
    )
  }

  return <LearningView course={course} enrollment={enrollment} />
}

function LearningView({ course }) {
  usePageTitle(`Learn: ${course.title}`)

  const curriculum = course.curriculum || []
  const [activeModule, setActiveModule] = useState(0)
  const [activeChapter, setActiveChapter] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [completedChapters, setCompletedChapters] = useState(() => {
    try {
      const saved = sessionStorage.getItem(`progress-${course.id}`)
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })

  // Save progress to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(`progress-${course.id}`, JSON.stringify(completedChapters))
    } catch { /* ignore */ }
  }, [completedChapters, course.id])

  const currentModule = curriculum[activeModule]
  const currentChapter = currentModule?.chapters?.[activeChapter]
  const totalChapters = curriculum.reduce((s, m) => s + m.chapters.length, 0)
  const completedCount = Object.keys(completedChapters).length
  const progressPercent = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0

  const chapterKey = (mIdx, cIdx) => `${mIdx}-${cIdx}`

  const markComplete = () => {
    const key = chapterKey(activeModule, activeChapter)
    setCompletedChapters((prev) => ({ ...prev, [key]: true }))
    // Auto-advance to next chapter
    if (activeChapter < currentModule.chapters.length - 1) {
      setActiveChapter(activeChapter + 1)
    } else if (activeModule < curriculum.length - 1) {
      setActiveModule(activeModule + 1)
      setActiveChapter(0)
    }
  }

  const goToChapter = (mIdx, cIdx) => {
    setActiveModule(mIdx)
    setActiveChapter(cIdx)
    setSidebarOpen(false) // close on mobile after selecting
  }

  if (curriculum.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-16 text-center">
          <BookOpen size={40} className="text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Course material coming soon</h2>
          <p className="text-sm text-slate-500 mb-6">The curriculum for this course is still being developed.</p>
          <Link to={`/courses/${course.id}`} className="text-sm font-bold text-brand-600 hover:underline">← Back to course</Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="theme-fixed bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-3 px-4 py-3 max-w-[1600px] mx-auto">
          <Link
            to={`/courses/${course.id}`}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-medium transition-colors shrink-0"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Course</span>
          </Link>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold truncate">{course.title}</h1>
            <p className="text-[11px] text-slate-400 truncate">
              Module {activeModule + 1}: {currentModule?.title}
            </p>
          </div>

          {/* Progress */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-[10px] text-slate-400">{completedCount}/{totalChapters} chapters</p>
              <p className="text-xs font-bold text-emerald-400">{progressPercent}% complete</p>
            </div>
            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                initial={false}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Sidebar — Module & Chapter Navigation */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed lg:sticky top-[57px] left-0 bottom-0 w-[300px] bg-white border-r border-slate-200 overflow-y-auto z-30 shadow-xl lg:shadow-none"
            >
              {/* Course progress card */}
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap size={14} className="text-brand-600" />
                  <span className="text-[11px] font-bold text-slate-700">Course Progress</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-600 rounded-full"
                    initial={false}
                    animate={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">
                  {completedCount} of {totalChapters} chapters completed ({progressPercent}%)
                </p>
              </div>

              {/* Module list */}
              <nav className="p-2">
                {curriculum.map((mod, mIdx) => (
                  <ModuleSidebarItem
                    key={mIdx}
                    mod={mod}
                    mIdx={mIdx}
                    activeModule={activeModule}
                    activeChapter={activeChapter}
                    completedChapters={completedChapters}
                    chapterKey={chapterKey}
                    onSelect={goToChapter}
                  />
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeModule}-${activeChapter}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl mx-auto px-4 sm:px-8 py-8"
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mb-6">
                <span>Module {String(activeModule + 1).padStart(2, '0')}</span>
                <ChevronRight size={12} />
                <span className="text-slate-600">Chapter {String(activeChapter + 1).padStart(2, '0')}</span>
              </div>

              {/* Chapter header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    {currentModule?.title}
                  </span>
                  {completedChapters[chapterKey(activeModule, activeChapter)] && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 size={10} />
                      Completed
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {currentChapter}
                </h2>
              </div>

              {/* Chapter content area */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                {/* Placeholder content — will be replaced with real material */}
                <div className="p-8 sm:p-10">
                  <div className="prose prose-slate max-w-none">
                    <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
                      <FileText size={20} className="text-blue-600 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-blue-900 m-0">Learning Material</p>
                        <p className="text-xs text-blue-700 m-0 mt-0.5">
                          {currentModule?.title} — Chapter {activeChapter + 1} of {currentModule?.chapters.length}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-3">{currentChapter}</h3>

                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      This chapter covers the concepts and practical knowledge of <strong>{currentChapter}</strong> as
                      part of the <em>{currentModule?.title}</em> module. Study the material below, then mark it
                      complete to track your progress.
                    </p>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                      <h4 className="text-sm font-bold text-slate-800 mb-3">Key Learning Objectives</h4>
                      <ul className="space-y-2 text-sm text-slate-600 list-none p-0 m-0">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-brand-600 shrink-0 mt-0.5" />
                          <span>Understand the core principles of {currentChapter.toLowerCase()}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-brand-600 shrink-0 mt-0.5" />
                          <span>Apply theoretical knowledge to real-world enterprise scenarios</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-brand-600 shrink-0 mt-0.5" />
                          <span>Identify security implications and best practices</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1"><Clock size={12} /> Estimated: 20–30 min</span>
                      <span className="flex items-center gap-1"><BookOpen size={12} /> Reading + Interactive</span>
                    </div>
                  </div>
                </div>

                {/* Bottom action bar */}
                <div className="px-8 sm:px-10 py-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      if (activeChapter > 0) {
                        setActiveChapter(activeChapter - 1)
                      } else if (activeModule > 0) {
                        const prevMod = curriculum[activeModule - 1]
                        setActiveModule(activeModule - 1)
                        setActiveChapter(prevMod.chapters.length - 1)
                      }
                    }}
                    disabled={activeModule === 0 && activeChapter === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={14} />
                    Previous
                  </button>

                  <div className="flex items-center gap-3">
                    {!completedChapters[chapterKey(activeModule, activeChapter)] ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={markComplete}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        <CheckCircle2 size={14} />
                        Mark as Complete
                      </motion.button>
                    ) : (
                      <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={() => {
                          // Go to next
                          if (activeChapter < currentModule.chapters.length - 1) {
                            setActiveChapter(activeChapter + 1)
                          } else if (activeModule < curriculum.length - 1) {
                            setActiveModule(activeModule + 1)
                            setActiveChapter(0)
                          }
                        }}
                        disabled={activeModule === curriculum.length - 1 && activeChapter === currentModule.chapters.length - 1}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-action-600 hover:bg-action-700 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-40"
                      >
                        Next Chapter
                        <ChevronRight size={14} />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Course info at bottom */}
              {course.certificationCode && (
                <div className="mt-8 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {course.certificationCode}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900">{course.certificationTitle}</p>
                    <p className="text-[11px] text-slate-500">Complete all modules to prepare for this certification</p>
                  </div>
                  <Link to="/certifications" className="text-xs font-bold text-brand-600 hover:underline shrink-0">
                    View Cert →
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

// Collapsible sidebar module item
function ModuleSidebarItem({ mod, mIdx, activeModule, activeChapter, completedChapters, chapterKey, onSelect }) {
  const isActive = mIdx === activeModule
  const [userExpanded, setUserExpanded] = useState(isActive)
  const expanded = isActive || userExpanded

  const completedInModule = mod.chapters.filter((_, cIdx) => completedChapters[chapterKey(mIdx, cIdx)]).length
  const allDone = completedInModule === mod.chapters.length

  return (
    <div className="mb-1">
      <button
        onClick={() => setUserExpanded(!expanded)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
          isActive ? 'bg-slate-100' : 'hover:bg-slate-50'
        }`}
      >
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
          allDone
            ? 'bg-emerald-100 text-emerald-700'
            : isActive
            ? 'bg-action-600 text-white'
            : 'bg-slate-100 text-slate-500'
        }`}>
          {allDone ? <CheckCircle2 size={13} /> : String(mod.module).padStart(2, '0')}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold truncate ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
            {mod.title}
          </p>
          <p className="text-[10px] text-slate-400">
            {completedInModule}/{mod.chapters.length} chapters
          </p>
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-4 pr-1"
          >
            {mod.chapters.map((chapter, cIdx) => {
              const isCurrent = mIdx === activeModule && cIdx === activeChapter
              const isDone = completedChapters[chapterKey(mIdx, cIdx)]
              return (
                <li key={cIdx}>
                  <button
                    onClick={() => onSelect(mIdx, cIdx)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[11px] transition-colors ${
                      isCurrent
                        ? 'bg-action-600/10 text-action-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="shrink-0">
                      {isDone ? (
                        <CheckCircle2 size={13} className="text-emerald-500" />
                      ) : isCurrent ? (
                        <Play size={11} className="text-action-600 ml-0.5" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 ml-px" />
                      )}
                    </div>
                    <span className="truncate">{chapter}</span>
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
