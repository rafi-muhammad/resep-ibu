import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { repositories, type AuthRepository } from '@/lib/api'
import type { User } from '@/lib/api/types'

import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context'

export interface AuthProviderProps {
  children: ReactNode
  /** Untuk test atau adapter Phase 2; default memakai repository mock. */
  auth?: AuthRepository
}

export function AuthProvider({ children, auth = repositories.auth }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    let active = true

    auth
      .getSession()
      .then((session) => {
        if (!active) return
        setUser(session)
        setStatus(session ? 'authenticated' : 'anonymous')
      })
      .catch(() => {
        if (!active) return
        setUser(null)
        setStatus('anonymous')
      })

    return () => {
      active = false
    }
  }, [auth])

  const login = useCallback(
    async (email: string, password: string) => {
      const authenticated = await auth.login(email, password)
      setUser(authenticated)
      setStatus('authenticated')
      return authenticated
    },
    [auth],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const created = await auth.register({ name, email, password })
      setUser(created)
      setStatus('authenticated')
      return created
    },
    [auth],
  )

  const logout = useCallback(async () => {
    await auth.logout()
    setUser(null)
    setStatus('anonymous')
  }, [auth])

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, isDemo: true, login, register, logout }),
    [user, status, login, register, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
