import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award, ShieldCheck, CheckCircle2, FileText, ArrowRight,
  Clock, DollarSign, Calendar, ChevronRight, Download, Search,
  Check, Sparkles, AlertCircle, X, Shield, ExternalLink
} from 'lucide-react'
import Navbar from '../components/Navbar'
import AnnouncementBar from '../components/AnnouncementBar'
import Footer from '../components/Footer'
import { certificationsData } from '../data/certifications'

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState(certificationsData[0])
  const [verifyId, setVerifyId] = useState('')
  const [verificationResult, setVerificationResult] = useState(null)
  const [showCertModal, setShowCertModal] = useState(false)

  const handleVerify = (e) => {
    e.preventDefault()
    if (!verifyId.trim()) return

    setVerificationResult({
      status: 'VERIFIED',
      candidateName: 'Avik Jana',
      credentialName: 'Reticen8 Certified Firewall Professional (RCFP)',
      credentialId: verifyId.trim().toUpperCase(),
      issueDate: 'October 14, 2026',
      expirationDate: 'October 14, 2029',
      score: '890 / 1000',
    })
    setShowCertModal(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AnnouncementBar />
      <Navbar />

      {/* Certifications Hero */}
      <section className="bg-slate-900 text-white pt-10 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] max-w-[90vw] h-[300px] bg-emerald-600/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <ChevronRight size={13} />
            <span className="text-slate-200">Certifications &amp; Credentials</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
              <Award size={14} />
              <span>Industry-Standard Credentials</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Validate Your Firewall Expertise.{' '}
              <span className="text-emerald-400">Advance Your Career.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Reticen8 professional certifications demonstrate hands-on mastery in enterprise network security, next-generation firewall operations, and zero-trust architecture.
            </p>
          </div>
        </div>
      </section>

      {/* Career Progression Pathway Ladder */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">
              Certification Hierarchy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Your Professional Career Pathway
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Step-by-step accreditation ladder designed for every stage of your security career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificationsData.map((c, i) => (
              <div
                key={c.id}
                className="relative bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-[#16A34A] hover:bg-white hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold font-mono text-slate-400">0{i + 1} / 04</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700">
                      {c.level}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs mb-3">
                    {c.badge}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{c.code}</h3>
                  <p className="text-xs font-semibold text-[#16A34A] mt-0.5">{c.title}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{c.roleTag}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">{c.examDuration}</span>
                  <a
                    href={`#${c.id}`}
                    className="font-bold text-[#16A34A] hover:underline"
                  >
                    View Blueprint →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Exam Blueprints & Details */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Exam Blueprints &amp; Skill Domains
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Detailed breakdown of knowledge weightings tested in each proctored examination.
          </p>
        </div>

        <div className="space-y-10">
          {certificationsData.map((c) => (
            <div
              key={c.id}
              id={c.id}
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:shadow-md transition-all scroll-mt-24"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Cert Details */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center text-xl shadow-md">
                      {c.badge}
                    </div>
                    <div>
                      <span className="text-xs font-black tracking-widest text-[#16A34A] uppercase">{c.code}</span>
                      <h3 className="text-xl font-bold text-slate-900 leading-snug">{c.title}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {c.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-medium">Exam Format</span>
                      <span className="font-bold text-slate-800 mt-0.5 block">{c.examFormat}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-medium">Passing Score</span>
                      <span className="font-bold text-slate-800 mt-0.5 block">{c.passingScore}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-medium">Exam Length</span>
                      <span className="font-bold text-slate-800 mt-0.5 block">{c.examDuration} ({c.questionCount} Questions)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-medium">Voucher Fee</span>
                      <span className="font-bold text-[#16A34A] mt-0.5 block">{c.voucherCost}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <Link
                      to="/courses"
                      className="px-6 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] shadow-xs transition-colors"
                    >
                      Browse Prep Courses
                    </Link>
                    <button
                      onClick={() => {
                        setVerifyId(`R8-2026-${c.code}-7741`)
                        setVerificationResult({
                          status: 'VERIFIED',
                          candidateName: 'Avik Jana',
                          credentialName: c.title,
                          credentialId: `R8-2026-${c.code}-7741`,
                          issueDate: 'October 2026',
                          expirationDate: 'October 2029',
                          score: '910 / 1000',
                        })
                        setShowCertModal(true)
                      }}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                    >
                      <ShieldCheck size={14} className="text-[#16A34A]" />
                      <span>Sample Certificate</span>
                    </button>
                  </div>
                </div>

                {/* Right: Exam Blueprint Domain Weights */}
                <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-200/80 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exam Blueprint Breakdown</span>
                    <span className="text-xs text-slate-400 font-mono">100% Total</span>
                  </div>

                  <div className="space-y-3.5">
                    {c.examBlueprint.map((b) => (
                      <div key={b.domain} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>{b.domain}</span>
                          <span className="font-mono text-[#16A34A]">{b.weight}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-[#16A34A] rounded-full"
                            style={{ width: b.weight }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-xs text-slate-500">
                    <strong className="text-slate-800">Prerequisite Requirements:</strong> {c.prerequisites}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table Matrix */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Credentials Comparison Matrix
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Side-by-side technical requirements and examination format parameters.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Certification</th>
                  <th className="py-4 px-4">Level</th>
                  <th className="py-4 px-4">Duration</th>
                  <th className="py-4 px-4">Questions</th>
                  <th className="py-4 px-4">Passing Score</th>
                  <th className="py-4 px-4">Voucher Fee</th>
                  <th className="py-4 px-4">Recertification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {certificationsData.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{c.badge}</span>
                        <div>
                          <span className="block font-bold">{c.code}</span>
                          <span className="text-xs text-slate-500 font-normal">{c.title}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold">{c.level}</td>
                    <td className="py-4 px-4 font-mono">{c.examDuration}</td>
                    <td className="py-4 px-4 font-mono">{c.questionCount}</td>
                    <td className="py-4 px-4 font-mono text-emerald-700 font-bold">{c.passingScore}</td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">{c.voucherCost}</td>
                    <td className="py-4 px-4 text-slate-500">{c.validity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Verification Tool Section */}
      <section className="py-16 bg-slate-900 text-white relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <ShieldCheck size={26} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Verify a Candidate's Reticen8 Credential
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter a credential verification serial number to validate authenticity against our global registry.
          </p>

          <form onSubmit={handleVerify} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="text"
              value={verifyId}
              onChange={(e) => setVerifyId(e.target.value)}
              placeholder="e.g. R8-2026-RCFP-8492"
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-colors whitespace-nowrap"
            >
              Verify Credential
            </button>
          </form>

          <div className="mt-4 text-xs text-slate-500">
            Test serial: <code className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">R8-2026-RCFP-8492</code>
          </div>
        </div>
      </section>

      {/* Verified Certificate Modal */}
      <AnimatePresence>
        {showCertModal && verificationResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl relative border-4 border-emerald-600/30 text-slate-900"
            >
              <button
                onClick={() => setShowCertModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>

              <div className="text-center border-b border-slate-100 pb-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <ShieldCheck size={32} />
                </div>
                <span className="text-[11px] font-bold tracking-widest text-[#16A34A] uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  OFFICIALLY VERIFIED CREDENTIAL
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-3">
                  Certificate of Technical Competency
                </h3>
                <p className="text-xs text-slate-500 mt-1">Reticen8 Global Security Certification Board</p>
              </div>

              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider">This certifies that</p>
                <p className="text-2xl font-bold text-slate-900">{verificationResult.candidateName}</p>
                <p className="text-xs text-slate-500">has successfully mastered all testing domains and is certified as a</p>
                <p className="text-base font-extrabold text-[#16A34A]">{verificationResult.credentialName}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 grid grid-cols-2 gap-3 text-xs border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-medium">Credential ID</span>
                  <span className="font-mono font-bold text-slate-800">{verificationResult.credentialId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Passing Score</span>
                  <span className="font-mono font-bold text-emerald-700">{verificationResult.score}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Issued Date</span>
                  <span className="font-semibold text-slate-800">{verificationResult.issueDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Valid Through</span>
                  <span className="font-semibold text-slate-800">{verificationResult.expirationDate}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowCertModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                >
                  Close Verification
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
