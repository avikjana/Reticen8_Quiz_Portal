import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Open/close state for a dropdown that should close when the user clicks
 * outside it, presses Esc, or navigates to another page.
 *   const { open, setOpen, ref } = useDismissable()
 * Attach `ref` to the element that wraps both the trigger and the menu.
 */
export default function useDismissable() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!open) return
    const onMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return { open, setOpen, ref }
}
