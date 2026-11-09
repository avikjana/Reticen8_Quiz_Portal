import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, AlertCircle, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { coursesData } from '../data/courses'

export default function LearningPlayer() {
  const { id } = useParams()
  const course = coursesData.find((c) => c.id === id) || coursesData[0]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
          <Shield size={32} />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 uppercase tracking-wider mb-4">
          Training Modules &amp; Labs
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          {course ? course.title : 'Course Learning Environment'}
        </h1>

        <p className="text-sm text-slate-600 max-w-lg mb-8 leading-relaxed">
          Interactive lab exercises, hands-on tasks, and lesson materials are currently pending course design. The training modules will be loaded once finalized.
        </p>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-xs mb-8 text-left">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">Course Design Status</div>
              <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                Awaiting official course curriculum structure and lab configurations.
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/courses"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-colors shadow-sm"
          >
            <BookOpen size={15} />
            <span>Browse Available Courses</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Return to Academy Home</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
