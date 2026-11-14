import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, ShieldCheck } from 'lucide-react'
import { CertificationCard } from './CertificationCard'
import useApi from '../hooks/useApi'
import { CardSkeletons, ErrorState } from './ui/DataState'

export default function CertificationSection() {
  const ref = useRef(null)
  const { data, loading, error, reload } = useApi('/certifications')
  const certifications = data || []
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 bg-white" id="certifications">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/60 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Award size={14} />
            <span>Industry Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Validate Your Expertise.{' '}
            <span className="text-brand-600">Get Certified.</span>
          </h2>
          <p className="mt-4 text-base text-slate-500 leading-relaxed font-normal">
            Demonstrate your practical firewall and cybersecurity knowledge through Reticen8 professional certification programs recognised by enterprise employers worldwide.
          </p>
        </motion.div>

        {/* Certification Progression Flow */}
        <div className={`${certifications.length ? 'hidden lg:flex' : 'hidden'} items-center justify-center gap-3 mb-14 px-8 py-5 bg-slate-50 rounded-2xl border border-slate-200/80 max-w-4xl mx-auto`}>
          {certifications.map((c, i) => (
            <div key={c.id} className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <ShieldCheck size={16} className="text-brand-600" />
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{c.code}</span>
                <span className="text-xs text-slate-400">({c.level})</span>
              </div>
              {i < certifications.length - 1 && (
                <ArrowRight size={14} className="text-slate-300" />
              )}
            </div>
          ))}
        </div>

        {/* 4 Certification Cards Grid */}
        {loading ? (
          <CardSkeletons className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} title="We couldn't load the certifications" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, i) => (
              <CertificationCard key={cert.id} cert={cert} index={i} />
            ))}
          </div>
        )}

        {/* Bottom Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            to="/certifications"
            className="theme-fixed inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-[#101828] hover:bg-slate-800 shadow-md transition-all"
          >
            <span>Explore All Exam Guides &amp; Blueprints</span>
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
