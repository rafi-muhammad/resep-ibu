import { Outlet } from 'react-router-dom'

import { AuthProvider } from '@/features/auth'

import { ScrollToTop } from './scroll-to-top'
import { SkipLink } from './skip-link'

/** Kerangka akar: sesi demo, skip link, reset scroll, dan fokus setelah navigasi. */
export function RootLayout() {
  return (
    <AuthProvider>
      <SkipLink />
      <ScrollToTop />
      <Outlet />
    </AuthProvider>
  )
}
