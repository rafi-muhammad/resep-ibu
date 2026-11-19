import { Link, Outlet, useLocation } from 'react-router-dom'

import { Container } from './container'
import { accountNavItems } from './nav-items'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import { cn } from '@/lib/cn'

export function AccountLayout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SiteHeader />

      <main id="main" tabIndex={-1} className="flex-1 py-8 sm:py-10">
        <Container className="grid gap-8 lg:grid-cols-[240px_1fr] lg:items-start">
          <nav aria-label="Navigasi akun" className="lg:sticky lg:top-24">
            <p className="eyebrow mb-3 text-muted">Akun saya</p>
            <ul className="flex flex-wrap gap-1 lg:flex-col">
              {accountNavItems.map((item) => {
                const active = item.isActive(pathname)

                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex min-h-11 items-center rounded-sm px-3 text-small font-bold transition-colors duration-fast',
                        active ? 'bg-surface text-brown' : 'text-brown hover:bg-surface/60',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="min-w-0">
            <Outlet />
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  )
}
