import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { coursesData } from '../../data/courses'

export default function AdminCourses() {
  const [courses] = useState(coursesData)

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
        </div>

        <div className="mb-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center font-bold">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Course Design &amp; Syllabus Manager</h1>
              <p className="text-xs text-slate-500">
                All mock lab materials and dummy modules have been removed. Ready for user's official course curriculum.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {course.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {course.difficulty}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{course.title}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                  {course.shortDesc || course.description}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 font-medium">
                  <AlertCircle size={14} />
                  <span>Curriculum modules &amp; lab exercises awaiting course design input</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-end gap-2 shrink-0">
                <Link
                  to={`/courses/${course.id}`}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                >
                  View Public Page
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
