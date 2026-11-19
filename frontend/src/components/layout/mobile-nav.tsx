import { Link, useLocation } from 'react-router-dom'

import { Dialog } from '@/components/ui'
import { cn } from '@/lib/cn'

import { publicNavItems } from './nav-items'

export interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { pathname } = useLocation()

  return (
    <Dialog open={open} onClose={onClose} title="Menu navigasi" size="sm">
      <nav aria-label="Navigasi utama">
        <ul className="flex flex-col gap-1">
          {publicNavItems.map((item) => {
            const active = item.isActive(pathname)

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-11 items-center rounded-sm px-3 text-body font-bold transition-colors duration-fast',
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

      <div className="mt-5 flex flex-col gap-2 border-t border-border pt-5">
        <p className="eyebrow text-muted">Akun</p>
        <Link
          to="/masuk"
          onClick={onClose}
          className="flex min-h-11 items-center rounded-sm px-3 text-body font-bold text-brown hover:bg-surface/60"
        >
          Masuk
        </Link>
        <Link
          to="/daftar"
          onClick={onClose}
          className="flex min-h-11 items-center rounded-sm px-3 text-body font-bold text-brown hover:bg-surface/60"
        >
          Daftar
        </Link>
      </div>
    </Dialog>
  )
}
