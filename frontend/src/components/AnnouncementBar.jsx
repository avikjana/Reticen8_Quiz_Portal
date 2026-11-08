import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react'

const announcements = [
  {
    title: 'Updates',
    message: 'Reminder: Check your profile name before course completion. Make sure it matches how you want it to appear on your Reticen8 certification certificate.',
    linkText: 'Read more',
    linkUrl: '/certifications',
  },
  {
    title: 'New Course',
    message: 'Advanced Firewall Security v7.4 is now live. Explore zero-trust network architectures and next-gen threat defense.',
    linkText: 'Explore path',
    linkUrl: '/paths',
  },
]

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const current = announcements[index]

  const nextAnnouncement = () => {
    setIndex((prev) => (prev + 1) % announcements.length)
  }

  const prevAnnouncement = () => {
    setIndex((prev) => (prev - 1 + announcements.length) % announcements.length)
  }

  return (
    <div className="relative z-50 bg-gradient-to-r from-[#0F5132] via-[#146C43] to-[#198754] text-white text-xs sm:text-[13px] py-2 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left message with badge */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="font-bold tracking-wide uppercase text-emerald-200 text-xs px-2 py-0.5 rounded bg-emerald-900/40 border border-emerald-500/30 flex-shrink-0">
            {current.title}
          </span>
          <p className="truncate text-emerald-50">
            {current.message}
          </p>
          <a
            href={current.linkUrl}
            className="inline-flex items-center gap-1 font-semibold text-white underline underline-offset-2 hover:text-emerald-200 flex-shrink-0 transition-colors"
          >
            {current.linkText}
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 text-emerald-100 flex-shrink-0">
          <button
            onClick={prevAnnouncement}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Previous announcement"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-[11px] font-medium px-1 text-emerald-200">
            {index + 1}/{announcements.length}
          </span>
          <button
            onClick={nextAnnouncement}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Next announcement"
          >
            <ChevronRight size={16} />
          </button>
          <div className="h-3.5 w-px bg-white/20 mx-1" />
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/10 rounded transition-colors text-emerald-200 hover:text-white"
            aria-label="Dismiss banner"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
