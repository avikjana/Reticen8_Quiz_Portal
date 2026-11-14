import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

// Traps keyboard focus inside a modal while `active`, moves focus into it on
// open, and restores focus to the previously focused element on close.
// Attach the returned ref to the dialog container.
export default function useFocusTrap(active) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active || !ref.current) return
    const node = ref.current
    const previouslyFocused = document.activeElement

    const items = () => [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
    const first = items()[0]
    ;(first || node).focus?.()

    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return
      const list = items()
      if (list.length === 0) return
      const firstEl = list[0]
      const lastEl = list[list.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    node.addEventListener('keydown', onKeyDown)
    return () => {
      node.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [active])

  return ref
}
