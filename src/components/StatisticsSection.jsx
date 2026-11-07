import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { statistics } from '../data/statistics'

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
    <div className="flex flex-col items-center justify-center text-center px-4 py-8 sm:py-10">
      <div className="text-3xl sm:text-4xl lg:text-[2.75rem] font-light tracking-tight text-slate-900 leading-none">
        {count.toLocaleString()}
        <span className="text-[#16A34A] font-normal">{stat.suffix}</span>
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

  return (
    <section ref={ref} className="bg-white border-y border-slate-100/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {statistics.map((stat) => (
            <div key={stat.id}>
              <StatItem stat={stat} started={inView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
