import { useCallback, useEffect, useRef, useState } from 'react'
import api from '../services/api'

// Small in-memory cache so public catalog data isn't re-fetched on every
// page visit. Cleared on logout/login because members see more data.
const cache = new Map()
const ACCOUNT_CHANGED = 'r8:account-changed'

// Call after login/logout: forgets cached responses and tells every mounted
// useApi() to fetch again, since what the API returns depends on who is asking.
export const clearApiCache = () => {
  cache.clear()
  // Deferred so the new token is already saved when the re-fetches start
  setTimeout(() => window.dispatchEvent(new Event(ACCOUNT_CHANGED)), 0)
}

/**
 * Fetch JSON from the backend.
 *   const { data, loading, error, reload } = useApi('/courses')
 * Pass `null` as the path to skip the request (e.g. while a param is missing).
 * `data` is the response's `data` field when present, else the whole response.
 */
export function useApi(path, { cacheResult = true } = {}) {
  const cached = path && cacheResult ? cache.get(path) : undefined
  const [state, setState] = useState({ data: cached ?? null, loading: !!path && cached === undefined, error: null })
  const requestId = useRef(0)

  const load = useCallback(
    async (force = false) => {
      if (!path) {
        setState({ data: null, loading: false, error: null })
        return
      }
      if (!force && cacheResult && cache.has(path)) {
        setState({ data: cache.get(path), loading: false, error: null })
        return
      }
      const id = ++requestId.current
      setState((s) => ({ ...s, loading: true, error: null }))
      try {
        const res = await api.get(path)
        const data = res?.data !== undefined ? res.data : res
        if (cacheResult) cache.set(path, data)
        if (id === requestId.current) setState({ data, loading: false, error: null })
      } catch (err) {
        if (id !== requestId.current) return
        const offline = err.name === 'AbortError' || err.message === 'Failed to fetch'
        setState({
          data: null,
          loading: false,
          error: {
            status: err.status || 0,
            message: offline ? 'Cannot reach the server. Please try again in a moment.' : err.message,
          },
        })
      }
    },
    [path, cacheResult]
  )

  useEffect(() => {
    load()
    const onAccountChanged = () => load(true)
    window.addEventListener(ACCOUNT_CHANGED, onAccountChanged)
    return () => window.removeEventListener(ACCOUNT_CHANGED, onAccountChanged)
  }, [load])

  return { ...state, reload: () => load(true) }
}

export default useApi
