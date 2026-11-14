import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import useApi from '../hooks/useApi'

function useCounter(target, duration = 1800, started = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    const startTime = performance.now()
    const step = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(target)
    }
    requestAnimationFrame(step)
  }, [target, duration, started])

  return count
}

function StatItem({ stat, started }) {
  const count = useCounter(stat.value, 1800, started)

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-3 sm:px-4 py-7 sm:py-10 bg-white transition-colors hover:bg-emerald-50/40">
      <div className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-slate-900 leading-none tabular-nums">
        {count.toLocaleString()}
        <span className="text-brand-600 font-normal">{stat.suffix}</span>
      </div>
      <div className="mt-3 text-sm font-semibold text-slate-700">
        {stat.label}
      </div>
      <div className="mt-1 text-xs text-slate-400 font-normal max-w-[170px] leading-snug">
        {stat.description}
      </div>
    </div>
  )
}

export default function StatisticsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const { data, loading } = useApi('/statistics')
  const statistics = data || []

  // Nothing to show if the numbers couldn't be loaded — hide the strip
  // rather than display zeros. (The section stays mounted for useInView.)
  const empty = !loading && statistics.length === 0

  return (
    <section ref={ref} className={`relative bg-white py-6 sm:py-10 ${empty ? 'hidden' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-5 gap-px bg-slate-200/70 rounded-3xl overflow-hidden ring-1 ring-slate-200/70 shadow-[var(--shadow-soft)]">
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`${i === 4 ? 'col-span-2' : ''} ${i < 3 ? 'md:col-span-2' : 'md:col-span-3'} lg:col-span-1 bg-white py-10 flex flex-col items-center gap-3 animate-pulse`}>
                <span className="h-8 w-20 rounded bg-slate-200/80" />
                <span className="h-3 w-28 rounded bg-slate-100" />
              </div>
            ))}
          {statistics.map((stat, i) => (
            <div
              key={stat.id}
              className={`${
                i === statistics.length - 1 && statistics.length % 2 === 1 ? 'col-span-2' : ''
              } ${i < 3 ? 'md:col-span-2' : 'md:col-span-3'} lg:col-span-1`}
            >
              <StatItem stat={stat} started={inView && !loading} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
