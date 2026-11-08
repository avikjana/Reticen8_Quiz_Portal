import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Fallback seed accounts for offline resilience
const DEMO_ACCOUNTS = {
  Administrator: {
    id: 'usr-admin-01',
    name: 'Avik Jana',
    email: 'admin@reticen8.com',
    password: 'AdminPassword123!',
    role: 'Administrator',
    roleTitle: 'Enterprise Systems Administrator',
    avatar: 'A',
    department: 'Global Information Security',
    permissions: ['all', 'system_admin', 'user_management', 'audit_logs', 'lab_provisioning'],
    badgeColor: 'purple',
  },
  Employee: {
    id: 'usr-emp-02',
    name: 'Avik Jana',
    email: 'employee@reticen8.com',
    password: 'EmployeePassword123!',
    role: 'Employee',
    roleTitle: 'Lead Security Engineer',
    avatar: 'A',
    department: 'Security Operations Center (SOC)',
    permissions: ['engineer_labs', 'internal_curriculum', 'firewall_sandbox', 'exam_vouchers'],
    badgeColor: 'emerald',
  },
  Partner: {
    id: 'usr-partner-03',
    name: 'Avik Jana',
    email: 'partner@reticen8.com',
    password: 'PartnerPassword123!',
    role: 'Partner',
    roleTitle: 'Authorized Training Partner',
    avatar: 'A',
    department: 'Partner Engineering Ecosystem',
    permissions: ['partner_portal', 'seat_allocation', 'discounted_vouchers', 'co_branding'],
    badgeColor: 'blue',
  },
}

export function AuthProvider({ children }) {
  // Default to Employee (Avik - Engineer) initially as requested
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('r8_user')
      return saved ? JSON.parse(saved) : DEMO_ACCOUNTS.Employee
    } catch {
      return DEMO_ACCOUNTS.Employee
    }
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('r8_token') || 'r8_auth_default'
  })

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginModalDefaultCategory, setLoginModalDefaultCategory] = useState('Employee')

  useEffect(() => {
    if (user) {
      localStorage.setItem('r8_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('r8_user')
    }
  }, [user])

  useEffect(() => {
    if (token) {
      localStorage.setItem('r8_token', token)
    } else {
      localStorage.removeItem('r8_token')
    }
  }, [token])

  // Login action with real backend connection + graceful offline fallback
  const login = async ({ email, password, role }) => {
    try {
      // 1. Attempt connection to Backend API (http://localhost:5000/api/auth/login)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3500)

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setUser(data.user)
          setToken(data.token)
          setIsLoginModalOpen(false)
          return { success: true, user: data.user }
        }
      } else {
        const errData = await response.json()
        return { success: false, error: errData.error || 'Authentication failed' }
      }
    } catch (networkErr) {
      console.warn('Backend server not reachable on port 5000, using local fallback validation:', networkErr.message)

      // Fallback matching for local seamless demo
      const fallback = DEMO_ACCOUNTS[role]
      if (fallback && fallback.email.toLowerCase() === email.toLowerCase() && fallback.password === password) {
        setUser(fallback)
        setToken(`r8_offline_${fallback.id}_${Date.now()}`)
        setIsLoginModalOpen(false)
        return { success: true, user: fallback }
      }

      return {
        success: false,
        error: `Invalid credentials for ${role}. Please check your email and password.`,
      }
    }
  }

  const logout = async () => {
    try {
      if (token && token.startsWith('r8_auth_')) {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (err) {
      console.warn('Logout API call notice:', err.message)
    } finally {
      setUser(null)
      setToken(null)
    }
  }

  const switchRole = (newRole) => {
    const target = DEMO_ACCOUNTS[newRole]
    if (target) {
      setUser(target)
      setToken(`r8_auth_${target.id}_switched`)
    }
  }

  const openLoginModal = (category = 'Employee') => {
    setLoginModalDefaultCategory(category)
    setIsLoginModalOpen(true)
  }

  const closeLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        isLoginModalOpen,
        loginModalDefaultCategory,
        openLoginModal,
        closeLoginModal,
        demoAccounts: DEMO_ACCOUNTS,
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
