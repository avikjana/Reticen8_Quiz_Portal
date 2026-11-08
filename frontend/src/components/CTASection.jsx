import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export default function CTASection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="relative py-20 lg:py-28 bg-[#0F172A] text-white overflow-hidden" id="cta">
      {/* Subtle green ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={16} />
            <span>Accelerate Your Security Career</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
            Build Your Expertise in{' '}
            <span className="text-emerald-400">Enterprise Cybersecurity.</span>
          </h2>

          {/* Description */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Start your Reticen8 learning journey and develop the skills to secure modern enterprise networks with industry-recognized certifications.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] shadow-lg shadow-emerald-900/40 transition-all group"
            >
              <span>Get Started Today</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-semibold text-slate-200 bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all"
            >
              Browse Course Catalog
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-400 font-medium">
            No credit card required for introductory paths • Free credential verification
          </p>
        </motion.div>
      </div>
    </section>
  )
}
