import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  Users,
  CheckCircle2,
  Shield,
  Globe2,
  Award,
  Sparkles,
} from 'lucide-react'

const benefits = [
  'Authorised partner training programs',
  'Dedicated partner learning portal',
  'Co-branded certification pathways',
  'Technical pre-sales enablement',
  'Engineering team skill development',
  'Partner certification tracking',
]

const partnerHighlights = [
  {
    tier: 'Global Systems Integrators',
    desc: 'Authorized deployment & integration partners',
    metric: '60+',
    label: 'Certified Orgs',
    badge: 'Enterprise Tier',
    color: 'from-emerald-500 to-teal-700',
  },
  {
    tier: 'Authorized Training Centers (ATC)',
    desc: 'Accredited university & academy facilities',
    metric: '180+',
    label: 'Lab Instructors',
    badge: 'Academic Tier',
    color: 'from-blue-600 to-indigo-800',
  },
  {
    tier: 'Corporate Security Teams',
    desc: 'Internal security operations & NOC specialists',
    metric: '1,200+',
    label: 'Engineers Certified',
    badge: 'Operations Tier',
    color: 'from-slate-800 to-slate-900',
  },
]

export default function PartnerSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 bg-[#F8FAFC]" id="partners">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Heading, Value Prop & Actions */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/60 text-[#15803D] text-xs font-bold uppercase tracking-wider mb-3">
                <Globe2 size={14} />
                <span>Global Ecosystem</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Empowering Our{' '}
                <span className="text-[#16A34A]">Partner Ecosystem</span>
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed font-normal">
                Equip your engineering teams with the knowledge and practical expertise needed to deploy, configure, and manage Reticen8 cybersecurity solutions effectively for enterprise clients.
              </p>
            </motion.div>

            {/* Checklist */}
            <ul className="mt-8 grid sm:grid-cols-2 gap-3.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <CheckCircle2 size={17} className="text-[#16A34A] mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-700">{b}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link
                to="/partners"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] shadow-md shadow-emerald-700/20 transition-all group"
              >
                <Building2 size={16} />
                <span>Partner Training</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/certifications"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all"
              >
                <Users size={16} className="text-slate-500" />
                <span>Engineer Certification</span>
              </Link>
            </div>
          </div>

          {/* Right Column: High-end Partner Program Cards */}
          <div className="lg:col-span-6">
            <div className="space-y-4">
              {partnerHighlights.map((tier, idx) => (
                <motion.div
                  key={tier.tier}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
                      <Shield size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{tier.tier}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {tier.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{tier.desc}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pl-3 border-l border-slate-100">
                    <span className="text-xl font-bold text-slate-900 block leading-tight">
                      {tier.metric}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      {tier.label}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Verified Trust Statement */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center gap-3">
                <Sparkles size={18} className="text-[#16A34A] flex-shrink-0" />
                <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                  Reticen8 partner credentials are cryptographically verifiable and backed by our continuous enterprise syllabus.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
