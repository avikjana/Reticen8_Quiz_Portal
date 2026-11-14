import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Terminal,
  Bug,
  FlaskConical,
} from 'lucide-react'

const features = [
  {
    icon: Terminal,
    title: 'Guided Configuration Exercises',
    description:
      'Follow structured, step-by-step exercises to configure enterprise firewall policies, interfaces, routing, and security profiles in a risk-free virtualized sandbox.',
    accent: '#16A34A',
    lightBg: 'bg-emerald-50',
  },
  {
    icon: Bug,
    title: 'Real-World Troubleshooting Scenarios',
    description:
      'Develop critical diagnostic skills by analyzing simulated security incidents, dropped packets, asymmetric routing faults, and certificate inspection mismatches.',
    accent: '#2563EB',
    lightBg: 'bg-blue-50',
  },
  {
    icon: FlaskConical,
    title: 'Reticen8 NGFW Practical Labs',
    description:
      'Gain real hands-on command with Reticen8 next-generation operating system, deploying high-availability clustering, SD-WAN failover, and SSL decryption tunnels.',
    accent: '#7C3AED',
    lightBg: 'bg-purple-50',
  },
]

export default function PracticalLearning() {
  const [activeTab, setActiveTab] = useState('policy')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 bg-slate-50" id="practical-learning">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left: Enterprise Lab Sandbox Console UI */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="theme-fixed bg-[#0B1120] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden"
            >
              {/* Window Header */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#101828] border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs font-mono text-slate-400">
                    reticen8-lab-host ~ session #4829
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>NGFW ONLINE</span>
                </div>
              </div>

              {/* Console Tabs */}
              <div className="flex border-b border-slate-800 bg-[#0F172A] px-4 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('policy')}
                  className={`px-4 py-2.5 font-medium border-b-2 transition-colors ${
                    activeTab === 'policy'
                      ? 'border-brand-600 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Firewall Rules
                </button>
                <button
                  onClick={() => setActiveTab('threats')}
                  className={`px-4 py-2.5 font-medium border-b-2 transition-colors ${
                    activeTab === 'threats'
                      ? 'border-brand-600 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Threat Detection
                </button>
                <button
                  onClick={() => setActiveTab('topology')}
                  className={`px-4 py-2.5 font-medium border-b-2 transition-colors ${
                    activeTab === 'topology'
                      ? 'border-brand-600 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  VPN Tunnels
                </button>
              </div>

              {/* Console Content */}
              <div className="p-6 font-mono text-xs leading-relaxed text-slate-300 min-h-[300px]">
                {activeTab === 'policy' && (
                  <div className="space-y-2">
                    <p className="text-slate-500"># Active Security Policies — Reticen8 NGFW v7.4</p>
                    <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1.5">
                      <div className="flex justify-between text-slate-400 font-semibold border-b border-slate-800 pb-1">
                        <span>RULE NAME</span>
                        <span>ACTION</span>
                        <span>APP-FILTER</span>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span>101 WAN-to-LAN-Web</span>
                        <span className="text-emerald-400 font-bold">ALLOW</span>
                        <span>HTTPS / TLS 1.3</span>
                      </div>
                      <div className="flex justify-between text-rose-400">
                        <span>102 Threat-Block-C2</span>
                        <span className="text-rose-400 font-bold">DENY</span>
                        <span>Botnet / Malware</span>
                      </div>
                      <div className="flex justify-between text-sky-400">
                        <span>103 Branch-IPsec-VPN</span>
                        <span className="text-sky-400 font-bold">TUNNEL</span>
                        <span>AES-256-GCM</span>
                      </div>
                    </div>

                    <div className="pt-3 text-emerald-400">
                      <p>$ r8-cli firewall rule verify --rule 101</p>
                      <p className="text-slate-400 mt-1">✓ State table inspected: 1,482 active connections</p>
                      <p className="text-slate-400">✓ IPS inspection enabled on ingress interface ge-0/0/0</p>
                      <p className="text-emerald-300 font-bold mt-2">✓ Task Completed: Policy deployed without downtime.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'threats' && (
                  <div className="space-y-3">
                    <p className="text-slate-500"># Live IPS Stream &amp; Intrusion Prevention Telemetry</p>
                    <div className="space-y-2">
                      <div className="p-2.5 rounded bg-rose-950/30 border border-rose-900/50 flex justify-between items-center text-rose-300">
                        <span>[BLOCKED] SQL Injection payload on port 443</span>
                        <span className="text-[10px] text-rose-400">0.02ms</span>
                      </div>
                      <div className="p-2.5 rounded bg-rose-950/30 border border-rose-900/50 flex justify-between items-center text-rose-300">
                        <span>[BLOCKED] Brute force SSH attempt from 198.51.100.42</span>
                        <span className="text-[10px] text-rose-400">0.05ms</span>
                      </div>
                      <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-900/50 flex justify-between items-center text-emerald-300">
                        <span>[CLEARED] Encrypted zero-trust traffic verified</span>
                        <span className="text-[10px] text-emerald-400">TLS 1.3</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'topology' && (
                  <div className="space-y-3">
                    <p className="text-slate-500"># Site-to-Site IPsec &amp; Multi-Cloud Tunnel Health</p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                        <span className="text-slate-400 text-[11px] block">HEADQUARTERS</span>
                        <span className="text-emerald-400 font-bold text-sm">UP (1 Gbps)</span>
                        <span className="text-[10px] text-slate-500 block mt-1">Latency: 4.2ms</span>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                        <span className="text-slate-400 text-[11px] block">CLOUD VPC (AWS)</span>
                        <span className="text-emerald-400 font-bold text-sm">UP (500 Mbps)</span>
                        <span className="text-[10px] text-slate-500 block mt-1">Latency: 11.8ms</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Console Footer Stats */}
              <div className="px-6 py-3.5 bg-[#090D16] border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Lab Progress: 7 / 10 Tasks</span>
                <span className="text-emerald-400 font-bold">Score: 94%</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Content & Explanations */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/60 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
                <FlaskConical size={14} />
                <span>Hands-On Virtual Labs</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Go Beyond Theory.{' '}
                <span className="text-brand-600">Learn Through Practice.</span>
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed font-normal">
                Experience real-world enterprise firewall configuration scenarios and develop the muscle memory required to deploy, manage, and troubleshoot mission-critical security infrastructure.
              </p>
            </motion.div>

            {/* 3 Structured Features */}
            <div className="mt-8 space-y-4">
              {features.map((item, idx) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.15 + idx * 0.08 }}
                    className="flex gap-4 p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-md transition-all"
                  >
                    <div className={`w-11 h-11 rounded-xl ${item.lightBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={20} style={{ color: item.accent }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Primary Action Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <Link
                to="/labs"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-action-600 hover:bg-action-700 shadow-md shadow-blue-950/30 transition-all group"
              >
                <span>Explore Practical Training</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
