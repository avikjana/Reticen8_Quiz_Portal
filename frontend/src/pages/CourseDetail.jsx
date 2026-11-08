import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen, Clock, Users, Star, ArrowRight, CheckCircle2,
  ShieldCheck, Award, FileText, ChevronRight, Play, Terminal,
  HelpCircle, Lock, Download, Check, Sparkles, ChevronDown
} from 'lucide-react'
import Navbar from '../components/Navbar'
import AnnouncementBar from '../components/AnnouncementBar'
import Footer from '../components/Footer'
import { coursesData } from '../data/courses'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Find course or default to first
  const course = coursesData.find((c) => c.id === id) || coursesData[0]

  const [activeTab, setActiveTab] = useState('curriculum') // 'curriculum' | 'objectives' | 'instructor'
  const [expandedModules, setExpandedModules] = useState({ 'mod-1': true, 'mod-2': true })

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }))
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AnnouncementBar />
      <Navbar />

      {/* Course Hero Banner */}
      <section className="bg-slate-900 text-white pt-10 pb-16 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[350px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumb navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <ChevronRight size={13} />
            <Link to="/courses" className="hover:text-emerald-400 transition-colors">Courses</Link>
            <ChevronRight size={13} />
            <span className="text-slate-200 truncate max-w-xs">{course.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Header Info */}
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  {course.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {course.difficulty} Level
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-400 border border-blue-800/80 flex items-center gap-1">
                  <Award size={13} />
                  <span>Aligned with {course.certificationCode}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {course.title}
              </h1>

              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                {course.description}
              </p>

              {/* Meta metrics */}
              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star size={16} className="fill-amber-400" />
                  <span>{course.rating} / 5.0</span>
                  <span className="text-slate-400 font-normal">({course.studentsCount.toLocaleString()} enrolled)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-slate-400" />
                  <span>{course.duration} ({course.estimatedWeeks})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen size={16} className="text-slate-400" />
                  <span>{course.modulesCount} Modules • {course.lessonsCount} Hands-On Labs</span>
                </div>
              </div>

              {/* Instructor Bio Snippet */}
              <div className="mt-6 pt-6 border-t border-slate-800 flex items-center gap-3.5">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/50"
                />
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Created by</span>
                  <span className="text-sm font-bold text-white block">{course.instructor.name}</span>
                  <span className="text-xs text-emerald-400">{course.instructor.role}</span>
                </div>
              </div>
            </div>

            {/* Right Sticky Enrollment Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl text-slate-900 sticky top-24">
                <div className="aspect-video rounded-xl bg-slate-900 relative overflow-hidden mb-5 group cursor-pointer"
                  onClick={() => navigate(`/learn/${course.id}`)}
                >
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&h=350&q=80"
                    alt="Course Preview"
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={24} className="ml-1 fill-white" />
                    </div>
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-white text-[11px] font-mono">
                    Preview Sandbox
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-slate-900">Included in Academy</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-[#15803D]">
                      Free Access
                    </span>
                  </div>

                  <Link
                    to={`/learn/${course.id}`}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-center font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>Launch Learning Player &amp; Labs</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600 font-medium">
                    <p className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">This course includes:</p>
                    <div className="flex items-center gap-2"><Terminal size={15} className="text-[#16A34A]" /> Full Access to Cloud Sandbox CLI</div>
                    <div className="flex items-center gap-2"><BookOpen size={15} className="text-[#16A34A]" /> {course.modulesCount} Detailed Curriculum Modules</div>
                    <div className="flex items-center gap-2"><Award size={15} className="text-[#16A34A]" /> Reticen8 Verifiable Digital Credential</div>
                    <div className="flex items-center gap-2"><FileText size={15} className="text-[#16A34A]" /> Official Exam Blueprint &amp; Practice Quizzes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Detailed Tabs */}
      <section className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          <div className="lg:col-span-8">
            {/* Tabs Selector */}
            <div className="flex border-b border-slate-200 gap-6 mb-8">
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`pb-3.5 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'curriculum'
                    ? 'border-[#16A34A] text-[#16A34A]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Curriculum &amp; Syllabus ({course.modulesCount} Modules)
              </button>
              <button
                onClick={() => setActiveTab('objectives')}
                className={`pb-3.5 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'objectives'
                    ? 'border-[#16A34A] text-[#16A34A]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Learning Objectives &amp; Skills
              </button>
              <button
                onClick={() => setActiveTab('instructor')}
                className={`pb-3.5 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'instructor'
                    ? 'border-[#16A34A] text-[#16A34A]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Instructor
              </button>
            </div>

            {/* TAB: Curriculum */}
            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                  <span>{course.modulesCount} Modules • {course.lessonsCount} Total Activities</span>
                  <button
                    onClick={() => {
                      const all = {}
                      course.curriculum.forEach((m) => { all[m.id] = true })
                      setExpandedModules(all)
                    }}
                    className="text-[#16A34A] font-bold hover:underline"
                  >
                    Expand All Modules
                  </button>
                </div>

                {course.curriculum.map((module) => {
                  const isExpanded = expandedModules[module.id]
                  return (
                    <div
                      key={module.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs"
                    >
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <ChevronDown
                            size={18}
                            className={`text-slate-400 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                          <h3 className="text-sm font-bold text-slate-900">{module.title}</h3>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {module.duration} ({module.lessons.length} lessons)
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-slate-100 px-6 py-2">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="py-3 flex items-center justify-between gap-4 text-xs"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.type === 'video' ? (
                                  <Play size={14} className="text-slate-400" />
                                ) : lesson.type === 'lab' ? (
                                  <Terminal size={14} className="text-[#16A34A]" />
                                ) : (
                                  <HelpCircle size={14} className="text-blue-500" />
                                )}
                                <span className="font-medium text-slate-700">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-400 font-mono">{lesson.duration}</span>
                                <Link
                                  to={`/learn/${course.id}`}
                                  className="text-xs font-bold text-[#16A34A] hover:underline"
                                >
                                  Start Lab
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* TAB: Learning Objectives */}
            {activeTab === 'objectives' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">What You Will Master</h3>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {course.skills.map((skill) => (
                      <div key={skill} className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-[#16A34A] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Prerequisites &amp; Requirements</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Basic knowledge of IP networking (IPv4 addressing, standard subnets) is recommended. No prior hands-on experience with Reticen8 equipment is required; all technical commands and device architecture are explained from first principles inside our virtual lab sandbox.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: Instructor */}
            {activeTab === 'instructor' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-md"
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{course.instructor.name}</h3>
                  <p className="text-sm font-semibold text-[#16A34A] mt-0.5">{course.instructor.role}</p>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    Dr. Chen has designed and validated network security topologies for Fortune 100 enterprise datacenters and government critical infrastructure. With over 15 years of technical experience in perimeter firewall defense, she leads technical curriculum development at Reticen8 Academy.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
