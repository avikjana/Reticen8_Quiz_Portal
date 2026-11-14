import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
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
  CheckCircle2,
  LogIn,
  Briefcase,
  Users,
  LogOut,
  RefreshCw,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'

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

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, openLoginModal } = useAuth()
  const [exploreOpen, setExploreOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchFilter, setSearchFilter] = useState('Learner')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const exploreRef = useRef(null)
  const userMenuRef = useRef(null)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`)
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close every menu whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false)
    setExploreOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname, location.search])

  // Esc closes menus; lock page scroll while the mobile drawer is open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setExploreOpen(false)
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileMenuOpen])

  // Close the drawer automatically when resizing up to desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && setMobileMenuOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target)) {
        setExploreOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Dynamic user theme based on category
  const roleTheme = {
    Administrator: {
      avatarBg: 'bg-purple-100 text-purple-700',
      tagText: 'text-purple-700 font-bold',
      tagBadge: 'bg-purple-100 text-purple-800 border-purple-200',
      label: 'Admin',
      icon: Shield,
    },
    Employee: {
      avatarBg: 'bg-emerald-100 text-[#16A34A]',
      tagText: 'text-[#16A34A] font-bold',
      tagBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      label: 'Engineer',
      icon: Briefcase,
    },
    Partner: {
      avatarBg: 'bg-blue-100 text-blue-700',
      tagText: 'text-blue-700 font-bold',
      tagBadge: 'bg-blue-100 text-blue-800 border-blue-200',
      label: 'Partner',
      icon: Users,
    },
  }[user?.role || 'Employee'] || {
    avatarBg: 'bg-emerald-100 text-[#16A34A]',
    tagText: 'text-[#16A34A] font-bold',
    tagBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    label: 'Engineer',
    icon: Briefcase,
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Frosted background lives on its own layer so fixed-position children
          (login modal, mobile drawer) aren't trapped by backdrop-filter */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 glass border-b transition-[box-shadow,border-color] duration-300 ${
          scrolled ? 'border-slate-200/70 shadow-[0_8px_30px_-12px_rgb(15_23_42/0.15)]' : 'border-transparent'
        }`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between gap-3 lg:gap-6 transition-[height] duration-300 ${scrolled ? 'h-16' : 'h-[72px]'}`}>

          {/* Left: Brand + Explore Button */}
          <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-[#16A34A] to-teal-700 flex items-center justify-center text-white shadow-[var(--shadow-glow)] group-hover:scale-105 group-hover:rotate-[-4deg] transition-transform duration-300">
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-semibold transition-all ${
                  exploreOpen
                    ? 'border-emerald-300 bg-emerald-50 text-[#16A34A]'
                    : 'border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 hover:bg-white hover:shadow-[var(--shadow-soft)]'
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
                      <span>Looking for enterprise certifications?</span>
                      <Link
                        to="/certifications"
                        onClick={() => setExploreOpen(false)}
                        className="text-[#16A34A] font-semibold hover:underline flex items-center gap-1"
                      >
                        View Credentials &amp; Blueprints →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Primary links (wide screens) */}
            <nav className="hidden xl:flex items-center gap-1" aria-label="Primary">
              {[
                { label: 'Courses', href: '/courses' },
                { label: 'Certifications', href: '/certifications' },
                { label: 'Labs', href: '/labs' },
              ].map((l) => (
                <NavLink
                  key={l.href}
                  to={l.href}
                  className={({ isActive }) =>
                    `relative px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
                      isActive ? 'text-[#16A34A] bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Center: Search Field (Cisco-style) */}
          <div className="hidden lg:flex flex-1 max-w-md items-center">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
              <Search size={17} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses &amp; certifications…"
                className="w-full h-10 pl-10 pr-4 2xl:pr-20 rounded-full border border-slate-200 bg-slate-100/60 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 focus:outline-none transition-all"
              />
              <div className="absolute right-1.5 hidden 2xl:flex items-center">
                <button
                  type="submit"
                  className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-full transition-colors shadow-2xs"
                >
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Actions & User Navigation */}
          <div className="flex items-center gap-2 sm:gap-3.5 flex-shrink-0">
            {/* Language */}
            <button
              className="hidden sm:inline-flex lg:hidden 2xl:inline-flex items-center gap-1 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
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

            {/* User Profile avatar pill with interactive modal/dropdown */}
            {user ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs"
                  title={`Logged in as ${user.name} (${user.role})`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${roleTheme.avatarBg}`}>
                    {user.name ? user.name[0].toUpperCase() : 'A'}
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-xs font-bold text-slate-800">
                      {user.name ? user.name.split(' ')[0] : 'Avik'}
                    </span>
                    <span className={`text-[10px] font-semibold ${roleTheme.tagText}`}>
                      {roleTheme.label}
                    </span>
                  </div>
                  <ChevronDown size={11} className="text-slate-400 ml-0.5" />
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-72 origin-top-right bg-white/95 backdrop-blur-xl rounded-2xl shadow-[var(--shadow-lift)] ring-1 ring-slate-900/5 p-4 z-50 text-slate-800 text-xs"
                    >
                      {/* User Info Header */}
                      <div className="pb-3 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-slate-900 block truncate">
                            {user.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${roleTheme.tagBadge}`}>
                            {user.role}
                          </span>
                        </div>
                        <span className="text-slate-500 text-[11px] block truncate">
                          {user.email}
                        </span>
                        <span className="text-slate-400 text-[10px] block mt-0.5">
                          {user.roleTitle || user.department}
                        </span>
                      </div>

                      {/* Switch account */}
                      <div className="py-2.5 border-b border-slate-100">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false)
                            openLoginModal(user.role)
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                        >
                          <RefreshCw size={13} className="text-[#16A34A]" /> Switch account
                        </button>
                      </div>

                      {/* Navigation Links */}
                      <div className="py-2 space-y-1">
                        <Link
                          to={user.role === 'Administrator' ? '/admin' : user.role === 'Partner' ? '/partner' : '/employee'}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 hover:bg-emerald-50 text-slate-900 font-bold"
                        >
                          <Shield size={14} className="text-[#16A34A]" />
                          <span>
                            {user.role === 'Administrator'
                              ? 'Admin Dashboard'
                              : user.role === 'Partner'
                              ? 'Partner Portal'
                              : 'Employee Dashboard'}
                          </span>
                        </Link>
                        <Link
                          to="/courses"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                        >
                          <BookOpen size={14} className="text-[#16A34A]" /> Course Catalog
                        </Link>
                        <Link
                          to="/certifications"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                        >
                          <Award size={14} className="text-[#16A34A]" /> Certifications &amp; Badges
                        </Link>
                      </div>

                      {/* Account Options: Login, Signup, Forgot Password */}
                      <div className="py-2 border-t border-slate-100 space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">
                          Authentication Options
                        </div>
                        <Link
                          to="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                        >
                          <LogIn size={13} className="text-[#16A34A]" />
                          <span>Login / Switch Account</span>
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                        >
                          <Users size={13} className="text-blue-600" />
                          <span>Sign Up / Create Account</span>
                        </Link>
                        <Link
                          to="/forgot-password"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                        >
                          <HelpCircle size={13} className="text-amber-500" />
                          <span>Forgot Password?</span>
                        </Link>
                      </div>

                      {/* Sign Out */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false)
                            logout()
                          }}
                          className="flex items-center gap-1.5 p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg font-medium transition-colors"
                        >
                          <LogOut size={13} /> Sign Out
                        </button>
                        <span className="text-[10px] text-slate-400">Reticen8 Auth</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <LogIn size={13} className="text-[#16A34A]" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all shadow-[var(--shadow-glow)] hover:-translate-y-px"
                >
                  <span>Sign Up</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -mr-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            key="drawer-panel"
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="lg:hidden fixed inset-y-0 right-0 z-[61] w-full max-w-sm bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 flex-shrink-0">
              <span className="font-display text-base font-bold text-slate-900">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            {/* Mobile search */}
            <form onSubmit={handleSearchSubmit} className="relative mb-5">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, articles..."
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:bg-white focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 transition-all"
              />
            </form>

            {/* Current Mobile User Role Pill */}
            {user ? (
              <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${roleTheme.avatarBg}`}>
                      {user.name ? user.name[0].toUpperCase() : 'A'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{user.name}</div>
                      <div className="text-[10px] text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${roleTheme.tagBadge}`}>
                    {user.role}
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#16A34A] font-bold hover:underline"
                  >
                    + Register Account
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      logout()
                    }}
                    className="text-rose-600 font-semibold hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <LogIn size={14} className="text-[#16A34A]" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 text-center text-xs font-bold text-white bg-[#16A34A] rounded-xl hover:bg-[#15803D] flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>Sign Up</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
                <div className="text-center">
                  <Link
                    to="/forgot-password"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
            )}

            <nav className="space-y-1">
              {[
                { label: 'Explore Courses', href: '/courses', icon: BookOpen },
                { label: 'Learning Paths', href: '/paths', icon: GraduationCap },
                { label: 'Certifications', href: '/certifications', icon: Award },
                { label: 'Practical Labs', href: '/labs', icon: Sparkles },
                { label: 'My Learning Profile', href: '/courses', icon: User },
              ].map((link) => {
                const Icon = link.icon
                return (
                  <NavLink
                    key={link.label}
                    to={link.href}
                    end
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive ? 'bg-emerald-50 text-[#16A34A]' : 'text-slate-700 hover:text-[#16A34A] hover:bg-emerald-50'
                      }`
                    }
                  >
                    <span className="w-9 h-9 rounded-lg bg-emerald-50 group-hover:bg-white flex items-center justify-center transition-colors">
                      <Icon size={18} className="text-[#16A34A]" />
                    </span>
                    <span className="flex-1">{link.label}</span>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-[#16A34A] group-hover:translate-x-0.5 transition-all" />
                  </NavLink>
                )
              })}
            </nav>

            <div className="mt-6 pt-5 border-t border-slate-200 flex gap-3">
              <Link
                to="/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-4 text-center text-sm font-semibold text-white bg-[#16A34A] rounded-xl hover:bg-[#15803D]"
              >
                Browse Catalog
              </Link>
              <Link
                to="/certifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-4 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                Certifications
              </Link>
            </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3-Category Login Modal */}
      <LoginModal />
    </header>
  )
}
