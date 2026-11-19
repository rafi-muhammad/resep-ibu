import { Outlet } from 'react-router-dom'

import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="container-page flex-1 py-8 sm:py-10">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
