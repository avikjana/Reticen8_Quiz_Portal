import { Link } from 'react-router-dom'
import {
  Mail,
  MessageCircle,
  BookOpen,
  ShieldCheck,
  FileText,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  ChevronRight,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { usePageTitle } from '../hooks/usePageTitle'

const faqs = [
  {
    q: 'How do I enroll in a course?',
    a: 'Navigate to the Course Catalog, select a course, and click "Enroll Now". You must be signed in to enroll.',
  },
  {
    q: 'Are the courses free?',
    a: 'Yes, all introductory courses on Reticen8 Academy are completely free. Some advanced certification tracks may require a fee.',
  },
  {
    q: 'How do I take a certification exam?',
    a: 'Complete the prerequisite courses, then visit the Certifications page to register for your exam. Exams are proctored online.',
  },
  {
    q: 'I forgot my password. How do I reset it?',
    a: 'Click "Forgot Password" on the Sign In page, enter your email, and follow the reset link sent to your inbox.',
  },
  {
    q: 'How do I verify a certification credential?',
    a: 'Go to the Certifications page and use the Verification Tool at the bottom. Enter the credential serial number to validate it.',
  },
  {
    q: 'Can I access courses on mobile?',
    a: 'Yes, Reticen8 Academy is fully responsive and works on all modern browsers, tablets, and mobile devices.',
  },
]

const resources = [
  {
    icon: BookOpen,
    title: 'Course Catalog',
    desc: 'Browse all available courses and learning paths.',
    link: '/courses',
  },
  {
    icon: ShieldCheck,
    title: 'Certifications',
    desc: 'View certification tracks and exam details.',
    link: '/certifications',
  },
  {
    icon: FileText,
    title: 'Getting Started Guide',
    desc: 'New to Reticen8 Academy? Start here.',
    link: '/courses',
  },
]

export default function Help() {
  usePageTitle('Help & Support')

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-white pt-10 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6">
            <Link to="/" className="hover:text-[#4b6cf7] transition-colors">Home</Link>
            <ChevronRight size={13} />
            <span className="text-slate-700">Help & Support</span>
          </nav>

          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4b6cf7]/10 text-[#4b6cf7] border border-[#4b6cf7]/20 text-xs font-bold uppercase tracking-wider mb-4">
              <HelpCircle size={14} />
              <span>Support Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How can we help you?
            </h1>
            <p className="mt-3 text-base text-slate-500 max-w-xl mx-auto">
              Find answers to common questions, explore resources, or get in touch with our support team.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Resources */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Links</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {resources.map((r) => (
              <Link
                key={r.title}
                to={r.link}
                className="group p-5 rounded-2xl border border-slate-200 hover:border-[#4b6cf7]/30 hover:shadow-md transition-all bg-white"
              >
                <div className="w-10 h-10 rounded-xl bg-[#4b6cf7]/10 text-[#4b6cf7] flex items-center justify-center mb-3">
                  <r.icon size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{r.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#4b6cf7]">
                  Visit <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-slate-800 hover:text-[#4b6cf7] transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <span>{faq.q}</span>
                  <ChevronRight size={16} className="text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-3" />
                </summary>
                <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Contact Support</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="mailto:support@reticen8.com"
              className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 hover:border-[#4b6cf7]/30 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#4b6cf7]/10 text-[#4b6cf7] flex items-center justify-center flex-shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-0.5">Email Support</h3>
                <p className="text-xs text-slate-500">support@reticen8.com</p>
                <p className="text-xs text-slate-400 mt-1">We typically respond within 24 hours.</p>
              </div>
            </a>
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-[#4b6cf7]/10 text-[#4b6cf7] flex items-center justify-center flex-shrink-0">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-0.5">Community Forum</h3>
                <p className="text-xs text-slate-500">Connect with other learners and experts.</p>
                <p className="text-xs text-slate-400 mt-1">Coming soon.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}
