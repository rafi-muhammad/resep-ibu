import { Link } from 'react-router-dom'

import { Avatar, LinkButton } from '@/components/ui'

export interface UserMenuUser {
  name: string
  role: 'user' | 'admin'
}

export interface UserMenuProps {
  /** Sesi nyata dihubungkan pada M1-07; tanpa user, menu menampilkan tautan tamu. */
  user?: UserMenuUser | null
  onLogout?: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/masuk"
          className="inline-flex min-h-11 items-center rounded-sm px-2 text-small font-bold text-brown hover:underline"
        >
          Masuk
        </Link>
        <LinkButton to="/daftar" size="sm" variant="secondary">
          Daftar
        </LinkButton>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {user.role === 'admin' ? (
        <Link
          to="/admin"
          className="inline-flex min-h-11 items-center rounded-sm px-2 text-small font-bold text-brown hover:underline"
        >
          Admin
        </Link>
      ) : null}
      <Link
        to="/profil"
        className="inline-flex min-h-11 items-center gap-2 rounded-sm px-2 text-small font-bold text-brown hover:bg-surface/60"
      >
        <Avatar name={user.name} size="sm" />
        <span>{user.name}</span>
      </Link>
      {onLogout ? (
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex min-h-11 items-center rounded-sm px-2 text-small font-bold text-brown hover:underline"
        >
          Keluar
        </button>
      ) : null}
    </div>
  )
}
