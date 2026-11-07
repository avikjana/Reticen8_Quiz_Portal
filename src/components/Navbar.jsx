import { useState, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Globe,
  HelpCircle,
  Bell,
  ChevronDown,
  LayoutGrid,
  Menu,
  X,
  Shield,
  BookOpen,
  Award,
  GraduationCap,
  Sparkles,
  ArrowRight,
  User,
} from 'lucide-react'

const exploreMenu = [
  {
    category: 'Cybersecurity Disciplines',
    items: [
      { name: 'Next-Generation Firewalls (NGFW)', desc: 'Enterprise traffic filtering & NAT', path: '/paths' },
      { name: 'Threat Prevention & IPS', desc: 'Signature & anomaly threat detection', path: '/paths' },
      { name: 'Secure VPN Architectures', desc: 'IPsec, SSL-VPN & zero-trust access', path: '/paths' },
      { name: 'Security Operations & NOC', desc: 'Monitoring, SIEM & incident response', path: '/paths' },
    ],
  },
  {
    category: 'Programs & Credentials',
    items: [
      { name: 'Reticen8 Associate (RCFA)', desc: 'Foundational firewall certification', path: '/certifications' },
      { name: 'Reticen8 Professional (RCFP)', desc: 'Advanced configuration & security', path: '/certifications' },
      { name: 'Reticen8 Architect (RCSA)', desc: 'Multi-site enterprise security design', path: '/certifications' },
      { name: 'Hands-on Lab Simulator', desc: 'Interactive live configuration sandbox', path: '/labs' },
    ],
  },
]

export default function Navbar() {
  const [exploreOpen, setExploreOpen] = useState(false)
  const [searchFilter, setSearchFilter] = useState('Learner')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const exploreRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target)) {
        setExploreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-all duration-200 ${
        scrolled ? 'shadow-md border-b border-slate-200/80' : 'border-b border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-4 lg:gap-8">

          {/* Left: Brand + Explore Button */}
          <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center text-white shadow-sm shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <Shield size={22} className="stroke-[2.5]" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[15px] font-black tracking-wide text-slate-900 uppercase">
                  Reticen8
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#16A34A] uppercase -mt-0.5">
                  Academy
                </span>
              </div>
            </Link>

            {/* Explore Button with Dropdown (Cisco style) */}
            <div className="relative hidden md:block" ref={exploreRef}>
              <button
                onClick={() => setExploreOpen(!exploreOpen)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-semibold transition-all ${
                  exploreOpen
                    ? 'border-[#16A34A] bg-emerald-50 text-[#16A34A]'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                }`}
                aria-expanded={exploreOpen}
              >
                <LayoutGrid size={16} className="text-[#16A34A]" />
                <span>Explore</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${exploreOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Explore Mega Menu */}
              <AnimatePresence>
                {exploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full mt-2 w-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-50"
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
                                  onClick={() => setExploreOpen(false)}
                                  className="group/item block p-2 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                  <div className="text-sm font-semibold text-slate-800 group-hover/item:text-[#16A34A] flex items-center justify-between">
                                    <span>{item.name}</span>
                                    <ArrowRight size={12} className="opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all text-[#16A34A]" />
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
                      <span>Looking for institutional partnerships?</span>
                      <Link
                        to="/about"
                        onClick={() => setExploreOpen(false)}
                        className="text-[#16A34A] font-semibold hover:underline flex items-center gap-1"
                      >
                        Partner with Reticen8 →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Center: Search Field (Cisco-style) */}
          <div className="hidden lg:flex flex-1 max-w-lg items-center">
            <div className="relative w-full flex items-center">
              <Search size={17} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for courses, articles and certifications"
                className="w-full h-10 pl-10 pr-24 rounded-full border border-slate-300 bg-slate-50/60 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 focus:outline-none transition-all"
              />
              <div className="absolute right-1.5 flex items-center">
                <button
                  type="button"
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <span>{searchFilter}</span>
                  <ChevronDown size={11} className="text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Actions & User Navigation */}
          <div className="flex items-center gap-2 sm:gap-3.5 flex-shrink-0">
            {/* My Learning */}
            <Link
              to="/courses"
              className="hidden xl:inline-flex text-sm font-semibold text-slate-700 hover:text-[#16A34A] transition-colors"
            >
              My Learning
            </Link>

            {/* Language */}
            <button
              className="hidden sm:inline-flex items-center gap-1 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="Language: English"
              aria-label="Language selector"
            >
              <Globe size={18} />
              <span className="text-xs font-semibold hidden md:inline">EN</span>
            </button>

            {/* Help */}
            <button
              className="hidden sm:inline-flex p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="Help & Support"
              aria-label="Help and support"
            >
              <HelpCircle size={18} />
            </button>

            {/* Notifications */}
            <button
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
            </button>

            {/* User Profile avatar pill (Cisco style) */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-xs font-bold text-slate-800">Avik</span>
                  <span className="text-[10px] text-slate-500 font-medium">Engineer</span>
                </div>
              </div>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 bg-white px-4 py-6 shadow-xl overflow-hidden"
          >
            {/* Mobile search */}
            <div className="relative mb-5">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search courses, articles..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:border-[#16A34A]"
              />
            </div>

            <nav className="space-y-1">
              {[
                { label: 'Explore Courses', href: '/courses', icon: BookOpen },
                { label: 'Learning Paths', href: '/paths', icon: GraduationCap },
                { label: 'Certifications', href: '/certifications', icon: Award },
                { label: 'Practical Labs', href: '/labs', icon: Sparkles },
                { label: 'My Learning Profile', href: '/about', icon: User },
              ].map((link) => {
                const Icon = link.icon
                return (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#16A34A] hover:bg-emerald-50 transition-colors"
                  >
                    <Icon size={18} className="text-[#16A34A]" />
                    <span>{link.label}</span>
                  </NavLink>
                )
              })}
            </nav>

            <div className="mt-6 pt-5 border-t border-slate-200 flex gap-3">
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-4 text-center text-sm font-semibold text-white bg-[#16A34A] rounded-xl hover:bg-[#15803D]"
              >
                Get Started
              </Link>
              <Link
                to="/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-4 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                Browse Catalog
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
