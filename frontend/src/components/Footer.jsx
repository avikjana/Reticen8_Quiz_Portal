import { Link } from 'react-router-dom'
import Logo from './ui/Logo'
import { Mail } from 'lucide-react'

function TwitterIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

function LinkedinIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function YoutubeIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}

function GithubIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

const footerLinks = {
  Learning: [
    { label: 'Explore Courses', href: '/courses' },
    { label: 'Learning Paths', href: '/paths' },
    { label: 'Practical Labs', href: '/labs' },
    { label: 'Learning Resources', href: '/resources' },
  ],
  Certifications: [
    { label: 'All Certifications', href: '/certifications' },
    { label: 'Exam Information', href: '/certifications' },
    { label: 'Certificate Verification', href: '/certifications' },
  ],
  Company: [
    { label: 'About Reticen8', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Partner Program', href: '/partners' },
  ],
  Support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Documentation', href: '/docs' },
    { label: 'Technical Support', href: '/support' },
  ],
}

const socialLinks = [
  { icon: TwitterIcon, label: 'Twitter', href: 'https://twitter.com' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: YoutubeIcon, label: 'YouTube', href: 'https://youtube.com' },
  { icon: GithubIcon, label: 'GitHub', href: 'https://github.com' },
  { icon: Mail, label: 'Email', href: 'mailto:contact@reticen8.com' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="theme-fixed bg-[#0B1120] text-slate-400 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">

          {/* Col 1: Brand & Bio */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Logo tone="light" className="mb-4" />

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              Reticen8 Academy provides enterprise-grade cybersecurity education, hands-on firewall laboratory training, and industry credentials for modern network defenders.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-brand-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Columns 2-5: Link Categories */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {year} Reticen8 Technologies Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Settings</Link>
            <Link to="/security" className="hover:text-white transition-colors">Security Disclosures</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
