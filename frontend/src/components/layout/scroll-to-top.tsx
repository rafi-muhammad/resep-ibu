import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Mengembalikan scroll ke atas dan memindahkan fokus ke `#main`
 * setiap kali path berubah. Fokus tidak dipindah pada render pertama.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })

    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname])

  return null
}
