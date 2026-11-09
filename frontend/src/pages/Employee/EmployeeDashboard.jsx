import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, BookOpen, Award, CheckCircle2, AlertCircle, ArrowRight, Clock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import api from '../../services/api'
import { coursesData } from '../../data/courses'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const [courses] = useState(coursesData)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2 inline-block">
              Employee &amp; Engineer Learning Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Avik'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Internal Technical Training &amp; Firewall Engineering Competencies
            </p>
          </div>
        </div>

        {/* Status card */}
        <div className="mb-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Technical Training Track: In Progress
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Course design and lab assignments are currently being structured. Your enrolled pathways are displayed below.
              </p>
            </div>
          </div>
        </div>

        {/* Assigned Courses Grid */}
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Assigned Enterprise Courses
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {courses.slice(0, 2).map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {course.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">Enrolled</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{course.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {course.shortDesc}
                </p>
                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 flex items-center gap-2">
                  <AlertCircle size={14} className="text-slate-400" />
                  <span>Curriculum awaiting course design release</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Self-Paced</span>
                <Link
                  to={`/courses/${course.id}`}
                  className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1"
                >
                  <span>Course Details</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
