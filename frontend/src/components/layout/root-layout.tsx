import { Outlet } from 'react-router-dom'

import { ScrollToTop } from './scroll-to-top'
import { SkipLink } from './skip-link'

/** Kerangka akar: skip link, reset scroll, dan fokus setelah navigasi. */
export function RootLayout() {
  return (
    <>
      <SkipLink />
      <ScrollToTop />
      <Outlet />
    </>
  )
}
