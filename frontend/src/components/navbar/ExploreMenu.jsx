import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, LayoutGrid, ArrowRight } from 'lucide-react'
import useDismissable from '../../hooks/useDismissable'

const exploreMenu = [
  {
    category: 'Cybersecurity Disciplines',
    items: [
      { name: 'Next-Generation Firewalls (NGFW)', desc: 'Enterprise traffic filtering & NAT', path: '/courses?category=Firewall+Administration' },
      { name: 'Threat Prevention & IPS', desc: 'Signature & anomaly threat detection', path: '/courses?category=Threat+Defense' },
      { name: 'Secure VPN Architectures', desc: 'IPsec, SSL-VPN & zero-trust access', path: '/courses?category=Architecture+%26+Cloud' },
      { name: 'Security Operations & NOC', desc: 'Monitoring, SIEM & incident response', path: '/courses?category=Network+Security' },
    ],
  },
  {
    category: 'Programs & Credentials',
    items: [
      { name: 'Reticen8 Associate (RCFA)', desc: 'Foundational firewall certification', path: '/certifications#rcfa' },
      { name: 'Reticen8 Professional (RCFP)', desc: 'Advanced configuration & security', path: '/certifications#rcfp' },
      { name: 'Reticen8 Architect (RCSA)', desc: 'Multi-site enterprise security design', path: '/certifications#rcsa' },
      { name: 'Hands-on Lab Simulator', desc: 'Interactive live configuration sandbox', path: '/labs' },
    ],
  },
]

// "Explore" button with the two-column mega menu (tablet and up)
export default function ExploreMenu() {
  const { open, setOpen, ref } = useDismissable()

  return (
    <div className="relative hidden md:block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-semibold transition-all ${
          open
            ? 'border-emerald-300 bg-emerald-50 text-brand-600'
            : 'border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 hover:bg-white hover:shadow-[var(--shadow-soft)]'
        }`}
        aria-expanded={open}
      >
        <LayoutGrid size={16} className="text-brand-600" />
        <span>Explore</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Explore Mega Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full mt-3 w-[min(580px,calc(100vw-2rem))] origin-top-left bg-white/95 backdrop-blur-xl rounded-2xl shadow-[var(--shadow-lift)] ring-1 ring-slate-900/5 p-6 z-50"
          >
            <div className="grid grid-cols-2 gap-6">
              {exploreMenu.map((group) => (
                <div key={group.category}>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    {group.category}
                  </h4>
                  <ul className="space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.path}
                          onClick={() => setOpen(false)}
                          className="group/item block p-2 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <div className="text-sm font-semibold text-slate-800 group-hover/item:text-brand-600 flex items-center justify-between">
                            <span>{item.name}</span>
                            <ArrowRight size={12} className="opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all text-brand-600" />
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {item.desc}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Looking for enterprise certifications?</span>
              <Link
                to="/certifications"
                onClick={() => setOpen(false)}
                className="text-brand-600 font-semibold hover:underline flex items-center gap-1"
              >
                View Credentials &amp; Blueprints →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
