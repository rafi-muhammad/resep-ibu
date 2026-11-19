import { seedUsers } from '@/mocks/users'

import { ApiError } from '../errors'
import type { UpdateProfileInput, UserRepository } from '../repositories'
import type { Status, User } from '../types'
import { simulateLatency } from './latency'
import type { DemoStore } from './store'

export function createUserRepository(store: DemoStore): UserRepository {
  function readUsers() {
    return store.read('users', seedUsers)
  }

  function writeUsers(users: User[]) {
    store.write('users', users)
  }

  return {
    async list() {
      await simulateLatency()
      return readUsers()
    },

    async getById(id: string) {
      await simulateLatency()
      return readUsers().find((user) => user.id === id) ?? null
    },

    async updateProfile(id: string, input: UpdateProfileInput) {
      await simulateLatency()

      const users = readUsers()
      const index = users.findIndex((user) => user.id === id)
      const current = users[index]

      if (!current) throw new ApiError('NOT_FOUND', 'Pengguna tidak ditemukan.')

      const email = input.email?.trim().toLowerCase()

      if (email && users.some((user) => user.id !== id && user.email.toLowerCase() === email)) {
        throw new ApiError('CONFLICT', 'Email sudah dipakai akun lain.', {
          email: 'Email sudah dipakai akun lain.',
        })
      }

      const updated: User = {
        ...current,
        name: input.name?.trim() || current.name,
        email: email || current.email,
        bio: input.bio?.trim() ?? current.bio,
        avatar: input.avatar ?? current.avatar,
      }

      const next = [...users]
      next[index] = updated
      writeUsers(next)
      return updated
    },

    async updateStatus(id: string, status: Status) {
      await simulateLatency()

      const users = readUsers()
      const index = users.findIndex((user) => user.id === id)
      const current = users[index]

      if (!current) throw new ApiError('NOT_FOUND', 'Pengguna tidak ditemukan.')

      const updated: User = { ...current, status }
      const next = [...users]
      next[index] = updated
      writeUsers(next)
      return updated
    },
  }
}
