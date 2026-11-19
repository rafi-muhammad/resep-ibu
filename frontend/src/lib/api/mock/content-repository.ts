import { seedAbout, seedTeam } from '@/mocks/content'

import { ApiError } from '../errors'
import type { ContentRepository, TeamMemberInput } from '../repositories'
import type { AboutContent, TeamMember } from '../types'
import type { ContentState } from './store'
import { simulateLatency } from './latency'
import type { DemoStore } from './store'
import { createId } from './utils'

const contentSeed: ContentState = { about: seedAbout, team: seedTeam }

export function createContentRepository(store: DemoStore): ContentRepository {
  function readContent() {
    return store.read('content', contentSeed)
  }

  function writeContent(content: ContentState) {
    store.write('content', content)
  }

  return {
    async getAbout() {
      await simulateLatency()
      return readContent().about
    },

    async updateAbout(input: AboutContent) {
      await simulateLatency()

      const content = readContent()
      writeContent({ ...content, about: input })
      return input
    },

    async listTeam() {
      await simulateLatency()
      return [...readContent().team].sort((a, b) => a.order - b.order)
    },

    async saveTeam(input: TeamMemberInput & { id?: string }) {
      await simulateLatency()

      const content = readContent()
      const existing = input.id ? content.team.find((member) => member.id === input.id) : undefined

      if (existing) {
        const updated: TeamMember = {
          ...existing,
          name: input.name.trim() || existing.name,
          role: input.role.trim() || existing.role,
          bio: input.bio.trim() ?? existing.bio,
          avatar: input.avatar ?? existing.avatar,
          status: input.status ?? existing.status,
          order: input.order ?? existing.order,
        }

        writeContent({
          ...content,
          team: content.team.map((member) => (member.id === updated.id ? updated : member)),
        })
        return updated
      }

      if (input.id) throw new ApiError('NOT_FOUND', 'Anggota tim tidak ditemukan.')

      const nextOrder =
        input.order ??
        content.team.reduce((highest, member) => Math.max(highest, member.order), 0) + 1

      const member: TeamMember = {
        id: createId('team'),
        name: input.name.trim(),
        role: input.role.trim(),
        bio: input.bio.trim(),
        avatar: input.avatar ?? '/media/avatars/default.webp',
        status: input.status ?? 'active',
        order: nextOrder,
      }

      writeContent({ ...content, team: [...content.team, member] })
      return member
    },

    async removeTeam(id: string) {
      await simulateLatency()

      const content = readContent()
      if (!content.team.some((member) => member.id === id)) {
        throw new ApiError('NOT_FOUND', 'Anggota tim tidak ditemukan.')
      }

      writeContent({
        ...content,
        team: content.team.filter((member) => member.id !== id),
      })
    },
  }
}
