import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  BookOpen,
  Cpu,
  Terminal,
  Award,
  Users,
  BarChart2,
  FileText,
  TrendingUp,
  Sparkles,
} from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Structured Learning Paths',
    description: 'Progressive technical pathways taking you from zero networking knowledge to seasoned enterprise firewall architect.',
    accent: '#16A34A',
    lightBg: 'bg-emerald-50',
  },
  {
    icon: Cpu,
    title: 'Product-Specific Training',
    description: 'Deep-dive configuration walkthroughs specifically tailored to Reticen8 Next-Gen Firewalls and security appliances.',
    accent: '#2563EB',
    lightBg: 'bg-blue-50',
  },
  {
    icon: Terminal,
    title: 'Practical Firewall Exercises',
    description: 'Hands-on CLI and web GUI management drills designed to reinforce real enterprise deployment workflows.',
    accent: '#7C3AED',
    lightBg: 'bg-purple-50',
  },
  {
    icon: Award,
    title: 'Certification Examinations',
    description: 'Proctored, high-integrity exam vouchers and credentials that prove competency to prospective employers.',
    accent: '#EA580C',
    lightBg: 'bg-orange-50',
  },
  {
    icon: Users,
    title: 'Partner Learning Management',
    description: 'Multi-seat administrative dashboards for security distributors, system integrators, and university academies.',
    accent: '#0891B2',
    lightBg: 'bg-cyan-50',
  },
  {
    icon: BarChart2,
    title: 'Progress Tracking & Analytics',
    description: 'Granular skill matrices, quiz telemetry, and lab completion reports to measure individual and team growth.',
    accent: '#D97706',
    lightBg: 'bg-amber-50',
  },
  {
    icon: FileText,
    title: 'Technical Whitepapers & Docs',
    description: 'Direct access to official firewall configuration blueprints, RFC summaries, and hardening guides.',
    accent: '#059669',
    lightBg: 'bg-emerald-50',
  },
  {
    icon: TrendingUp,
    title: 'Career Advancement',
    description: 'Alumni networks, interview prep questions, and credential verification portals for enterprise job placement.',
    accent: '#DC2626',
    lightBg: 'bg-rose-50',
  },
]

export default function FeatureGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/60 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={14} />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Everything You Need to{' '}
            <span className="text-brand-600">Master Cybersecurity</span>
          </h2>
          <p className="mt-4 text-base text-slate-500 leading-relaxed font-normal">
            A comprehensive professional learning platform built from the ground up for cybersecurity engineers, partner organizations, and security teams.
          </p>
        </motion.div>

        {/* 8 Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 hover:ring-emerald-200 shadow-[var(--shadow-soft)] card-lift"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${item.lightBg} flex items-center justify-center mb-5`}
                >
                  <Icon size={22} style={{ color: item.accent }} />
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
