import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, FileCheck, CheckCircle2, ShieldCheck, Clock } from 'lucide-react'

const badgeColors = {
  Associate: {
    gradient: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-200',
    lightBg: 'bg-emerald-50',
    tagText: 'text-emerald-700',
    btnHover: 'hover:bg-emerald-600',
    accent: '#16A34A',
  },
  Professional: {
    gradient: 'from-blue-600 to-indigo-700',
    border: 'border-blue-200',
    lightBg: 'bg-blue-50',
    tagText: 'text-blue-700',
    btnHover: 'hover:bg-blue-600',
    accent: '#2563EB',
  },
  Architect: {
    gradient: 'from-amber-500 to-orange-600',
    border: 'border-amber-200',
    lightBg: 'bg-amber-50',
    tagText: 'text-amber-700',
    btnHover: 'hover:bg-amber-600',
    accent: '#EA580C',
  },
  Expert: {
    gradient: 'from-purple-600 to-violet-800',
    border: 'border-purple-200',
    lightBg: 'bg-purple-50',
    tagText: 'text-purple-700',
    btnHover: 'hover:bg-purple-600',
    accent: '#7C3AED',
  },
}

export function CertificationCard({ cert, index }) {
  const style = badgeColors[cert.level] || badgeColors.Associate

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group flex flex-col bg-white rounded-3xl ring-1 ring-slate-200/80 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] hover:ring-slate-300 transition-shadow duration-300 p-5 sm:p-6"
    >
      {/* Top Header: Badge Emblem + Level Pill */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform`}>
          <ShieldCheck size={26} className="stroke-[2.2]" />
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style.lightBg} ${style.border} ${style.tagText}`}>
          {cert.level} Level
        </span>
      </div>

      {/* Code & Title */}
      <span className="text-xs font-black tracking-widest text-[#16A34A] uppercase">
        {cert.code}
      </span>
      <h3 className="text-lg font-bold text-slate-900 leading-snug mt-1 group-hover:text-[#16A34A] transition-colors">
        {cert.title}
      </h3>

      <p className="mt-3 text-sm text-slate-500 leading-relaxed flex-1">
        {cert.description}
      </p>

      {/* Exam metadata */}
      <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
        <div className="flex items-start gap-2 text-xs text-slate-600">
          <CheckCircle2 size={15} className="text-[#16A34A] mt-0.5 flex-shrink-0" />
          <span><strong className="text-slate-800">Prerequisites:</strong> {cert.prerequisites}</span>
        </div>
        <div className="flex items-start gap-2 text-xs text-slate-600">
          <FileCheck size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <span><strong className="text-slate-800">Format:</strong> {cert.examFormat}</span>
        </div>
      </div>

      {/* Button */}
      <div className="mt-6">
        <Link
          to={`/certifications/${cert.id}`}
          className={`w-full py-2.5 px-4 rounded-xl border-2 text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 group/btn`}
          style={{ borderColor: style.accent, color: style.accent }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = style.accent
            e.currentTarget.style.color = '#FFFFFF'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = style.accent
          }}
        >
          <span>View Certification Guide</span>
          <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.article>
  )
}
