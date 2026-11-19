import { createContext } from 'react'

import type { AuthRepository } from '@/lib/api'
import type { User } from '@/lib/api/types'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export interface AuthContextValue {
  user: User | null
  status: AuthStatus
  /** Selalu true pada Phase 1; dipakai UI untuk menandai mode demo. */
  isDemo: true
  login: (email: string, password: string) => Promise<User>
  register: (name: string, email: string, password: string) => Promise<User>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export type { AuthRepository }
