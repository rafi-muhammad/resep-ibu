import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from './use-auth'

/** Logout demo lalu arahkan ke halaman masuk tanpa menyimpan riwayat route terproteksi. */
export function useLogout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return useCallback(async () => {
    await logout()
    navigate('/masuk', { replace: true })
  }, [logout, navigate])
}
