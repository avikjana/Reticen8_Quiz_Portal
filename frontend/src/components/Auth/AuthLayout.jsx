import { Link } from 'react-router-dom'
import { CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react'
import AnnouncementBar from '../AnnouncementBar'
import Navbar from '../Navbar'
import Footer from '../Footer'

const PHOTOS = {
  tall: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=800&q=75',
  top: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&h=420&q=75',
  bottom: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&h=420&q=75',
}

function Photo({ src, className }) {
  return (
    <div className={`theme-fixed relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 shadow-[var(--shadow-lift)] ring-1 ring-slate-900/5 ${className}`}>
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={(e) => (e.currentTarget.style.display = 'none')}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

/**
 * Shared shell for the account pages (Login, Sign Up, Forgot Password):
 * the normal site header/footer, a light hero-style background, an info
 * panel on the left (desktop only) and the form card on the right.
 */
export default function AuthLayout({
  eyebrow = 'Reticen8 Academy',
  title = 'Build your skills. Build your future.',
  subtitle = 'Sign in to continue your cybersecurity learning journey.',
  points = ['Hands-on firewall labs', 'Certification-aligned courses', 'Track your progress'],
  children,
}) {
  const [first, ...rest] = title.split('. ')
  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />

      <main id="main-content" className="relative isolate flex-1 overflow-hidden">
        {/* Background: soft glows + dot grid, like the home hero */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-32 w-[34rem] h-[34rem] rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute top-1/3 -left-40 w-[28rem] h-[28rem] rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <Link
            to="/"
            className="lg:hidden inline-flex items-center gap-1.5 mb-5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>

          <div className="grid lg:grid-cols-12 gap-10 xl:gap-16 items-center">
            {/* Left: info panel (desktop) */}
            <section className="hidden lg:block lg:col-span-6 xl:col-span-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-brand-700 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} />
                {eyebrow}
              </div>
              <h1 className="mt-5 text-4xl xl:text-5xl font-bold text-slate-900 tracking-tight leading-[1.08]">
                {rest.length ? (
                  <>
                    {first}.
                    <br />
                    <span className="text-gradient">{rest.join('. ')}</span>
                  </>
                ) : (
                  title
                )}
              </h1>
              <p className="mt-5 text-base text-slate-600 leading-relaxed max-w-lg">{subtitle}</p>

              <ul className="mt-6 space-y-2.5">
                {points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                    <CheckCircle2 size={17} className="text-brand-600 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>

              {/* Photo collage */}
              <div className="mt-10 grid grid-cols-12 gap-4 items-center max-w-xl">
                <Photo src={PHOTOS.tall} className="col-span-5 h-64 xl:h-72 rounded-[28px]" />
                <div className="col-span-7 space-y-4">
                  <Photo src={PHOTOS.top} className="h-[120px] xl:h-[136px] rounded-3xl" />
                  <Photo src={PHOTOS.bottom} className="h-[120px] xl:h-[136px] rounded-3xl" />
                </div>
              </div>
            </section>

            {/* Right: form card */}
            <section className="lg:col-span-6 xl:col-span-5 w-full">{children}</section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
