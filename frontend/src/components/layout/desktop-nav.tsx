import { Link, useLocation } from 'react-router-dom'

import { cn } from '@/lib/cn'

import { publicNavItems } from './nav-items'

export function DesktopNav() {
  const { pathname } = useLocation()

  return (
    <nav aria-label="Navigasi utama">
      <ul className="flex items-center gap-1">
        {publicNavItems.map((item) => {
          const active = item.isActive(pathname)

          return (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex min-h-11 items-center rounded-sm px-3 text-small font-bold transition-colors duration-fast',
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
  )
}
