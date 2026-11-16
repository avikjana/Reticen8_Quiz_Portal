import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, CheckCircle2, Mail, UserPlus, Trash2, X, AlertCircle,
  ChevronDown, ChevronRight, BookOpen, Search
} from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import useApi from '../../hooks/useApi'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { ROLE_CATEGORIES } from '../../config/roles'
import { ErrorState, PageSpinner } from '../../components/ui/DataState'

const roleBadge = (role) =>
  role === 'Administrator'
    ? 'bg-purple-100 text-purple-800 border-purple-200'
    : role === 'Partner'
    ? 'bg-blue-100 text-blue-800 border-blue-200'
    : 'bg-emerald-100 text-emerald-800 border-emerald-200'

const EMPTY_FORM = { name: '', email: '', password: '', role: 'Employee', department: '' }

function UserRow({ u, currentUser, onDelete, deletingId, onRemoveEnrollment }) {
  const [expanded, setExpanded] = useState(false)
  const isSelf = u.id === currentUser?.id
  const courses = u.enrolledCourses || []

  return (
    <>
      <tr className="hover:bg-slate-50/60 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              u.role === 'Administrator' ? 'bg-purple-100 text-purple-700' :
              u.role === 'Partner' ? 'bg-blue-100 text-blue-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              {u.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <div className="font-bold text-slate-900">
                {u.name}
                {isSelf && <span className="ml-2 text-[10px] font-semibold text-slate-400">(you)</span>}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Mail size={11} />
                <span>{u.email}</span>
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${roleBadge(u.role)}`}>
            {u.role}
          </span>
        </td>
        <td className="px-6 py-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-action-600 transition-colors"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <BookOpen size={13} />
            <span>{courses.length} course{courses.length !== 1 ? 's' : ''}</span>
          </button>
        </td>
        <td className="px-6 py-4">
          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
            <CheckCircle2 size={13} /> Active
          </span>
        </td>
        <td className="px-6 py-4 text-right">
          <button
            onClick={() => onDelete(u)}
            disabled={isSelf || deletingId === u.id}
            title={isSelf ? "You can't remove your own account" : 'Remove user'}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition-colors disabled:text-slate-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          >
            <Trash2 size={13} />
            {deletingId === u.id ? 'Removing…' : 'Remove'}
          </button>
        </td>
      </tr>
      <AnimatePresence>
        {expanded && courses.length > 0 && (
          <tr>
            <td colSpan={5} className="px-0 py-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mx-6 mb-4 mt-1 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Enrolled Courses for {u.name?.split(' ')[0]}
                    </span>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {courses.map((c) => (
                      <div key={c.enrollmentId} className="px-4 py-3 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-800 truncate">{c.courseTitle}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Enrolled {new Date(c.enrolledAt).toLocaleDateString()} •{' '}
                            <span className={c.status === 'completed' ? 'text-purple-600 font-bold' : 'text-emerald-600 font-bold'}>
                              {c.status === 'completed' ? 'Completed' : 'Active'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveEnrollment(c.enrollmentId, u.name, c.courseTitle)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-rose-600 hover:bg-rose-100 transition-colors shrink-0"
                        >
                          <X size={12} />
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  )
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const { data, loading, error, reload } = useApi('/admin/users', { cacheResult: false })
  const users = data?.users || []
  const [roleFilter, setRoleFilter] = useState('All')
  const [search, setSearch] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [rowError, setRowError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const filteredUsers = users
    .filter(u => roleFilter === 'All' || u.role === roleFilter)
    .filter(u => {
      if (!search) return true
      const q = search.toLowerCase()
      return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    })

  const field = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleCreate = async (e) => {
    e.preventDefault()
    if (saving) return
    setFormError('')
    setNotice('')
    setSaving(true)
    try {
      const res = await api.post('/admin/users', form)
      setNotice(`Account created for ${res.user?.name || form.email}.`)
      setForm(EMPTY_FORM)
      setShowForm(false)
      reload()
    } catch (err) {
      setFormError(err.message || 'Could not create the user.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (u) => {
    setRowError('')
    setNotice('')
    if (!window.confirm(`Remove ${u.name} (${u.email})? This cannot be undone.`)) return
    setDeletingId(u.id)
    try {
      await api.delete(`/admin/users/${encodeURIComponent(u.id)}`)
      setNotice(`${u.name} was removed.`)
      reload()
    } catch (err) {
      setRowError(err.message || 'Could not remove this user.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleRemoveEnrollment = async (enrollmentId, userName, courseTitle) => {
    setRowError('')
    setNotice('')
    if (!window.confirm(`Remove ${userName} from "${courseTitle}"?`)) return
    try {
      const res = await api.delete(`/admin/enrollments/${encodeURIComponent(enrollmentId)}`)
      setNotice(res.message || 'Enrollment removed.')
      reload()
    } catch (err) {
      setRowError(err.message || 'Could not remove enrollment.')
    }
  }

  const totalEnrolled = users.reduce((sum, u) => sum + (u.enrolledCourses?.length || 0), 0)

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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            {users.length} accounts • {totalEnrolled} active enrollment{totalEnrolled !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', count: users.length, color: 'bg-slate-100 text-slate-700' },
            { label: 'Administrators', count: users.filter(u => u.role === 'Administrator').length, color: 'bg-purple-100 text-purple-700' },
            { label: 'Employees', count: users.filter(u => u.role === 'Employee').length, color: 'bg-emerald-100 text-emerald-700' },
            { label: 'Partners', count: users.filter(u => u.role === 'Partner').length, color: 'bg-blue-100 text-blue-700' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-black mt-1 ${s.color.split(' ')[1]}`}>{s.count}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-action-600 focus:ring-2 focus:ring-action-600/20"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['All', 'Administrator', 'Employee', 'Partner'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  roleFilter === role
                    ? 'bg-action-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <button
            onClick={() => { setShowForm((s) => !s); setFormError('') }}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-action-600 hover:bg-action-700 transition-colors"
          >
            {showForm ? <X size={14} /> : <UserPlus size={14} />}
            <span>{showForm ? 'Cancel' : 'Add user'}</span>
          </button>
        </div>

        {notice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-medium" role="status">
            <CheckCircle2 size={15} className="flex-shrink-0" />
            <span>{notice}</span>
          </div>
        )}
        {rowError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-medium" role="alert">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{rowError}</span>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleCreate} className="mb-6 p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Create a new account</h2>
            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-medium" role="alert">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold text-slate-700">Full name</span>
                <input required value={form.name} onChange={field('name')} placeholder="Jane Doe"
                  className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-action-600 focus:ring-2 focus:ring-action-600/20" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-700">Email</span>
                <input required type="email" value={form.email} onChange={field('email')} placeholder="jane@company.com"
                  className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-action-600 focus:ring-2 focus:ring-action-600/20" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-700">Temporary password</span>
                <input required type="text" minLength={8} value={form.password} onChange={field('password')} placeholder="At least 8 chars, a letter & a number"
                  className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-action-600 focus:ring-2 focus:ring-action-600/20" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-700">Role</span>
                <select value={form.role} onChange={field('role')}
                  className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-action-600 focus:ring-2 focus:ring-action-600/20">
                  {ROLE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-slate-700">Department <span className="font-normal text-slate-400">(optional)</span></span>
                <input value={form.department} onChange={field('department')} placeholder="Security Operations"
                  className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-action-600 focus:ring-2 focus:ring-action-600/20" />
              </label>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button type="submit" disabled={saving}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-action-600 hover:bg-action-700 transition-colors disabled:opacity-60">
                <UserPlus size={14} />
                {saving ? 'Creating…' : 'Create account'}
              </button>
            </div>
          </form>
        )}

        {loading && <PageSpinner />}
        {error && <ErrorState error={error} onRetry={reload} className="mb-8" />}

        <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs ${loading || error ? 'hidden' : ''}`}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">All Registered Users</h2>
            <span className="text-xs text-slate-500 font-medium">{filteredUsers.length} account{filteredUsers.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Enrolled Courses</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.map((u) => (
                  <UserRow
                    key={u.id}
                    u={u}
                    currentUser={currentUser}
                    onDelete={handleDelete}
                    deletingId={deletingId}
                    onRemoveEnrollment={handleRemoveEnrollment}
                  />
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
