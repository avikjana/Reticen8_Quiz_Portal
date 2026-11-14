import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, SlidersHorizontal, BookOpen, Clock, Users,
  Star, ArrowRight, Check, X, LayoutGrid, List, Sparkles,
  Shield, Award, GraduationCap, ChevronRight
} from 'lucide-react'
import Navbar from '../components/Navbar'
import AnnouncementBar from '../components/AnnouncementBar'
import Footer from '../components/Footer'
import { coursesData } from '../data/courses'

const categories = [
  'All Categories',
  'Network Security',
  'Firewall Administration',
  'Threat Defense',
  'Architecture & Cloud',
]

const difficulties = ['All Difficulties', 'Beginner', 'Intermediate', 'Advanced', 'Expert']

const sortOptions = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Course Duration (Shortest)', value: 'duration-asc' },
  { label: 'Course Duration (Longest)', value: 'duration-desc' },
]

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Difficulties')
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    return coursesData
      .filter((course) => {
        const matchesSearch =
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesCategory =
          selectedCategory === 'All Categories' || course.category === selectedCategory

        const matchesDifficulty =
          selectedDifficulty === 'All Difficulties' || course.difficulty === selectedDifficulty

        return matchesSearch && matchesCategory && matchesDifficulty
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.studentsCount - a.studentsCount
        if (sortBy === 'rating') return b.rating - a.rating
        if (sortBy === 'duration-asc') return parseInt(a.duration) - parseInt(b.duration)
        if (sortBy === 'duration-desc') return parseInt(b.duration) - parseInt(a.duration)
        return 0
      })
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All Categories')
    setSelectedDifficulty('All Difficulties')
    setSortBy('popular')
    setSearchParams({})
  }

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All Categories' ||
    selectedDifficulty !== 'All Difficulties'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AnnouncementBar />
      <Navbar />

      {/* Course Catalog Hero */}
      <section className="bg-white border-b border-slate-200/80 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4">
            <Link to="/" className="hover:text-[#16A34A] transition-colors">Home</Link>
            <ChevronRight size={13} className="text-slate-400" />
            <span className="text-slate-900 font-semibold">Explore Courses</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-[#15803D] text-xs font-bold uppercase tracking-wider mb-3">
              <GraduationCap size={14} />
              <span>Technical Training Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Master Enterprise Firewall &amp; Security Engineering
            </h1>
            <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Industry-aligned learning paths with guided virtual sandbox labs, official certification blueprints, and practical firewall troubleshooting.
            </p>
          </div>

          {/* Quick Search & Filter Controls */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-3.5">
            <div className="relative md:col-span-6 lg:col-span-7">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, keyword, or firewall feature (e.g. App-ID, NAT, IPS, VPN)..."
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="md:col-span-3 lg:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 shadow-xs cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort by: {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 lg:col-span-2 flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 h-10 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid layout"
              >
                <LayoutGrid size={15} />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 h-10 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List layout"
              >
                <List size={16} />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Body */}
      <section className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar Filters */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-3xl ring-1 ring-slate-200/80 p-4 sm:p-5 shadow-[var(--shadow-soft)] lg:sticky lg:top-24 space-y-4 lg:space-y-6">
              <div className="flex items-center justify-between pb-3 lg:pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Filter size={16} className="text-[#16A34A]" />
                  <span>Filter Courses</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-semibold text-[#16A34A] hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Difficulty Filter */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Difficulty Level
                </h4>
                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap lg:block lg:space-y-2">
                  {difficulties.map((diff) => (
                    <label
                      key={diff}
                      className={`flex flex-shrink-0 items-center gap-2 lg:gap-2.5 text-sm cursor-pointer select-none whitespace-nowrap rounded-full px-3 py-1.5 ring-1 lg:rounded-none lg:p-0 lg:ring-0 transition-colors ${
                        selectedDifficulty === diff
                          ? 'bg-emerald-50 ring-emerald-300 text-[#15803D] font-semibold lg:bg-transparent lg:text-slate-900'
                          : 'ring-slate-200 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        checked={selectedDifficulty === diff}
                        onChange={() => setSelectedDifficulty(diff)}
                        className="w-4 h-4 accent-[#16A34A] max-lg:sr-only"
                      />
                      <span>{diff}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Certifications Shortcut Banner */}
              <div className="hidden lg:block p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Award size={15} />
                  <span>Exam Blueprints</span>
                </div>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  Looking to take an official proctored examination? View the certification ladder.
                </p>
                <Link
                  to="/certifications"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-300 hover:text-white"
                >
                  <span>Certifications Portal</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Main Courses Listing */}
          <main className="lg:col-span-9">
            {/* Results counter & active pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="text-sm font-semibold text-slate-700">
                Showing <strong className="text-slate-900">{filteredCourses.length}</strong> {filteredCourses.length === 1 ? 'course' : 'courses'}
              </span>

              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2">
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-medium">
                      Keyword: "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="hover:text-slate-900"><X size={12} /></button>
                    </span>
                  )}
                  {selectedCategory !== 'All Categories' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-medium">
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory('All Categories')} className="hover:text-slate-900"><X size={12} /></button>
                    </span>
                  )}
                  {selectedDifficulty !== 'All Difficulties' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-medium">
                      {selectedDifficulty}
                      <button onClick={() => setSelectedDifficulty('All Difficulties')} className="hover:text-slate-900"><X size={12} /></button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
                  <Search size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No courses match your criteria</h3>
                <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                  Try adjusting your search terms or clearing some filters to explore other cybersecurity paths.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803D] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid Layout */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((course, idx) => (
                  <motion.article
                    key={course.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="flex flex-col bg-white rounded-3xl ring-1 ring-slate-200/80 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] hover:ring-slate-300 transition-shadow duration-300 overflow-hidden"
                  >
                    {/* Header Strip */}
                    <div className="p-6 pb-4 flex items-start justify-between gap-3">
                      <span className="text-2xl">{course.badge}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {course.category}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          course.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          course.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          course.difficulty === 'Advanced' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          {course.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="px-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-slate-900 hover:text-[#16A34A] transition-colors leading-snug">
                        <Link to={`/courses/${course.id}`}>{course.title}</Link>
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {course.shortDesc}
                      </p>

                      {/* Instructor & Rating */}
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <img
                            src={course.instructor.avatar}
                            alt={course.instructor.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-medium text-slate-700">{course.instructor.name}</span>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-amber-600">
                          <Star size={13} className="fill-amber-500 text-amber-500" />
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {course.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="px-2 py-0.5 rounded-md bg-slate-50 text-[11px] font-medium text-slate-600 border border-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><BookOpen size={13} />{course.modulesCount} Modules</span>
                        <span className="flex items-center gap-1"><Clock size={13} />{course.duration}</span>
                      </div>
                      <Link
                        to={`/courses/${course.id}`}
                        className="inline-flex items-center gap-1 font-bold text-[#16A34A] hover:text-emerald-800"
                      >
                        <span>View Syllabus</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              /* List Layout */
              <div className="space-y-4">
                {filteredCourses.map((course, idx) => (
                  <motion.article
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className="bg-white rounded-3xl ring-1 ring-slate-200/80 p-5 sm:p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] transition-shadow duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{course.badge}</span>
                        <span className="text-xs font-bold text-slate-500 uppercase">{course.category}</span>
                        <span className="text-slate-300">•</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          course.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700' :
                          course.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-700' :
                          course.difficulty === 'Advanced' ? 'bg-amber-50 text-amber-700' :
                          'bg-purple-50 text-purple-700'
                        }`}>
                          {course.difficulty}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 hover:text-[#16A34A] transition-colors">
                        <Link to={`/courses/${course.id}`}>{course.title}</Link>
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-1">
                        {course.shortDesc}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1 text-amber-600 font-bold">
                          <Star size={13} className="fill-amber-500 text-amber-500" />
                          {course.rating} ({course.studentsCount.toLocaleString()} learners)
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><BookOpen size={13} /> {course.modulesCount} Modules</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock size={13} /> {course.duration}</span>
                        <span>•</span>
                        <span className="text-slate-700 font-semibold">Taught by {course.instructor.name}</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-3">
                      <Link
                        to={`/courses/${course.id}`}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Syllabus
                      </Link>
                      <Link
                        to={`/learn/${course.id}`}
                        className="px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <span>Start Learning</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </main>

        </div>
      </section>

      <Footer />
    </div>
  )
}
