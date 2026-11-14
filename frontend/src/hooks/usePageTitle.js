import { useEffect } from 'react'

const BASE = 'Reticen8 Academy'
const SUFFIX = 'Master Cybersecurity. Master Network Security.'

// Sets document.title for the current page (helps browser tabs, history, and
// link sharing).
//   usePageTitle('Sign In')  -> "Sign In · Reticen8 Academy"
//   usePageTitle(null)        -> the default base title
//   usePageTitle(false)       -> do nothing (another component owns the title)
export function usePageTitle(title) {
  useEffect(() => {
    if (title === false) return
    document.title = title ? `${title} · ${BASE}` : `${BASE} – ${SUFFIX}`
  }, [title])
}

export default usePageTitle
