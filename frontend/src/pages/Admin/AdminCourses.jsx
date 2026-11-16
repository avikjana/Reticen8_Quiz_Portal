import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Plus, Trash2, X, AlertCircle, CheckCircle2,
  ChevronDown, ChevronRight, Users, BookOpen, Clock, Search
} from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import useApi from '../../hooks/useApi'
import api from '../../services/api'
import { ErrorState, PageSpinner } from '../../components/ui/DataState'

const EMPTY_FORM = {
  title: '', shortDesc: '', description: '', difficulty: 'Beginner',
  category: 'Network Security', duration: '', certificationCode: '',
}

function CourseRow({ course, onDelete, deleting, onRemoveEnrollment }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                {course.category}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                course.difficultyColor === 'green' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                course.difficultyColor === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                course.difficultyColor === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-purple-50 text-purple-700 border-purple-200'
              }`}>
                {course.difficulty}
              </span>
              {course.certificationCode && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {course.certificationCode}
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900">{course.title}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xl">{course.shortDesc}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-slate-500">
              {course.modulesCount > 0 && (
                <span className="flex items-center gap-1"><BookOpen size={12} /> {course.modulesCount} Modules</span>
              )}
              {course.lessonsCount > 0 && (
                <span className="flex items-center gap-1">{course.lessonsCount} Chapters</span>
              )}
              {course.duration && course.duration !== 'TBD' && (
                <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                course.enrolledCount > 0
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Users size={13} />
              <span>{course.enrolledCount} enrolled</span>
              {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>
            <Link
              to={`/courses/${course.id}`}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              View
            </Link>
            <button
              onClick={() => onDelete(course)}
              disabled={deleting}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors disabled:opacity-50"
            >
              <Trash2 size={13} />
              {deleting ? 'Removing…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-200 bg-slate-50">
              <div className="px-5 sm:px-6 py-3 border-b border-slate-200 bg-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Enrolled Users ({course.enrolledCount})
                </span>
              </div>
              {course.enrolledUsers?.length === 0 ? (
                <div className="px-6 py-6 text-center text-xs text-slate-400">
                  No users enrolled in this course yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {course.enrolledUsers?.map((eu) => (
                    <div key={eu.enrollmentId} className="px-5 sm:px-6 py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          eu.userRole === 'Administrator' ? 'bg-purple-100 text-purple-700' :
                          eu.userRole === 'Partner' ? 'bg-blue-100 text-blue-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {eu.userName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 truncate">{eu.userName}</div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {eu.userEmail} • {eu.userRole} • Enrolled {new Date(eu.enrolledAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          eu.status === 'completed' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {eu.status === 'completed' ? 'Completed' : 'Active'}
                        </span>
                        <button
                          onClick={() => onRemoveEnrollment(eu.enrollmentId, eu.userName, course.title)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-rose-600 hover:bg-rose-100 transition-colors"
                        >
                          <X size={11} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminCourses() {
  const { data, loading, error, reload } = useApi('/admin/courses', { cacheResult: false })
  const courses = data?.courses || []

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [actionError, setActionError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [search, setSearch] = useState('')

  const filteredCourses = courses.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return c.title?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q)
  })

  const field = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleCreate = async (e) => {
    e.preventDefault()
    if (saving) return
    setFormError('')
    setNotice('')
    setSaving(true)
    try {
      const res = await api.post('/admin/courses', form)
      setNotice(res.message || 'Course created.')
      setForm(EMPTY_FORM)
      setShowForm(false)
      reload()
    } catch (err) {
      setFormError(err.message || 'Could not create the course.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (course) => {
    setActionError('')
    setNotice('')
    if (!window.confirm(`Delete "${course.title}"? This will remove the course and all its enrollments.`)) return
    setDeletingId(course.id)
    try {
      const res = await api.delete(`/admin/courses/${encodeURIComponent(course.id)}`)
      setNotice(res.message || 'Course deleted.')
      reload()
    } catch (err) {
      setActionError(err.message || 'Could not delete course.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleRemoveEnrollment = async (enrollmentId, userName, courseTitle) => {
    setActionError('')
    setNotice('')
    if (!window.confirm(`Remove ${userName} from "${courseTitle}"?`)) return
    try {
      const res = await api.delete(`/admin/enrollments/${encodeURIComponent(enrollmentId)}`)
      setNotice(res.message || 'Enrollment removed.')
      reload()
    } catch (err) {
      setActionError(err.message || 'Could not remove enrollment.')
    }
  }

  const totalEnrolled = courses.reduce((sum, c) => sum + c.enrolledCount, 0)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Admin Overview</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Course Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            {courses.length} course{courses.length !== 1 ? 's' : ''} • {totalEnrolled} total enrollment{totalEnrolled !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Courses</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{courses.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Enrollments</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{totalEnrolled}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg per Course</p>
            <p className="text-2xl font-black text-blue-700 mt-1">
              {courses.length > 0 ? (totalEnrolled / courses.length).toFixed(1) : '0'}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-action-600 focus:ring-2 focus:ring-action-600/20"
            />
          </div>
          <button
            onClick={() => { setShowForm((s) => !s); setFormError('') }}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-action-600 hover:bg-action-700 transition-colors"
          >
            {showForm ? <X size={14} /> : <Plus size={14} />}
            <span>{showForm ? 'Cancel' : 'Add Course'}</span>
          </button>
        </div>

        {notice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-medium" role="status">
            <CheckCircle2 size={15} className="flex-shrink-0" />
            <span>{notice}</span>
          </div>
        )}
        {actionError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-medium" role="alert">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Add Course Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleCreate}
              className="mb-6 p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
            >
              <h2 className="text-sm font-bold text-slate-900 mb-4">Add a New Course</h2>
              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-medium" role="alert">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-slate-700">Course Title</span>
                  <input required value={form.title} onChange={field('title')} placeholder="e.g. Advanced Threat Detection"
                    className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-action-600 focus:ring-2 focus:ring-action-600/20" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-slate-700">Short Description</span>
                  <input value={form.shortDesc} onChange={field('shortDesc')} placeholder="One-liner about the course"
                    className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-action-600 focus:ring-2 focus:ring-action-600/20" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-slate-700">Full Description</span>
                  <textarea value={form.description} onChange={field('description')} rows={3} placeholder="Detailed course description…"
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-action-600 focus:ring-2 focus:ring-action-600/20 resize-none" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">Difficulty</span>
                  <select value={form.difficulty} onChange={field('difficulty')}
                    className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-action-600 focus:ring-2 focus:ring-action-600/20">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">Category</span>
                  <input value={form.category} onChange={field('category')} placeholder="Network Security"
                    className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-action-600 focus:ring-2 focus:ring-action-600/20" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">Duration</span>
                  <input value={form.duration} onChange={field('duration')} placeholder="e.g. 40–50 Hours"
                    className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-action-600 focus:ring-2 focus:ring-action-600/20" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">Certification Code <span className="font-normal text-slate-400">(optional)</span></span>
                  <input value={form.certificationCode} onChange={field('certificationCode')} placeholder="e.g. RCFA"
                    className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-action-600 focus:ring-2 focus:ring-action-600/20" />
                </label>
              </div>
              <div className="mt-5">
                <button type="submit" disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-action-600 hover:bg-action-700 transition-colors disabled:opacity-60">
                  <Plus size={14} />
                  {saving ? 'Creating…' : 'Create Course'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {loading && <PageSpinner />}
        {error && <ErrorState error={error} onRetry={reload} className="mb-8" />}

        {/* Course List */}
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <CourseRow
              key={course.id}
              course={course}
              onDelete={handleDelete}
              deleting={deletingId === course.id}
              onRemoveEnrollment={handleRemoveEnrollment}
            />
          ))}
          {!loading && !error && filteredCourses.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center shadow-xs">
              <BookOpen size={24} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">No courses found.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
