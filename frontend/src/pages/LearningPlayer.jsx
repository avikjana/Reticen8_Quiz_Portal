import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, CheckCircle2, Circle, Play, Terminal,
  BookOpen, HelpCircle, FileText, Check, ChevronDown, ChevronRight,
  Maximize2, Minimize2, RotateCcw, Send, Download, Sparkles, MessageSquare,
  Shield, Volume2, Info, Menu, X, Copy
} from 'lucide-react'
import { coursesData } from '../data/courses'

export default function LearningPlayer() {
  const { id } = useParams()
  const navigate = useNavigate()

  const course = coursesData.find((c) => c.id === id) || coursesData[0]

  // Flatten lessons for easy navigation
  const allLessons = course.curriculum.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title }))
  )

  const [currentLessonIndex, setCurrentLessonIndex] = useState(2) // Default to 3rd lesson (Hands-on lab)
  const [completedLessonIds, setCompletedLessonIds] = useState(['l-1', 'l-2'])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('instructions') // 'instructions' | 'notes' | 'discussion'
  const [terminalView, setTerminalView] = useState('cli') // 'cli' | 'topology' | 'rules'
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalLogs, setTerminalLogs] = useState([
    'Reticen8 Next-Gen Firewall OS v7.4.2-LTS',
    'System ready. Type "help" or "show firewall policy" to begin.',
    'Session authenticated: admin@reticen8-ngfw-01 (IP: 192.168.1.1)',
  ])
  const [userNotes, setUserNotes] = useState(
    'Key concept: Stateful inspection maintains a state table to track active TCP 3-way handshakes.\n- Inbound traffic matching existing outbound sessions is automatically allowed.'
  )
  const [copiedCmd, setCopiedCmd] = useState(null)

  const currentLesson = allLessons[currentLessonIndex] || allLessons[0]
  const progressPercent = Math.round((completedLessonIds.length / allLessons.length) * 100)

  const toggleComplete = (lessonId) => {
    if (completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds((prev) => prev.filter((id) => id !== lessonId))
    } else {
      setCompletedLessonIds((prev) => [...prev, lessonId])
    }
  }

  const handleNext = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      if (!completedLessonIds.includes(currentLesson.id)) {
        setCompletedLessonIds((prev) => [...prev, currentLesson.id])
      }
      setCurrentLessonIndex(currentLessonIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
    }
  }

  const runCommand = (cmdToRun) => {
    const cmd = (cmdToRun || terminalInput).trim().toLowerCase()
    if (!cmd) return

    let response = `Command not recognized: "${cmd}". Type "help" for valid options.`
    if (cmd === 'help') {
      response = 'Available commands: show firewall policy, show interfaces, verify, set rule 101 allow, commit, clear'
    } else if (cmd.includes('show firewall policy')) {
      response = 'ID  NAME             ACTION  SRC-ZONE  DST-ZONE  APP-ID\n1   WAN-to-LAN-Web   ALLOW   WAN       LAN       HTTPS/TLS1.3\n2   Threat-Deny-C2   DENY    WAN       LAN       Malware/Botnet\n3   Default-Deny     DENY    ANY       ANY       ANY'
    } else if (cmd.includes('show interfaces')) {
      response = 'ge-0/0/0 (WAN)  IP: 203.0.113.10/24  STATUS: UP   SPEED: 1Gbps\nge-0/0/1 (LAN)  IP: 192.168.1.1/24   STATUS: UP   SPEED: 1Gbps\nge-0/0/2 (DMZ)  IP: 172.16.0.1/24    STATUS: UP   SPEED: 1Gbps'
    } else if (cmd.includes('verify')) {
      response = '✓ Verification test: PASS\nAll ingress traffic correctly inspected against Reticen8 Heuristic Threat Engine.\nZero packet drops detected.'
    } else if (cmd.includes('set rule')) {
      response = 'Rule updated in candidate configuration. Type "commit" to apply changes.'
    } else if (cmd.includes('commit')) {
      response = '✓ Commit complete. Configuration hash: 0x8a92fbc1.'
    } else if (cmd === 'clear') {
      setTerminalLogs(['Console cleared. Ready.'])
      setTerminalInput('')
      return
    }

    setTerminalLogs((prev) => [...prev, `$ ${cmdToRun || terminalInput}`, response])
    setTerminalInput('')
  }

  const copyToTerminal = (text) => {
    setTerminalInput(text)
    setCopiedCmd(text)
    setTimeout(() => setCopiedCmd(null), 1500)
  }

  return (
    <div className="h-screen w-screen bg-[#090D16] text-slate-200 flex flex-col overflow-hidden font-sans">

      {/* Top Navbar Header */}
      <header className="h-14 bg-[#0F172A] border-b border-slate-800 px-4 flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/courses/${course.id}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Exit Course</span>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="truncate">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate">{course.title}</h1>
            <p className="text-[11px] text-emerald-400 truncate font-mono">
              Lesson {currentLessonIndex + 1}/{allLessons.length}: {currentLesson.title}
            </p>
          </div>
        </div>

        {/* Center Progress Bar */}
        <div className="hidden md:flex items-center gap-3 w-64">
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-[#16A34A] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
            {progressPercent}%
          </span>
        </div>

        {/* Right Toggle Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleComplete(currentLesson.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              completedLessonIds.includes(currentLesson.id)
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <CheckCircle2 size={14} className={completedLessonIds.includes(currentLesson.id) ? 'text-emerald-400' : ''} />
            <span className="hidden sm:inline">
              {completedLessonIds.includes(currentLesson.id) ? 'Completed' : 'Mark Complete'}
            </span>
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title={sidebarOpen ? 'Hide curriculum' : 'Show curriculum'}
          >
            <Menu size={16} />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left / Center: Interactive Lab Sandbox Viewport */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#090D16]">

          {/* Player Viewport Controls */}
          <div className="h-10 bg-[#0B1120] border-b border-slate-800/80 px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-slate-300 font-semibold text-[11px]">
                SANDBOX: Reticen8 NGFW v7.4.2 [ONLINE]
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setTerminalView('cli')}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                  terminalView === 'cli' ? 'bg-[#16A34A] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                CLI Terminal
              </button>
              <button
                onClick={() => setTerminalView('topology')}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                  terminalView === 'topology' ? 'bg-[#16A34A] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Network Map
              </button>
              <button
                onClick={() => setTerminalView('rules')}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                  terminalView === 'rules' ? 'bg-[#16A34A] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Rules Matrix
              </button>
            </div>
          </div>

          {/* Interactive Screen Display */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed bg-[#060911]">
            {terminalView === 'cli' && (
              <div className="h-full flex flex-col">
                <div className="flex-1 space-y-1.5 overflow-y-auto mb-3 font-mono">
                  {terminalLogs.map((line, idx) => (
                    <div
                      key={idx}
                      className={
                        line.startsWith('$')
                          ? 'text-emerald-400 font-bold'
                          : line.startsWith('✓')
                          ? 'text-emerald-300 bg-emerald-950/30 p-1 rounded'
                          : line.startsWith('Command not recognized')
                          ? 'text-rose-400'
                          : 'text-slate-300 whitespace-pre-wrap'
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>

                {/* Input Prompt */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    runCommand()
                  }}
                  className="flex items-center gap-2 bg-[#0F172A] border border-slate-800 rounded-lg p-2"
                >
                  <span className="text-emerald-400 font-bold">$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Enter command (e.g. show firewall policy, show interfaces, verify)..."
                    className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-600 focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#16A34A] hover:bg-[#15803D] text-white rounded text-[11px] font-bold"
                  >
                    Run
                  </button>
                </form>
              </div>
            )}

            {terminalView === 'topology' && (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase">Perimeter Topology</span>
                    <span className="text-xs text-emerald-400 font-mono">ACTIVE (3 Subnets)</span>
                  </div>

                  <div className="flex items-center justify-around py-4">
                    <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">WAN Interface</span>
                      <span className="text-emerald-400 font-bold text-xs">203.0.113.10</span>
                      <span className="text-[9px] text-slate-500 block">ge-0/0/0</span>
                    </div>

                    <ArrowRight size={18} className="text-[#16A34A]" />

                    <div className="p-4 bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl text-center">
                      <Shield size={20} className="mx-auto text-emerald-400 mb-1" />
                      <span className="text-xs font-bold text-white block">Reticen8 NGFW</span>
                      <span className="text-[10px] text-emerald-300">v7.4 Engine</span>
                    </div>

                    <ArrowRight size={18} className="text-[#16A34A]" />

                    <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">LAN Gateway</span>
                      <span className="text-emerald-400 font-bold text-xs">192.168.1.1</span>
                      <span className="text-[9px] text-slate-500 block">ge-0/0/1</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Traffic from WAN is inspected through SPI + App-ID before routing to internal zones.
                  </p>
                </div>
              </div>
            )}

            {terminalView === 'rules' && (
              <div className="h-full space-y-3">
                <div className="flex justify-between items-center text-slate-400 text-xs border-b border-slate-800 pb-2">
                  <span>ACTIVE FIREWALL RULESET</span>
                  <span className="text-emerald-400 font-mono">3 Rules Loaded</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-[#0F172A] border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-emerald-400 font-bold block">101 • Allow-Outbound-Web</span>
                      <span className="text-slate-500 text-[11px]">LAN → WAN • Ports: 80, 443 • App: Web-Browsing</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">
                      ALLOW
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0F172A] border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-rose-400 font-bold block">102 • Deny-Inbound-Telnet</span>
                      <span className="text-slate-500 text-[11px]">WAN → ANY • Port: 23 • Vulnerability Protection</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-bold text-[10px]">
                      DROP
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0F172A] border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block">999 • Clean-Up-Rule</span>
                      <span className="text-slate-500 text-[11px]">ANY → ANY • Implicit drop all unlisted packets</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold text-[10px]">
                      DENY
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Player Drawer: Lab Guide & Notes */}
          <div className="h-56 bg-[#0B1120] border-t border-slate-800 flex flex-col flex-shrink-0">
            {/* Tabs */}
            <div className="flex border-b border-slate-800 px-4 text-xs font-semibold gap-6">
              <button
                onClick={() => setActiveTab('instructions')}
                className={`py-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'instructions'
                    ? 'border-[#16A34A] text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                <FileText size={14} />
                <span>Lab Exercise Guide</span>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'notes'
                    ? 'border-[#16A34A] text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                <BookOpen size={14} />
                <span>My Notes</span>
              </button>
              <button
                onClick={() => setActiveTab('discussion')}
                className={`py-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'discussion'
                    ? 'border-[#16A34A] text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                <MessageSquare size={14} />
                <span>Instructor Q&amp;A</span>
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 p-4 overflow-y-auto text-xs text-slate-300 leading-relaxed">
              {activeTab === 'instructions' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-white text-sm">Task 1: Inspect Perimeter Firewall Rule Hierarchy</h4>
                  <p className="text-slate-400">
                    In this laboratory drill, verify that stateful rules evaluate top-to-bottom. Click any command below to paste it into the console:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      'show firewall policy',
                      'show interfaces',
                      'verify',
                    ].map((cmd) => (
                      <button
                        key={cmd}
                        onClick={() => copyToTerminal(cmd)}
                        className="px-2.5 py-1 rounded bg-[#0F172A] border border-slate-700 text-emerald-300 font-mono text-[11px] hover:border-emerald-500 flex items-center gap-1.5 transition-colors"
                      >
                        <span>$ {cmd}</span>
                        <Copy size={11} className="text-slate-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Take notes for this lesson..."
                  className="w-full h-full bg-[#060911] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#16A34A]"
                />
              )}

              {activeTab === 'discussion' && (
                <div className="space-y-2">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="font-bold text-emerald-400 block">Q: Why did my verify command fail on rule 102?</span>
                    <span className="text-slate-400 text-[11px] block mt-0.5">
                      Instructor Sarah: Check your zone assignment. WAN interface must bind to ge-0/0/0.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Lesson Navigation Bar */}
            <div className="h-12 bg-[#0F172A] border-t border-slate-800 px-4 flex items-center justify-between text-xs">
              <button
                onClick={handlePrev}
                disabled={currentLessonIndex === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
              >
                <ArrowLeft size={14} />
                <span>Previous Lesson</span>
              </button>

              <span className="font-mono text-slate-500 hidden sm:inline">
                {currentLessonIndex + 1} of {allLessons.length}
              </span>

              <button
                onClick={handleNext}
                disabled={currentLessonIndex === allLessons.length - 1}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white font-bold transition-colors disabled:opacity-30"
              >
                <span>Next Lesson</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Collapsible Curriculum Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0B1120] border-l border-slate-800 flex flex-col flex-shrink-0 overflow-hidden"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Curriculum</h3>
                  <span className="text-xs text-white font-semibold">{course.modulesCount} Modules • {allLessons.length} Lessons</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modules Accordion */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
                {course.curriculum.map((module) => (
                  <div key={module.id} className="p-3">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {module.title}
                    </div>
                    <div className="space-y-1">
                      {module.lessons.map((lesson) => {
                        const isCurrent = currentLesson.id === lesson.id
                        const isDone = completedLessonIds.includes(lesson.id)

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              const idx = allLessons.findIndex((l) => l.id === lesson.id)
                              if (idx !== -1) setCurrentLessonIndex(idx)
                            }}
                            className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between gap-2 transition-all ${
                              isCurrent
                                ? 'bg-emerald-950/70 text-emerald-300 font-bold border border-emerald-800/50'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {isDone ? (
                                <CheckCircle2 size={14} className="text-[#16A34A] flex-shrink-0" />
                              ) : isCurrent ? (
                                <Play size={14} className="text-emerald-400 fill-emerald-400 flex-shrink-0" />
                              ) : (
                                <Circle size={14} className="text-slate-600 flex-shrink-0" />
                              )}
                              <span className="truncate">{lesson.title}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
                              {lesson.duration}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
