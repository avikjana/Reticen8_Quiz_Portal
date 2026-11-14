import api from './api'

export const authService = {
  login: async ({ email, password, role }) => {
    return await api.post('/auth/login', { email, password, role })
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData)
  },

  google: async ({ credential, role }) => {
    return await api.post('/auth/google', { credential, role })
  },

  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email })
  },

  resetPassword: async ({ token, password }) => {
    return await api.post('/auth/reset-password', { token, password })
  },

  getMe: async () => {
    return await api.get('/auth/me')
  },

  logout: async () => {
    return await api.post('/auth/logout', {})
  },

  getRoles: async () => {
    return await api.get('/auth/roles')
  },
}

export default authService
