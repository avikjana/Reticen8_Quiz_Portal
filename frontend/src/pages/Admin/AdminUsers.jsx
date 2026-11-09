import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Users, ArrowLeft, Plus, CheckCircle2, Trash2, Mail, Briefcase } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import api from '../../services/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('All')

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get('/admin/users')
        if (res.success) {
          setUsers(res.users)
        }
      } catch (err) {
        // Fallback demo users
        setUsers([
          { id: 'usr-admin-01', name: 'Avik Jana', email: 'admin@reticen8.com', role: 'Administrator', department: 'Global Information Security' },
          { id: 'usr-emp-02', name: 'Avik Jana', email: 'employee@reticen8.com', role: 'Employee', department: 'Security Operations Center (SOC)' },
          { id: 'usr-partner-03', name: 'Avik Jana', email: 'partner@reticen8.com', role: 'Partner', department: 'Partner Engineering Ecosystem' },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = roleFilter === 'All'
    ? users
    : users.filter((u) => u.role === roleFilter)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Admin Overview</span>
          </Link>
          <div className="flex gap-2">
            {['All', 'Administrator', 'Employee', 'Partner'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  roleFilter === role
                    ? 'bg-[#16A34A] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Registered Academy Users</h2>
            <span className="text-xs text-slate-500 font-medium">{filteredUsers.length} accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
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
