import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Award, ExternalLink, BookOpen, ChevronRight, ShieldCheck } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useApi from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import { PageSpinner, ErrorState } from '../components/ui/DataState'

export default function MyCertificates() {
  const { user } = useAuth()
  const { data: certificates, loading, error, reload } = useApi('/certificates')

  if (loading) return <><Navbar /><PageSpinner /></>
  if (error) return <><Navbar /><div className="max-w-4xl mx-auto px-4 py-20"><ErrorState message={error.message} onRetry={reload} /></div></>

  const certs = certificates || []

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <section className="bg-white border-b border-slate-200/80 pt-10 pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4">
            <Link to="/" className="hover:text-[#4b6cf7] transition-colors">Home</Link>
            <ChevronRight size={13} className="text-slate-400" />
            <span className="text-slate-900 font-semibold">My Certificates</span>
          </nav>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Award size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Certificates</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {certs.length > 0
                  ? `${certs.length} certificate${certs.length > 1 ? 's' : ''} earned`
                  : 'Complete courses to earn certificates'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
        {certs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-5">
              <Award size={36} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">No certificates yet</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Complete all modules in a course to earn your certificate. Each certificate includes a unique credential ID for verification.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4b6cf7] hover:bg-[#3b5ce6] text-white text-sm font-bold rounded-xl transition-colors shadow-md"
            >
              <BookOpen size={16} />
              <span>Browse Courses</span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {certs.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-lg">
                        {cert.badge || '🏆'}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">{cert.courseTitle}</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">{cert.certificationTitle}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      cert.status?.startsWith('ACTIVE')
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cert.status?.startsWith('ACTIVE') ? 'Active' : cert.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 rounded-lg px-3 py-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credential ID</p>
                      <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">{cert.credentialId}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg px-3 py-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Issued</p>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">{cert.issueDate}</p>
                    </div>
                  </div>

                  {cert.certificationCode && (
                    <div className="flex items-center gap-1.5 mb-4">
                      <ShieldCheck size={13} className="text-[#4b6cf7]" />
                      <span className="text-[11px] font-semibold text-slate-600">
                        Certification: <span className="text-slate-900">{cert.certificationCode}</span>
                      </span>
                    </div>
                  )}

                  <Link
                    to={`/certificate/${cert.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#4b6cf7] hover:bg-[#3b5ce6] text-white text-xs font-bold transition-colors"
                  >
                    <ExternalLink size={13} />
                    <span>View Certificate</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
