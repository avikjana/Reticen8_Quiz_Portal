import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass } from 'lucide-react'
import { CourseCard } from './CourseCard'
import { coursesData as learningPaths } from '../data/courses'

export default function LearningPaths() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-[#F8FAFC] to-white" id="learning-paths">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/60 text-[#15803D] text-xs font-bold uppercase tracking-wider mb-3">
            <Compass size={14} />
            <span>Structured Curriculum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Explore Your Learning Journey
          </h2>
          <p className="mt-4 text-base text-slate-500 leading-relaxed font-normal">
            Build your technical expertise through structured cybersecurity learning paths designed for beginners to seasoned enterprise architects.
          </p>
        </motion.div>

        {/* 4 Cards Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
          {learningPaths.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:border-[#16A34A] hover:text-[#16A34A] hover:shadow-md transition-all"
          >
            <span>View All Courses &amp; Modules</span>
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
