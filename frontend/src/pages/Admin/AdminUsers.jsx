import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Mail, UserPlus, Trash2, X, AlertCircle } from 'lucide-react'
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

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  // No fallback data: if the API fails the page says so instead of showing fake users
  const { data, loading, error, reload } = useApi('/admin/users', { cacheResult: false })
  const users = data?.users || []
  const [roleFilter, setRoleFilter] = useState('All')

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [rowError, setRowError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const filteredUsers = roleFilter === 'All' ? users : users.filter((u) => u.role === roleFilter)

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Admin Overview</span>
          </Link>
          <div className="flex items-center gap-3">
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
              onClick={() => {
                setShowForm((s) => !s)
                setFormError('')
              }}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-action-600 hover:bg-action-700 transition-colors"
            >
              {showForm ? <X size={14} /> : <UserPlus size={14} />}
              <span>{showForm ? 'Cancel' : 'Add user'}</span>
            </button>
          </div>
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
          <form
            onSubmit={handleCreate}
            className="mb-6 p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs"
          >
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
              <p className="text-[11px] text-slate-400">The new user can sign in immediately with this password.</p>
            </div>
          </form>
        )}

        {loading && <PageSpinner />}
        {error && <ErrorState error={error} onRetry={reload} className="mb-8" />}

        <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs ${loading || error ? 'hidden' : ''}`}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Registered Academy Users</h2>
            <span className="text-xs text-slate-500 font-medium">{filteredUsers.length} accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role Category</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.map((u) => {
                  const isSelf = u.id === currentUser?.id
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">
                          {u.name}
                          {isSelf && <span className="ml-2 text-[10px] font-semibold text-slate-400">(you)</span>}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Mail size={12} />
                          <span>{u.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${roleBadge(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">{u.department || 'Academy'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                          <CheckCircle2 size={13} /> Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={isSelf || deletingId === u.id}
                          title={isSelf ? "You can't remove your own account" : 'Remove user'}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition-colors disabled:text-slate-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                        >
                          <Trash2 size={13} />
                          {deletingId === u.id ? 'Removing…' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
