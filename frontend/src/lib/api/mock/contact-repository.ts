import { seedMessages } from '@/mocks/messages'

import { ApiError } from '../errors'
import type { ContactRepository, CreateContactMessageInput } from '../repositories'
import type { ContactMessage } from '../types'
import { simulateLatency } from './latency'
import type { DemoStore } from './store'
import { createId, nowIso } from './utils'

export function createContactRepository(store: DemoStore): ContactRepository {
  function readMessages() {
    return store.read('messages', seedMessages)
  }

  function writeMessages(messages: ContactMessage[]) {
    store.write('messages', messages)
  }

  return {
    async create(input: CreateContactMessageInput) {
      await simulateLatency()

      const message: ContactMessage = {
        id: createId('message'),
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        subject: input.subject.trim(),
        message: input.message.trim(),
        read: false,
        createdAt: nowIso(),
      }

      writeMessages([message, ...readMessages()])
      return message
    },

    async list() {
      await simulateLatency()
      return readMessages().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },

    async markRead(id: string, read = true) {
      await simulateLatency()

      const messages = readMessages()
      const index = messages.findIndex((message) => message.id === id)
      const current = messages[index]

      if (!current) throw new ApiError('NOT_FOUND', 'Pesan tidak ditemukan.')

      const updated: ContactMessage = { ...current, read }
      const next = [...messages]
      next[index] = updated
      writeMessages(next)
      return updated
    },

    async remove(id: string) {
      await simulateLatency()

      const messages = readMessages()
      if (!messages.some((message) => message.id === id)) {
        throw new ApiError('NOT_FOUND', 'Pesan tidak ditemukan.')
      }

      writeMessages(messages.filter((message) => message.id !== id))
    },
  }
}
