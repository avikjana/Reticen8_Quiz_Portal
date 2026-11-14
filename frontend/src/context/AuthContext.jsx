import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { dashboardPathFor } from '../config/roles'
import authService from '../services/authService'
import { clearApiCache } from '../hooks/useApi'

const AuthContext = createContext(null)

const TOKEN_KEY = 'r8_token'
const USER_KEY = 'r8_user'

const readStoredUser = () => {
  try {
    const saved = localStorage.getItem(USER_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export { dashboardPathFor }

// Where to go after login/sign-up: back to the members-only page the visitor
// tried to open (keeping ?query and #hash), otherwise their dashboard.
export const pathAfterAuth = (from, role) =>
  from?.pathname ? `${from.pathname}${from.search || ''}${from.hash || ''}` : dashboardPathFor(role)

// Friendly description of the gated page for the "please sign in" notice
export const describeGatedPage = (from) => {
  const p = from?.pathname || ''
  if (p.startsWith('/certifications')) return 'the certification guide'
  if (p.startsWith('/courses/') || p.startsWith('/learn/')) return 'this course'
  if (p.startsWith('/labs')) return 'the hands-on labs'
  return p ? 'this page' : null
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null)
  // Cached user lets the UI render instantly; it's re-validated against /auth/me below.
  const [user, setUser] = useState(() => (localStorage.getItem(TOKEN_KEY) ? readStoredUser() : null))
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginModalDefaultCategory, setLoginModalDefaultCategory] = useState('Employee')

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }, [user])

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  }, [token])

  const clearSession = useCallback(() => {
    // Remove the token right away so re-fetches after logout go out as a visitor
    localStorage.removeItem(TOKEN_KEY)
    clearApiCache()
    setUser(null)
    setToken(null)
  }, [])

  // On load, confirm the stored token is still valid and refresh the user record
  useEffect(() => {
    if (!token) return
    let cancelled = false
    authService
      .getMe()
      .then((res) => {
        if (!cancelled && res?.user) setUser(res.user)
      })
      .catch((err) => {
        // Only drop the session if the server actually rejected the token;
        // keep it if the backend is just unreachable for a moment.
        if (!cancelled && err.status === 401) clearSession()
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Any API call that gets a 401 (expired/revoked token) signs the user out
  useEffect(() => {
    const onUnauthorized = () => clearSession()
    window.addEventListener('r8:unauthorized', onUnauthorized)
    return () => window.removeEventListener('r8:unauthorized', onUnauthorized)
  }, [clearSession])

  const startSession = (data) => {
    clearApiCache()
    // Store the token immediately so API calls made right after login carry it
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.user)
    setIsLoginModalOpen(false)
    return { success: true, user: data.user }
  }

  const run = async (fn) => {
    try {
      const data = await fn()
      if (data?.success && data.token && data.user) return startSession(data)
      return { success: false, error: data?.error || 'Authentication failed' }
    } catch (err) {
      return {
        success: false,
        error:
          err.name === 'AbortError' || err.message === 'Failed to fetch'
            ? 'Cannot reach the server. Make sure the backend is running.'
            : err.message,
      }
    }
  }

  const login = ({ email, password, role }) => run(() => authService.login({ email, password, role }))

  const register = (userData) => run(() => authService.register(userData))

  // `credential` is the Google ID token from the Google Identity Services button
  const loginWithGoogle = ({ credential, role }) => run(() => authService.google({ credential, role }))

  const logout = async () => {
    try {
      if (token) await authService.logout()
    } catch (err) {
      console.warn('Logout API call notice:', err.message)
    } finally {
      clearSession()
    }
  }

  const openLoginModal = (category = 'Employee') => {
    setLoginModalDefaultCategory(category)
    setIsLoginModalOpen(true)
  }

  const closeLoginModal = () => setIsLoginModalOpen(false)

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        register,
        loginWithGoogle,
        logout,
        isLoginModalOpen,
        loginModalDefaultCategory,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
