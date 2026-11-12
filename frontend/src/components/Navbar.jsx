import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
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
  const { user, logout, openLoginModal, switchRole } = useAuth()
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
          </div>

          {/* Center: Search Field (Cisco-style) */}
          <div className="hidden lg:flex flex-1 max-w-lg items-center">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
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
                      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-slate-800 text-xs"
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

                      {/* Quick 3-Category Switcher */}
                      <div className="py-2.5 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Role / Category
                          </span>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false)
                              openLoginModal(user.role)
                            }}
                            className="text-[10px] font-semibold text-[#16A34A] hover:underline flex items-center gap-1"
                          >
                            <LogIn size={11} /> Open Login Form
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { role: 'Administrator', short: 'Admin', icon: Shield, activeClass: 'bg-purple-100 text-purple-800 border-purple-300' },
                            { role: 'Employee', short: 'Engineer', icon: Briefcase, activeClass: 'bg-emerald-100 text-[#15803D] border-emerald-300' },
                            { role: 'Partner', short: 'Partner', icon: Users, activeClass: 'bg-blue-100 text-blue-800 border-blue-300' },
                          ].map((cat) => {
                            const isCurrent = user.role === cat.role
                            const CatIcon = cat.icon
                            return (
                              <button
                                key={cat.role}
                                onClick={() => {
                                  switchRole(cat.role)
                                  setUserMenuOpen(false)
                                }}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] font-semibold transition-all ${
                                  isCurrent
                                    ? `${cat.activeClass} shadow-xs font-bold`
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <CatIcon size={13} className="mb-0.5" />
                                <span>{cat.short}</span>
                              </button>
                            )
                          })}
                        </div>
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
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-300 hover:border-slate-400 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <LogIn size={13} className="text-[#16A34A]" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  <span>Sign Up</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}

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
            <form onSubmit={handleSearchSubmit} className="relative mb-5">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, articles..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:border-[#16A34A]"
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
                <div className="grid grid-cols-3 gap-1.5 mt-2">
                  {['Administrator', 'Employee', 'Partner'].map((role) => (
                    <button
                      key={role}
                      onClick={() => switchRole(role)}
                      className={`py-1 text-[10px] font-semibold rounded border ${
                        user.role === role ? 'bg-white border-[#16A34A] text-[#16A34A]' : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      {role === 'Administrator' ? 'Admin' : role === 'Employee' ? 'Engineer' : 'Partner'}
                    </button>
                  ))}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3-Category Login Modal */}
      <LoginModal />
    </header>
  )
}
