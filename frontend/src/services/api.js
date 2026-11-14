// Centralized HTTP client with automatic auth header injection and error handling
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('r8_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      const error = new Error(data.error || `HTTP error ${res.status}: ${res.statusText}`)
      error.status = res.status
      // A rejected token on an authenticated call means the session is over
      // (but a wrong password on the login form is not a session problem)
      const isCredentialCheck = /^\/?auth\/(login|register|google)/.test(endpoint)
      if (res.status === 401 && token && !isCredentialCheck) {
        window.dispatchEvent(new Event('r8:unauthorized'))
      }
      throw error
    }

    return data
  } catch (err) {
    clearTimeout(timeoutId)
    // If backend is unreachable, throw meaningful error for offline fallback handling
    throw err
  }
}

export const api = {
  get: (url, options) => request(url, { method: 'GET', ...options }),
  post: (url, body, options) => request(url, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (url, body, options) => request(url, { method: 'PUT', body: JSON.stringify(body), ...options }),
  delete: (url, options) => request(url, { method: 'DELETE', ...options }),
}

export default api
