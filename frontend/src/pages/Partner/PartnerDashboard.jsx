import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Award, ShieldCheck, ArrowRight, Building, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function PartnerDashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 mb-2 inline-block">
              Authorized Partner Organization Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Partner Training &amp; Seats Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Authorized Partner: {user?.name || 'Avik Jana'} • Gold Tier
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Purchased Training Seats
            </div>
            <div className="text-3xl font-black text-slate-900">50 Seats</div>
            <div className="text-xs text-slate-500 mt-1">Contract: PRT-2026-GLD</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Active Enrolled Trainees
            </div>
            <div className="text-3xl font-black text-blue-600">32 Allocated</div>
            <div className="text-xs text-slate-500 mt-1">18 seats currently open</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Certifications Issued
            </div>
            <div className="text-3xl font-black text-emerald-600">14 Verified</div>
            <div className="text-xs text-slate-500 mt-1">Across Reticen8 tracks</div>
          </div>
        </div>

        {/* Trainees list */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Sponsored Trainees &amp; Engineers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Trainee</th>
                  <th className="px-6 py-3">Designated Track</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-900">Liam Vance (liam@apexcyber.com)</td>
                  <td className="px-6 py-4">NGFW Professional (RCFP)</td>
                  <td className="px-6 py-4 text-amber-600 font-semibold">Track Pending Design Release</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-900">Elena Rostova (elena@apexcyber.com)</td>
                  <td className="px-6 py-4">Security Architect (RCSA)</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold">Certified RCFP</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
