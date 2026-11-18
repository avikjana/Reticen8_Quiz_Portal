import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, BookOpen, ChevronDown, ChevronRight, Play, CheckCircle2,
  Clock, FileText, X, GraduationCap, LayoutList, Zap, Trophy, Star
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useApi from '../hooks/useApi'
import api from '../services/api'
import { usePageTitle } from '../hooks/usePageTitle'
import { ErrorState, NotFoundState, PageSpinner } from '../components/ui/DataState'

export default function LearningPlayer() {
  const { id } = useParams()
  const { data, loading, error } = useApi(
    id ? `/enrollments/learn/${encodeURIComponent(id)}` : null
  )

  const course = data?.course

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

  return <LearningView course={course} />
}

// --- Progress calculation ---
// Each module = 10% (complete all chapters in it)
// Every 2 completed modules = +10% bonus
// 6 modules: 60% base + 30% bonus (at 2,4,6) + 10% course-complete = 100%
function calcProgress(curriculum, completedChapters, chapterKey) {
  const moduleCount = curriculum.length

  const moduleCompletion = curriculum.map((mod, mIdx) => {
    const total = mod.chapters.length
    const done = mod.chapters.filter((_, cIdx) => completedChapters[chapterKey(mIdx, cIdx)]).length
    return { total, done, complete: total > 0 && done === total, percent: total > 0 ? done / total : 0 }
  })

  const completedModules = moduleCompletion.filter(m => m.complete).length

  // Base: 10% per module (proportional to chapters done within)
  const basePercent = moduleCompletion.reduce((sum, m) => sum + m.percent * 10, 0)

  // Bonus: +10% for every 2 fully completed modules
  const bonusCount = Math.floor(completedModules / 2)
  const bonusPercent = bonusCount * 10

  // Course complete bonus: +10% when ALL modules done
  const allDone = completedModules === moduleCount && moduleCount > 0
  const courseBonus = allDone ? 10 : 0

  const totalPercent = Math.min(100, Math.round(basePercent + bonusPercent + courseBonus))

  return { moduleCompletion, completedModules, bonusCount, basePercent, bonusPercent, courseBonus, totalPercent, allDone }
}

// --- Bonus celebration overlay ---
function BonusCelebration({ bonusType, onDone }) {
  const isBonus = bonusType === 'bonus'
  const isCourse = bonusType === 'course'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onDone}
    >
      <motion.div
        initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated rings */}
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            initial={{ scale: 0.5, opacity: 0.6 }}
            animate={{ scale: 2.5 + i * 0.5, opacity: 0 }}
            transition={{ duration: 1.5, delay: i * 0.15, repeat: 1 }}
            className={`absolute inset-0 rounded-full border-2 ${
              isCourse ? 'border-yellow-400' : isBonus ? 'border-purple-400' : 'border-emerald-400'
            }`}
          />
        ))}

        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className={`relative w-72 sm:w-80 rounded-3xl p-8 text-center shadow-2xl border ${
            isCourse
              ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'
              : isBonus
              ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'
              : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
          }`}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 5, -5, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
              isCourse
                ? 'bg-yellow-100 text-yellow-600'
                : isBonus
                ? 'bg-purple-100 text-purple-600'
                : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            {isCourse ? <Trophy size={32} /> : isBonus ? <Zap size={32} /> : <Star size={32} />}
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-black text-slate-900 mb-2"
          >
            {isCourse ? 'Course Complete!' : isBonus ? 'Bonus Unlocked!' : 'Module Complete!'}
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black mb-3 ${
              isCourse
                ? 'bg-yellow-100 text-yellow-700'
                : isBonus
                ? 'bg-purple-100 text-purple-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            <span>+{isCourse ? '10' : '10'}%</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-slate-500 mb-5"
          >
            {isCourse
              ? 'Congratulations! You completed all modules and earned the final bonus!'
              : isBonus
              ? 'You completed 2 modules — bonus points added to your progress!'
              : 'Great work! All chapters in this module are done.'}
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={onDone}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-colors ${
              isCourse
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : isBonus
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isCourse ? 'Celebrate!' : 'Continue Learning'}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// --- Feedback / Rating modal ---
function FeedbackModal({ courseId, courseTitle, onClose }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [recommend, setRecommend] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return
    setSubmitting(true)
    try {
      await api.post('/enrollments/feedback', { courseId, rating, comment, recommend })
      setSubmitted(true)
      setTimeout(onClose, 2000)
    } catch {
      setSubmitting(false)
    }
  }

  const stars = [1, 2, 3, 4, 5]
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-10 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 size={32} />
            </motion.div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Thank You!</h3>
            <p className="text-sm text-slate-500">Your feedback helps us improve the course experience.</p>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
              <div className="flex items-center justify-between mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                  Course Feedback
                </span>
                <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <h3 className="text-lg font-black text-slate-900">{courseTitle}</h3>
              <p className="text-xs text-slate-500 mt-1">How was your learning experience?</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Star rating */}
              <div className="text-center">
                <p className="text-xs font-bold text-slate-700 mb-3">Rate this course</p>
                <div className="flex items-center justify-center gap-2">
                  {stars.map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}
                      className="focus:outline-none"
                    >
                      <svg
                        width={36}
                        height={36}
                        viewBox="0 0 24 24"
                        fill={(hoverRating || rating) >= s ? '#f59e0b' : 'none'}
                        stroke={(hoverRating || rating) >= s ? '#f59e0b' : '#cbd5e1'}
                        strokeWidth={1.5}
                        className="transition-colors duration-150"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </motion.button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  {(hoverRating || rating) > 0 && (
                    <motion.p
                      key={hoverRating || rating}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-bold text-amber-600 mt-2"
                    >
                      {labels[hoverRating || rating]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Comment */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Share your thoughts <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="What did you like? What could be improved?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm resize-none focus:outline-none focus:border-action-600 focus:ring-2 focus:ring-action-600/20"
                />
              </div>

              {/* Recommend */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Would you recommend this course?</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRecommend(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                      recommend
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setRecommend(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                      !recommend
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={rating === 0 || submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-action-600 hover:bg-action-700 text-white text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting…' : 'Submit Feedback'}
                </motion.button>
                <button
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

function LearningView({ course }) {
  usePageTitle(`Learn: ${course.title}`)

  const curriculum = course.curriculum || []
  const [activeModule, setActiveModule] = useState(0)
  const [activeChapter, setActiveChapter] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [celebration, setCelebration] = useState(null) // 'module' | 'bonus' | 'course' | null
  const [showFeedback, setShowFeedback] = useState(false)
  const [completedChapters, setCompletedChapters] = useState(() => {
    try {
      const saved = sessionStorage.getItem(`progress-${course.id}`)
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })

  const chapterKey = (mIdx, cIdx) => `${mIdx}-${cIdx}`
  const progress = calcProgress(curriculum, completedChapters, chapterKey)

  const prevCompletedModulesRef = useRef(progress.completedModules)

  useEffect(() => {
    try {
      sessionStorage.setItem(`progress-${course.id}`, JSON.stringify(completedChapters))
    } catch { /* ignore */ }
  }, [completedChapters, course.id])

  const currentModule = curriculum[activeModule]
  const currentChapterRaw = currentModule?.chapters?.[activeChapter]
  const currentChapter = typeof currentChapterRaw === 'object' ? currentChapterRaw.title : currentChapterRaw
  const currentChapterContent = typeof currentChapterRaw === 'object' ? currentChapterRaw.content : ''

  const markComplete = () => {
    const key = chapterKey(activeModule, activeChapter)
    const next = { ...completedChapters, [key]: true }
    setCompletedChapters(next)

    // Check if this completed a module
    const newProgress = calcProgress(curriculum, next, chapterKey)
    const prevCompleted = prevCompletedModulesRef.current

    if (newProgress.completedModules > prevCompleted) {
      prevCompletedModulesRef.current = newProgress.completedModules

      if (newProgress.allDone) {
        setCelebration('course')
      } else if (newProgress.completedModules % 2 === 0 && newProgress.completedModules > 0) {
        setCelebration('bonus')
      } else {
        setCelebration('module')
      }
    } else {
      // Auto-advance to next chapter
      advanceChapter()
    }
  }

  const advanceChapter = () => {
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
    setSidebarOpen(false)
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
      {/* Celebration overlay */}
      <AnimatePresence>
        {celebration && (
          <BonusCelebration
            bonusType={celebration}
            onDone={() => {
              const wasCourse = celebration === 'course'
              setCelebration(null)
              if (wasCourse) {
                setShowFeedback(true)
              } else {
                advanceChapter()
              }
            }}
          />
        )}
        {showFeedback && (
          <FeedbackModal
            courseId={course.id}
            courseTitle={course.title}
            onClose={() => setShowFeedback(false)}
          />
        )}
      </AnimatePresence>

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

          {/* Progress button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              sidebarOpen
                ? 'bg-white/15 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {sidebarOpen ? <X size={15} /> : <LayoutList size={15} />}
            <span className="hidden sm:inline">{sidebarOpen ? 'Close' : 'Progress'}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              {progress.totalPercent}%
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-[57px] left-0 bottom-0 w-[300px] bg-white border-r border-slate-200 overflow-y-auto z-30 shadow-xl"
            >
              <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <span className="text-xs font-bold text-slate-800">Course Progress</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Score breakdown */}
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap size={14} className="text-brand-600" />
                  <span className="text-[11px] font-bold text-slate-700">Overall: {progress.totalPercent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-3">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"
                    initial={false}
                    animate={{ width: `${progress.totalPercent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>

                {/* Score breakdown chips */}
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Star size={10} className="text-emerald-500" />
                      Modules ({progress.completedModules}/{curriculum.length})
                    </span>
                    <span className="font-bold text-emerald-700">{Math.round(progress.basePercent)}%<span className="text-slate-400 font-normal"> / 60%</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Zap size={10} className="text-purple-500" />
                      Bonus ({progress.bonusCount}x)
                    </span>
                    <span className="font-bold text-purple-700">{progress.bonusPercent}%<span className="text-slate-400 font-normal"> / 30%</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Trophy size={10} className="text-yellow-500" />
                      Course Complete
                    </span>
                    <span className="font-bold text-yellow-700">{progress.courseBonus}%<span className="text-slate-400 font-normal"> / 10%</span></span>
                  </div>
                </div>

                {/* Bonus milestones */}
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Bonus Milestones</p>
                  <div className="flex gap-2">
                    {Array.from({ length: Math.ceil(curriculum.length / 2) }, (_, i) => {
                      const needed = (i + 1) * 2
                      const unlocked = progress.completedModules >= needed
                      return (
                        <div
                          key={i}
                          className={`flex-1 py-1.5 rounded-lg text-center text-[9px] font-bold border transition-all ${
                            unlocked
                              ? 'bg-purple-100 text-purple-700 border-purple-200'
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}
                        >
                          {unlocked ? <Zap size={10} className="inline mr-0.5" /> : null}
                          {needed}M +10%
                        </div>
                      )
                    })}
                  </div>
                </div>
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
                    moduleProgress={progress.moduleCompletion[mIdx]}
                  />
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-20"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Main content */}
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
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    {currentModule?.title}
                  </span>
                  {completedChapters[chapterKey(activeModule, activeChapter)] && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 size={10} />
                      Completed
                    </span>
                  )}
                  {/* Module progress chip */}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                    +{Math.round(progress.moduleCompletion[activeModule]?.percent * 10)}% earned
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {currentChapter}
                </h2>
              </div>

              {/* Chapter content area */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
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

                    {currentChapterContent ? (
                      <div className="text-sm text-slate-700 leading-relaxed space-y-4">
                        {currentChapterContent.split('\n\n').map((block, i) => {
                          if (block.startsWith('> ')) {
                            const text = block.replace(/^> \*\*(.+?):\*\*\s*/, '').trim()
                            const label = block.match(/^> \*\*(.+?):\*\*/)?.[1]
                            return (
                              <div key={i} className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                                {label && <span className="font-bold">{label}: </span>}
                                {text}
                              </div>
                            )
                          }
                          return (
                            <p key={i} className="m-0" dangerouslySetInnerHTML={{
                              __html: block
                                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.+?)\*/g, '<em>$1</em>')
                                .replace(/\n/g, '<br />')
                            }} />
                          )
                        })}
                      </div>
                    ) : (
                      <>
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
                              <span>Understand the core principles of {currentChapter?.toLowerCase()}</span>
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
                      </>
                    )}

                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2 mt-6">
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
                    {/* Progress toggle */}
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <LayoutList size={14} />
                      <span>{progress.totalPercent}%</span>
                    </button>

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
                        onClick={advanceChapter}
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

              {/* Certification info */}
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

function ModuleSidebarItem({ mod, mIdx, activeModule, activeChapter, completedChapters, chapterKey, onSelect, moduleProgress }) {
  const isActive = mIdx === activeModule
  const [userExpanded, setUserExpanded] = useState(isActive)
  const expanded = isActive || userExpanded

  const completedInModule = moduleProgress?.done || 0
  const allDone = moduleProgress?.complete || false

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
          {allDone ? <CheckCircle2 size={13} /> : String(mIdx + 1).padStart(2, '0')}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold truncate ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
            {mod.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${allDone ? 'bg-emerald-500' : 'bg-action-600'}`}
                initial={false}
                animate={{ width: `${(moduleProgress?.percent || 0) * 100}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-400 font-bold shrink-0">
              {completedInModule}/{mod.chapters.length}
            </span>
          </div>
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
                    <span className="truncate">{typeof chapter === 'object' ? chapter.title : chapter}</span>
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
