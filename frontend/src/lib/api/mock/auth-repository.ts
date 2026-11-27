import { seedCredentials, DEMO_PASSWORD } from '@/mocks/credentials'
import { seedUsers } from '@/mocks/users'

import { ApiError } from '../errors'
import type { AuthRepository, RegisterInput } from '../repositories'
import type { User } from '../types'
import { hashPassword } from './hash'
import { simulateLatency } from './latency'
import type { DemoStore, SessionState } from './store'
import { createUserRepository } from './user-repository'
import { createId, nowIso } from './utils'

export { DEMO_PASSWORD }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function invalidCredentials(): ApiError {
  // Pesan sengaja sama untuk email tidak dikenal, kata sandi salah, dan akun non-aktif.
  return new ApiError('UNAUTHORIZED', 'Email atau kata sandi salah.')
}

export function createAuthRepository(store: DemoStore): AuthRepository {
  function readUsers() {
    return store.read('users', seedUsers)
  }

  function readCredentials() {
    return store.read('credentials', seedCredentials)
  }

  function startSession(userId: string) {
    const session: SessionState = { userId, startedAt: nowIso() }
    store.write('session', session)
  }

  function endSession() {
    store.remove('session')
  }

  return {
    async login(email: string, password: string) {
      await simulateLatency()

      const normalized = email.trim().toLowerCase()
      const user = readUsers().find((candidate) => candidate.email.toLowerCase() === normalized)

      if (!user || user.status !== 'active') throw invalidCredentials()

      const hash = readCredentials()[user.id]
      if (!hash || hash !== hashPassword(password)) throw invalidCredentials()

      startSession(user.id)
      return user
    },

    async register(input: RegisterInput) {
      await simulateLatency()

      const name = input.name.trim()
      const email = input.email.trim().toLowerCase()

      if (name.length < 2 || name.length > 80) {
        throw new ApiError('VALIDATION', 'Nama harus 2–80 karakter.', {
          name: 'Nama harus 2–80 karakter.',
        })
      }

      if (!EMAIL_PATTERN.test(email)) {
        throw new ApiError('VALIDATION', 'Format email tidak valid.', {
          email: 'Masukkan alamat email yang valid.',
        })
      }

      if (input.password.length < 8) {
        throw new ApiError('VALIDATION', 'Kata sandi minimal 8 karakter.', {
          password: 'Kata sandi minimal 8 karakter.',
        })
      }

      const users = readUsers()
      if (users.some((user) => user.email.toLowerCase() === email)) {
        throw new ApiError('CONFLICT', 'Email sudah terdaftar.', {
          email: 'Email sudah terdaftar.',
        })
      }

      const user: User = {
        id: createId('user'),
        name,
        email,
        role: 'user',
        bio: '',
        avatar: '/media/avatars/default.webp',
        status: 'active',
        joinedAt: nowIso(),
      }

      store.write('users', [...users, user])
      store.write('credentials', {
        ...readCredentials(),
        [user.id]: hashPassword(input.password),
      })
      startSession(user.id)

      return user
    },

    async logout() {
      await simulateLatency()
      endSession()
    },

    async updateProfile(input) {
      const session = store.read('session', null)
      if (!session) throw new ApiError('UNAUTHORIZED', 'Sesi tidak ditemukan.')

      // Validasi email unik dan penulisan pengguna tetap satu sumber: user repository.
      return createUserRepository(store).updateProfile(session.userId, input)
    },

    async changePassword(currentPassword: string, newPassword: string) {
      await simulateLatency()

      const session = store.read('session', null)
      if (!session) throw new ApiError('UNAUTHORIZED', 'Sesi tidak ditemukan.')

      const credentials = readCredentials()
      const currentHash = credentials[session.userId]

      if (!currentHash || currentHash !== hashPassword(currentPassword)) {
        throw new ApiError('UNAUTHORIZED', 'Kata sandi saat ini salah.', {
          currentPassword: 'Kata sandi saat ini salah.',
        })
      }

      if (newPassword.length < 8) {
        throw new ApiError('VALIDATION', 'Kata sandi baru minimal 8 karakter.', {
          newPassword: 'Kata sandi baru minimal 8 karakter.',
        })
      }

      if (newPassword === currentPassword) {
        throw new ApiError('VALIDATION', 'Kata sandi baru harus berbeda dari yang sekarang.', {
          newPassword: 'Kata sandi baru harus berbeda dari yang sekarang.',
        })
      }

      store.write('credentials', {
        ...credentials,
        [session.userId]: hashPassword(newPassword),
      })
    },

    async getSession() {
      const session = store.read('session', null)
      if (!session) return null

      const user = readUsers().find((candidate) => candidate.id === session.userId)

      if (!user || user.status !== 'active') {
        endSession()
        return null
      }

      return user
    },
  }
}
