import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Flame, Shield, CheckCircle2 } from 'lucide-react'

// Elegant wavy topographic line pattern in background (matching Cisco NetAcad)
function BackgroundWaves() {
  return (
    <svg
      className="absolute top-0 right-0 w-full h-full max-w-[1200px] pointer-events-none opacity-[0.25] text-slate-300"
      viewBox="0 0 1200 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M200 80 C 450 140, 750 -40, 1200 60"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M150 140 C 420 210, 780 40, 1200 130"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M100 200 C 400 280, 800 120, 1200 210"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M50 270 C 380 350, 820 190, 1200 290"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M0 350 C 350 430, 840 270, 1200 380"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M0 430 C 320 520, 860 360, 1200 470"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M0 520 C 300 610, 880 460, 1200 570"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  )
}

// Decorative blue wave symbol (matching bottom of Cisco composition)
function WaveGraphic() {
  return (
    <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center p-3 shadow-sm">
      <svg viewBox="0 0 40 40" className="w-full h-full text-sky-500" fill="none">
        <path d="M4 12 C 10 6, 18 18, 24 12 C 30 6, 36 14, 38 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M4 20 C 10 14, 18 26, 24 20 C 30 14, 36 22, 38 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M4 28 C 10 22, 18 34, 24 28 C 30 22, 36 30, 38 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

// Robust Image with beautiful photographic fallback
function PhotoCard({ src, alt, caption, className, fallbackColor = 'from-emerald-700 to-slate-900' }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className={`relative overflow-hidden bg-slate-100 shadow-xl ${className}`}>
      {/* Real image */}
      {!error && (
        <img
          src={src}
          alt={alt}
          loading="eager"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Styled vector illustration fallback if offline or loading */}
      {(!loaded || error) && (
        <div className={`absolute inset-0 bg-gradient-to-br ${fallbackColor} p-6 flex flex-col justify-end text-white`}>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Reticen8</span>
          <p className="text-base font-bold leading-tight mt-0.5">{caption}</p>
        </div>
      )}

      {/* Subtle bottom shadow vignette for contrast */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative bg-white pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      {/* Background undulating wave patterns */}
      <BackgroundWaves />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hot Job Market Banner Pill (exact Cisco style) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200/90 shadow-2xs text-xs sm:text-sm text-slate-700 hover:border-slate-300 transition-colors">
            <span className="flex items-center gap-1.5 font-bold text-amber-600">
              <Flame size={16} className="fill-amber-500 text-amber-500" />
              The cybersecurity job market is hot!
            </span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-600">
              See why 12,000+ engineers began their journey with our{' '}
              <Link to="/courses" className="text-[#16A34A] font-semibold underline underline-offset-2 hover:text-emerald-700">
                free Intro to Network Security course
              </Link>
            </span>
          </div>
        </motion.div>

        {/* 2-Column Hero: Clean Typography Left, Asymmetric Images Right */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left: Typography & CTAs (Cisco style light/regular clean text) */}
          <div className="lg:col-span-6 xl:col-span-6">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl xl:text-[3.5rem] font-light text-slate-900 tracking-tight leading-[1.12]"
            >
              Build your skills.
              <br />
              <span className="font-normal text-slate-900">Build your future.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal"
            >
              Free online courses. In-person learning. Certification-aligned pathways designed to help you stand out in the job market. From Next-Generation Firewalls and Threat Prevention to VPN Architectures and Security Operations, it's all here.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-4 text-sm sm:text-base text-slate-700 font-medium"
            >
              Are you ready to begin, change, or propel your career?
            </motion.p>

            {/* CTAs: Clean rounded-full pill buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] shadow-md shadow-emerald-700/20 transition-all duration-150"
              >
                <span>Start Learning</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-semibold text-[#16A34A] bg-white border-2 border-[#16A34A] hover:bg-emerald-50 active:scale-[0.98] transition-all duration-150"
              >
                Explore Subjects
              </Link>
            </motion.div>

            {/* Micro badges below buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[#16A34A]" />
                Professional Training
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[#16A34A]" />
                Practical Learning
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[#16A34A]" />
                Industry-Focused Certification
              </span>
            </motion.div>
          </div>

          {/* Right: Cisco 3-Image Composition */}
          <div className="lg:col-span-6 xl:col-span-6 relative">
            <div className="relative max-w-[580px] mx-auto lg:ml-auto">

              {/* Decorative dot matrix grid */}
              <div
                className="absolute -left-6 bottom-16 w-24 h-24 opacity-30 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #64748B 1.5px, transparent 1.5px)',
                  backgroundSize: '12px 12px',
                }}
              />

              {/* Two columns of rounded image cards */}
              <div className="grid grid-cols-12 gap-4 items-center">

                {/* Left Card: Tall vertical card of Indian female engineer */}
                <div className="col-span-5 sm:col-span-5">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <PhotoCard
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&h=950&q=80"
                      alt="Cybersecurity Engineer configuring firewall console"
                      caption="Network Security Specialist"
                      className="h-[380px] sm:h-[430px] rounded-[32px]"
                      fallbackColor="from-emerald-700 via-teal-800 to-slate-900"
                    />
                  </motion.div>
                </div>

                {/* Right Column: Two stacked cards */}
                <div className="col-span-7 sm:col-span-7 space-y-4">
                  {/* Top card: Collaborating engineers */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                  >
                    <PhotoCard
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&h=550&q=80"
                      alt="Engineers collaborating in modern tech office"
                      caption="Collaborative NOC Environment"
                      className="h-[185px] sm:h-[210px] rounded-[28px]"
                      fallbackColor="from-slate-800 via-blue-900 to-indigo-950"
                    />
                  </motion.div>

                  {/* Bottom card: Remote engineer with headset */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                  >
                    <PhotoCard
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&h=550&q=80"
                      alt="Technical training and remote firewall lab"
                      caption="Technical Training Environment"
                      className="h-[185px] sm:h-[210px] rounded-[28px]"
                      fallbackColor="from-amber-700 via-orange-800 to-slate-900"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Decorative wave graphic at bottom-right (matching Cisco's blue wave badge) */}
              <div className="absolute -bottom-6 -left-6 hidden sm:block">
                <WaveGraphic />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
