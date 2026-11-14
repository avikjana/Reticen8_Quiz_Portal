import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GSI_SRC = 'https://accounts.google.com/gsi/client'

let gsiPromise = null
function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (!gsiPromise) {
    gsiPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = GSI_SRC
      script.async = true
      script.defer = true
      script.onload = resolve
      script.onerror = () => {
        gsiPromise = null
        reject(new Error('Could not load Google sign-in. Check your connection or ad-blocker.'))
      }
      document.head.appendChild(script)
    })
  }
  return gsiPromise
}

/**
 * Renders Google's official "Sign in with Google" button.
 * On success the Google ID token is sent to POST /api/auth/google, which
 * verifies it and returns our own session token.
 *
 * Props:
 *  - role:      'Employee' | 'Partner' — role given to brand-new accounts
 *  - onSuccess: (user) => void
 *  - onError:   (message) => void
 *  - text:      'signin_with' | 'signup_with' | 'continue_with'
 */
export default function GoogleSignInButton({ role = 'Employee', onSuccess, onError, text = 'continue_with' }) {
  const { loginWithGoogle } = useAuth()
  const containerRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [loadError, setLoadError] = useState('')

  // Keep the latest props available to Google's callback without re-initialising
  const latest = useRef({ role, onSuccess, onError, loginWithGoogle })
  latest.current = { role, onSuccess, onError, loginWithGoogle }

  useEffect(() => {
    if (!CLIENT_ID) return
    let cancelled = false

    loadGoogleScript()
      .then(() => {
        if (cancelled || !containerRef.current) return
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          ux_mode: 'popup',
          callback: async ({ credential }) => {
            setBusy(true)
            const result = await latest.current.loginWithGoogle({ credential, role: latest.current.role })
            setBusy(false)
            if (result.success) latest.current.onSuccess?.(result.user)
            else latest.current.onError?.(result.error)
          },
        })
        const width = Math.min(400, Math.max(200, containerRef.current.offsetWidth || 320))
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text,
          logo_alignment: 'center',
          width,
        })
      })
      .catch((err) => !cancelled && setLoadError(err.message))

    return () => {
      cancelled = true
    }
  }, [text])

  if (!CLIENT_ID) {
    // Visible only in development so it's obvious why the button is missing
    return import.meta.env.DEV ? (
      <p className="text-[11px] text-center text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
        Google sign-in is disabled: set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>frontend/.env.local</code>.
      </p>
    ) : null
  }

  return (
    <div className="w-full">
      <div className="relative flex justify-center min-h-[44px]">
        <div ref={containerRef} className={`w-full flex justify-center ${busy ? 'opacity-50 pointer-events-none' : ''}`} />
        {busy && (
          <span className="absolute inset-0 flex items-center justify-center" role="status" aria-label="Signing in with Google">
            <span className="w-5 h-5 border-2 border-slate-300 border-t-brand-600 rounded-full animate-spin" />
          </span>
        )}
      </div>
      {loadError && <p className="mt-2 text-[11px] text-center text-rose-600">{loadError}</p>}
    </div>
  )
}

export function OrDivider({ label = 'or' }) {
  return (
    <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
      <span className="h-px flex-1 bg-slate-200" />
      {label}
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  )
}
