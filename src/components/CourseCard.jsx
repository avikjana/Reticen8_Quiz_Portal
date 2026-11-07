import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Clock, Shield, Lock, Network, Cpu, Check } from 'lucide-react'

const iconMap = {
  shield: Shield,
  lock: Lock,
  network: Network,
  cpu: Cpu,
}

const difficultyTheme = {
  Beginner: {
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    accent: '#16A34A',
    dot: 'bg-emerald-500',
  },
  Intermediate: {
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    accent: '#2563EB',
    dot: 'bg-blue-500',
  },
  Advanced: {
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    accent: '#D97706',
    dot: 'bg-amber-500',
  },
  Expert: {
    text: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    accent: '#7C3AED',
    dot: 'bg-purple-500',
  },
}

export function CourseCard({ course, index }) {
  const Icon = iconMap[course.icon] || Shield
  const theme = difficultyTheme[course.difficulty] || difficultyTheme.Beginner

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-200 overflow-hidden"
    >
      {/* Top colorful accent strip */}
      <div className="h-2 w-full" style={{ background: theme.accent }} />

      {/* Card Header */}
      <div className="p-6 pb-4 flex items-start justify-between gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform"
          style={{ background: course.bgColor }}
        >
          <Icon size={24} style={{ color: theme.accent }} />
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${theme.text} ${theme.bg} ${theme.border}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
          {course.difficulty}
        </span>
      </div>

      {/* Card Content */}
      <div className="px-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#16A34A] transition-colors leading-snug">
          {course.title}
        </h3>
        <p className="mt-2.5 text-sm text-slate-500 leading-relaxed">
          {course.description}
        </p>

        {/* Modules & Key Focus Areas */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Key Modules
          </p>
          <ul className="space-y-2">
            {course.topics.map((topic) => (
              <li key={topic} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Check size={14} className="text-[#16A34A] flex-shrink-0" />
                <span className="truncate">{topic}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card Footer with Meta & CTA */}
      <div className="px-6 py-4 mt-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <BookOpen size={14} className="text-slate-400" />
          <span>{course.modules} Modules</span>
        </div>
        <Link
          to={`/courses/${course.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#16A34A] hover:text-emerald-800 transition-colors group/btn"
        >
          <span>Explore Course</span>
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.article>
  )
}
