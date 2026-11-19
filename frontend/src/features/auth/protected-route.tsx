import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { Spinner } from '@/components/ui'
import type { Role } from '@/lib/api/types'

import { buildLoginPath } from './return-to'
import { useAuth } from './use-auth'

export interface ProtectedRouteProps {
  children: ReactNode
  /** Bila diisi, pengguna harus memiliki role ini. */
  requireRole?: Role
}

/**
 * Guard route akun dan admin.
 * - Belum login: redirect ke `/masuk?returnTo=<path saat ini>`.
 * - Role tidak cocok: redirect ke beranda (tidak membocorkan isi admin).
 */
export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { user, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" role="status">
        <Spinner size="lg" label="Memeriksa sesi" />
      </div>
    )
  }

  if (!user) {
    return (
      <Navigate to={buildLoginPath(location.pathname, location.search, location.hash)} replace />
    )
  }

  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
