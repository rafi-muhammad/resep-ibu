import { BookOpen, Info, LayoutDashboard, Mail, Tags, Users, type LucideIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { Dialog } from '@/components/ui'
import { cn } from '@/lib/cn'

interface AdminNavItem {
  label: string
  to: string
  icon: LucideIcon
  exact?: boolean
}

const adminNavItems: AdminNavItem[] = [
  { label: 'Dasbor', to: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Resep', to: '/admin/resep', icon: BookOpen },
  { label: 'Kategori', to: '/admin/kategori', icon: Tags },
  { label: 'Pengguna', to: '/admin/pengguna', icon: Users },
  { label: 'Pesan', to: '/admin/pesan', icon: Mail },
  { label: 'Tentang', to: '/admin/tentang', icon: Info },
]

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation()

  return (
    <nav aria-label="Navigasi admin">
      <ul className="flex flex-col gap-1">
        {adminNavItems.map((item) => {
          const active = item.exact
            ? pathname === item.to
            : pathname.startsWith(`${item.to}/`) || pathname === item.to
          const Icon = item.icon

          return (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-11 items-center gap-3 rounded-sm px-3 text-small font-bold transition-colors duration-fast',
                  active ? 'bg-surface text-brown' : 'text-brown hover:bg-surface/60',
                )}
              >
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function AdminBrand() {
  return (
    <Link
      to="/admin"
      className="flex items-center gap-2 rounded-sm text-small font-extrabold text-brown"
    >
      <span
        aria-hidden="true"
        className="grid h-8 w-8 place-items-center rounded-full bg-accent text-label text-ink"
      >
        RI
      </span>
      Admin Resep Ibu
    </Link>
  )
}

export interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <AdminBrand />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <AdminNav />
        </div>
        <div className="border-t border-border p-3">
          <Link
            to="/"
            className="flex min-h-11 items-center rounded-sm px-3 text-small font-bold text-muted hover:bg-surface/60 hover:text-brown"
          >
            Lihat situs publik
          </Link>
        </div>
      </aside>

      <Dialog open={open} onClose={onClose} title="Menu admin" size="sm">
        <AdminNav onNavigate={onClose} />
      </Dialog>
    </>
  )
}
