import { useState, useEffect, useCallback } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Search, Globe, HelpCircle, Menu, Sun, Moon } from 'lucide-react'
import Logo from './ui/Logo'
import ExploreMenu from './navbar/ExploreMenu'
import UserMenu from './navbar/UserMenu'
import NotificationDropdown from './navbar/NotificationDropdown'
import MobileDrawer from './navbar/MobileDrawer'
import { useAuth } from '../context/AuthContext'
import { getRole } from '../config/roles'
import LoginModal from './LoginModal'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`)
    closeMobileMenu()
  }

  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('r8-theme') || 'system' } catch { return 'system' }
  })
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark')
    } else if (theme === 'light') {
      root.setAttribute('data-theme', 'light')
    } else {
      root.removeAttribute('data-theme')
    }
    try { localStorage.setItem('r8-theme', theme) } catch {}
  }, [theme])

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

  // Compact the header once the page is scrolled
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    closeMobileMenu()
  }, [location.pathname, location.search, closeMobileMenu])

  // Colours and labels for the signed-in user's role
  const role = getRole(user?.role)
  const roleTheme = {
    avatarBg: role.avatarClass,
    tagText: `${role.textClass} font-bold`,
    tagBadge: role.badgeClass,
    label: role.shortLabel,
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
            <Logo />

            <ExploreMenu />


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
                      isActive ? 'text-brand-600 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Center: Search Field (Cisco-style) */}
          <div className="hidden lg:flex flex-1 min-w-0 max-w-md items-center">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
              <Search size={17} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses…"
                className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200 bg-slate-100/60 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 focus:outline-none transition-all"
              />
            </form>
          </div>

          {/* Right: Actions & User Navigation */}
          <div className="flex items-center gap-2 sm:gap-3.5 flex-shrink-0">
            {/* Language */}
            <button
              className="hidden sm:inline-flex lg:hidden items-center gap-1 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="Language: English"
              aria-label="Language selector"
            >
              <Globe size={18} />
              <span className="text-xs font-semibold hidden md:inline">EN</span>
            </button>

            {/* Dark / Light mode toggle */}
            <button
              onClick={toggleTheme}
              className="relative inline-flex items-center w-14 h-7 rounded-full border border-slate-200 bg-slate-100 hover:bg-slate-200 transition-colors p-0.5"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 rounded-full shadow-sm flex items-center justify-center transition-all duration-300 ${
                  isDark
                    ? 'translate-x-7 bg-slate-800'
                    : 'translate-x-0 bg-white'
                }`}
              >
                {isDark ? <Moon size={13} className="text-amber-300" /> : <Sun size={13} className="text-amber-500" />}
              </span>
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
            <NotificationDropdown />

            <UserMenu role={role} roleTheme={roleTheme} />


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

      <MobileDrawer
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        roleTheme={roleTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />


      {/* 3-Category Login Modal */}
      <LoginModal />
    </header>
  )
}
