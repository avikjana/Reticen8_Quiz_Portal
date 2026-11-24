import { useState, useEffect, useRef, useCallback } from 'react'
import {
  ShieldCheck,
  ShieldOff,
  Smartphone,
  Copy,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import QRCode from 'qrcode'
import { useAuth } from '../context/AuthContext'
import { dashboardPathFor } from '../config/roles'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import authService from '../services/authService'

export default function SecuritySettings() {
  const { user } = useAuth()

  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [backupCodesRemaining, setBackupCodesRemaining] = useState(0)
  const [statusLoading, setStatusLoading] = useState(true)

  // Setup flow state
  const [setupStep, setSetupStep] = useState(null) // null | 'qr' | 'verify' | 'done'
  const [secret, setSecret] = useState('')
  const [otpauthUri, setOtpauthUri] = useState('')
  const [setupCode, setSetupCode] = useState('')
  const [backupCodes, setBackupCodes] = useState([])
  const [showSecret, setShowSecret] = useState(false)

  // Disable flow state
  const [showDisable, setShowDisable] = useState(false)
  const [disablePassword, setDisablePassword] = useState('')
  const [disableCode, setDisableCode] = useState('')

  // Regenerate codes flow
  const [showRegenerate, setShowRegenerate] = useState(false)
  const [regenCode, setRegenCode] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    authService
      .mfaStatus()
      .then((res) => {
        setMfaEnabled(res.mfaEnabled)
        setBackupCodesRemaining(res.backupCodesRemaining)
      })
      .catch(() => {})
      .finally(() => setStatusLoading(false))
  }, [])

  const clearMessages = () => {
    setErrorMsg('')
    setSuccessMsg('')
  }

  // --- SETUP ---
  const handleStartSetup = async () => {
    clearMessages()
    setLoading(true)
    try {
      const res = await authService.mfaSetup()
      setSecret(res.secret)
      setOtpauthUri(res.otpauthUri)
      setSetupStep('qr')
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySetup = async (e) => {
    e.preventDefault()
    clearMessages()
    setLoading(true)
    try {
      const res = await authService.mfaVerifySetup(setupCode)
      setBackupCodes(res.backupCodes)
      setMfaEnabled(true)
      setBackupCodesRemaining(res.backupCodes.length)
      setSetupStep('done')
      setSuccessMsg('MFA has been enabled successfully!')
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  // --- DISABLE ---
  const handleDisable = async (e) => {
    e.preventDefault()
    clearMessages()
    setLoading(true)
    try {
      await authService.mfaDisable({ password: disablePassword, code: disableCode || undefined })
      setMfaEnabled(false)
      setShowDisable(false)
      setDisablePassword('')
      setDisableCode('')
      setSetupStep(null)
      setSuccessMsg('MFA has been disabled.')
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  // --- REGENERATE BACKUP CODES ---
  const handleRegenerate = async (e) => {
    e.preventDefault()
    clearMessages()
    setLoading(true)
    try {
      const res = await authService.mfaRegenerateBackupCodes(regenCode)
      setBackupCodes(res.backupCodes)
      setBackupCodesRemaining(res.backupCodes.length)
      setShowRegenerate(false)
      setRegenCode('')
      setSetupStep('done')
      setSuccessMsg('New backup codes generated!')
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const dashboardPath = dashboardPathFor(user?.role)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Back link */}
        <Link
          to={dashboardPath}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>

        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#4b6cf7]">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Security Settings
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage two-factor authentication for your account
            </p>
          </div>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700 font-medium">
            <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-semibold">
            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* MFA Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Status header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mfaEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {mfaEnabled ? <ShieldCheck size={20} /> : <ShieldOff size={20} />}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Two-Factor Authentication</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {statusLoading
                    ? 'Checking status...'
                    : mfaEnabled
                    ? 'Enabled — your account is protected with an authenticator app'
                    : 'Disabled — add an extra layer of security to your account'}
                </p>
              </div>
            </div>
            {!statusLoading && (
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${mfaEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                {mfaEnabled ? 'Active' : 'Off'}
              </span>
            )}
          </div>

          <div className="p-6">
            {/* ======= NOT ENABLED: Show enable button or setup flow ======= */}
            {!mfaEnabled && setupStep === null && (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#4b6cf7] flex items-center justify-center mx-auto mb-4">
                  <Smartphone size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Protect your account with 2FA
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mb-6">
                  Use an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator to generate verification codes.
                </p>
                <button
                  onClick={handleStartSetup}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#4b6cf7] hover:bg-[#3b5ce6] text-white text-sm font-bold rounded-xl transition-colors shadow-md disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ShieldCheck size={16} />
                  )}
                  <span>Enable Two-Factor Authentication</span>
                </button>
              </div>
            )}

            {/* ======= SETUP STEP 1: QR Code + Secret ======= */}
            {setupStep === 'qr' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    Step 1: Scan QR Code
                  </h3>
                  <p className="text-xs text-slate-500">
                    Open your authenticator app and scan this QR code, or enter the secret key manually.
                  </p>
                </div>

                {/* QR Code - rendered locally on canvas */}
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
                    <QRCanvas value={otpauthUri} size={200} />
                  </div>
                </div>

                {/* Manual secret */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Secret Key</span>
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      {showSecret ? <EyeOff size={12} /> : <Eye size={12} />}
                      <span>{showSecret ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <code className="text-sm font-mono font-bold text-slate-800 break-all select-all">
                    {showSecret ? secret : '••••••••••••••••••••••••••••••••'}
                  </code>
                </div>

                {/* Verify form */}
                <form onSubmit={handleVerifySetup} className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      Step 2: Enter Verification Code
                    </h3>
                    <p className="text-xs text-slate-500">
                      Enter the 6-digit code shown in your authenticator app to confirm setup.
                    </p>
                  </div>
                  <div className="relative">
                    <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      value={setupCode}
                      onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-center text-lg font-mono font-bold text-slate-800 tracking-[0.3em] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4b6cf7]/20 focus:border-[#4b6cf7] transition-all"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setSetupStep(null); clearMessages() }}
                      className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || setupCode.length !== 6}
                      className="flex-1 py-3 px-4 rounded-xl text-white text-sm font-bold bg-[#4b6cf7] hover:bg-[#3b5ce6] shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                      <span>Verify & Enable</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ======= SETUP DONE: Show backup codes ======= */}
            {setupStep === 'done' && backupCodes.length > 0 && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    Save Your Backup Codes
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    If you lose access to your authenticator app, you can use one of these codes to sign in. Each code can only be used once.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, i) => (
                      <code key={i} className="text-sm font-mono font-bold text-slate-800 bg-white rounded-lg px-3 py-2 text-center border border-slate-200">
                        {code}
                      </code>
                    ))}
                  </div>
                </div>

                <button
                  onClick={copyBackupCodes}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy all codes'}</span>
                </button>

                <button
                  onClick={() => { setSetupStep(null); setBackupCodes([]); clearMessages() }}
                  className="w-full py-3 px-4 rounded-xl text-white text-sm font-bold bg-[#4b6cf7] hover:bg-[#3b5ce6] shadow-md transition-colors"
                >
                  Done
                </button>
              </div>
            )}

            {/* ======= ENABLED: Management options ======= */}
            {mfaEnabled && setupStep === null && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-800">MFA is active.</span>
                    <span className="text-emerald-700 ml-1">
                      {backupCodesRemaining} backup code{backupCodesRemaining !== 1 ? 's' : ''} remaining.
                    </span>
                  </div>
                </div>

                {/* Regenerate backup codes */}
                {!showRegenerate && !showDisable && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setShowRegenerate(true); setShowDisable(false); clearMessages() }}
                      className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={14} />
                      <span>Regenerate Backup Codes</span>
                    </button>
                    <button
                      onClick={() => { setShowDisable(true); setShowRegenerate(false); clearMessages() }}
                      className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShieldOff size={14} />
                      <span>Disable MFA</span>
                    </button>
                  </div>
                )}

                {/* Regenerate form */}
                {showRegenerate && (
                  <form onSubmit={handleRegenerate} className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-600 font-medium">Enter your current authenticator code to generate new backup codes.</p>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      value={regenCode}
                      onChange={(e) => setRegenCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6-digit code"
                      maxLength={6}
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-center text-lg font-mono font-bold text-slate-800 tracking-[0.3em] placeholder:text-slate-300 placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-[#4b6cf7]/20 focus:border-[#4b6cf7]"
                    />
                    <div className="flex gap-3">
                      <button type="button" onClick={() => { setShowRegenerate(false); setRegenCode('') }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50">
                        Cancel
                      </button>
                      <button type="submit" disabled={loading || regenCode.length !== 6} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-[#4b6cf7] hover:bg-[#3b5ce6] disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        Regenerate
                      </button>
                    </div>
                  </form>
                )}

                {/* Disable form */}
                {showDisable && (
                  <form onSubmit={handleDisable} className="space-y-3 p-4 bg-rose-50 rounded-xl border border-rose-200">
                    <p className="text-xs text-rose-700 font-medium">Enter your password to disable MFA. This will remove the second factor from your account.</p>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="password"
                        required
                        value={disablePassword}
                        onChange={(e) => setDisablePassword(e.target.value)}
                        placeholder="Your password"
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400"
                      />
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={disableCode}
                      onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Authenticator code (optional)"
                      maxLength={6}
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 text-center font-mono tracking-wider placeholder:text-slate-400 placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400"
                    />
                    <div className="flex gap-3">
                      <button type="button" onClick={() => { setShowDisable(false); setDisablePassword(''); setDisableCode('') }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50">
                        Cancel
                      </button>
                      <button type="submit" disabled={loading || !disablePassword} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        Disable MFA
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function QRCanvas({ value, size = 200 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !value) return
    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      errorCorrectionLevel: 'M',
    }).catch(err => console.error('QR render failed:', err))
  }, [value, size])

  return (
    <canvas
      ref={canvasRef}
      className="rounded-lg"
      style={{ imageRendering: 'pixelated' }}
      aria-label="Scan this QR code with your authenticator app"
      role="img"
    />
  )
}
