import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Printer } from 'lucide-react'
import useApi from '../hooks/useApi'
import { PageSpinner, ErrorState } from '../components/ui/DataState'

export default function CertificateView() {
  const { id } = useParams()
  const { data: cert, loading, error, reload } = useApi(id ? `/certificates/${encodeURIComponent(id)}` : null)

  if (loading) return <PageSpinner />
  if (error) return <div className="max-w-4xl mx-auto px-4 py-20"><ErrorState message={error.message} onRetry={reload} /></div>
  if (!cert) return <div className="max-w-4xl mx-auto px-4 py-20"><ErrorState message="Certificate not found." /></div>

  const handlePrint = () => window.print()

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      {/* Controls — hidden when printing */}
      <div className="print:hidden sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/my-certificates"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>My Certificates</span>
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4b6cf7] hover:bg-[#3b5ce6] text-white text-sm font-bold rounded-xl transition-colors shadow-md"
          >
            <Download size={15} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Certificate */}
      <div className="max-w-4xl mx-auto px-4 py-10 print:p-0 print:max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl print:rounded-none shadow-xl print:shadow-none overflow-hidden"
        >
          {/* Outer decorative border */}
          <div className="p-3 sm:p-5 print:p-4">
            <div className="border-[3px] border-slate-800 p-2 sm:p-3 print:p-2">
              <div className="border border-slate-300 p-6 sm:p-10 md:p-14 print:p-10">

                {/* Header */}
                <div className="text-center mb-8 print:mb-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#4b6cf7]" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                    <h2 className="text-lg sm:text-xl font-bold tracking-[0.15em] text-slate-700 uppercase">
                      Reticen8 Academy
                    </h2>
                  </div>
                  <div className="w-24 h-px bg-slate-300 mx-auto mb-5" />
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wide">
                    Certificate of Completion
                  </h1>
                </div>

                {/* Body */}
                <div className="text-center mb-10 print:mb-8">
                  <p className="text-sm text-slate-500 mb-3 italic">This is to certify that</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3 border-b-2 border-slate-200 pb-3 inline-block px-8">
                    {cert.candidateName}
                  </p>
                  <p className="text-sm text-slate-500 mt-4 mb-2 italic">has successfully completed the course</p>
                  <p className="text-lg sm:text-xl font-bold text-[#4b6cf7] mb-1">
                    {cert.courseTitle}
                  </p>
                  {cert.certificationTitle && (
                    <p className="text-sm font-semibold text-slate-600">
                      {cert.certificationTitle} ({cert.certificationCode})
                    </p>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-10 print:mb-8 text-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Credential ID</p>
                    <p className="text-sm font-mono font-bold text-slate-800">{cert.credentialId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date Issued</p>
                    <p className="text-sm font-semibold text-slate-800">{cert.issueDate}</p>
                  </div>
                  {cert.expirationDate && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Valid Until</p>
                      <p className="text-sm font-semibold text-slate-800">{cert.expirationDate}</p>
                    </div>
                  )}
                </div>

                {/* Seal and signature */}
                <div className="flex items-end justify-between pt-6 border-t border-slate-200">
                  {/* Signature left */}
                  <div className="text-center flex-1">
                    <div className="w-32 border-b border-slate-400 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-slate-700">Program Director</p>
                    <p className="text-[10px] text-slate-500">Reticen8 Academy</p>
                  </div>

                  {/* Seal */}
                  <div className="flex-shrink-0 mx-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-amber-400 flex items-center justify-center bg-amber-50/50 relative">
                      <div className="text-center">
                        <div className="text-amber-600 text-lg sm:text-xl">🏆</div>
                        <p className="text-[8px] sm:text-[9px] font-black text-amber-700 uppercase tracking-wider leading-tight">
                          Verified
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Signature right */}
                  <div className="text-center flex-1">
                    <div className="w-32 border-b border-slate-400 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-slate-700">Head of Training</p>
                    <p className="text-[10px] text-slate-500">Reticen8 Academy</p>
                  </div>
                </div>

                {/* Verification footer */}
                <div className="mt-8 print:mt-6 text-center">
                  <p className="text-[10px] text-slate-400">
                    Verify this certificate at{' '}
                    <span className="font-mono font-semibold text-slate-600">
                      {window.location.origin}/certifications
                    </span>
                    {' '}using credential ID{' '}
                    <span className="font-mono font-semibold text-slate-600">{cert.credentialId}</span>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: landscape; margin: 0.5in; }
        }
      `}</style>
    </div>
  )
}
