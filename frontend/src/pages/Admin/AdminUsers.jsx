import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import useApi from '../../hooks/useApi'
import { ErrorState, PageSpinner } from '../../components/ui/DataState'

export default function AdminUsers() {
  // No fallback data: if the API fails the page says so instead of showing fake users
  const { data, loading, error, reload } = useApi('/admin/users', { cacheResult: false })
  const users = data?.users || []
  const [roleFilter, setRoleFilter] = useState('All')

  const filteredUsers = roleFilter === 'All'
    ? users
    : users.filter((u) => u.role === roleFilter)

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
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
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
        </div>

        {loading && <PageSpinner />}
        {error && <ErrorState error={error} onRetry={reload} className="mb-8" />}

        <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs ${loading || error ? 'hidden' : ''}`}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Registered Academy Users</h2>
            <span className="text-xs text-slate-500 font-medium">{filteredUsers.length} accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role Category</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Mail size={12} />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                          u.role === 'Administrator'
                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                            : u.role === 'Partner'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">{u.department || 'Academy'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                        <CheckCircle2 size={13} /> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
