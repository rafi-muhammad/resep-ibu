import { useCallback, useEffect, useState } from 'react'

import { repositories } from '@/lib/api'
import type { AboutContent, TeamMember } from '@/lib/api/types'

export interface AboutData {
  about: AboutContent
  team: TeamMember[]
}

export interface AboutState {
  data: AboutData | null
  loading: boolean
  error: Error | null
  retry: () => void
}

/** Memuat konten Tentang Kami dan anggota tim aktif. */
export function useAbout(): AboutState {
  const [data, setData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => {
    setAttempt((value) => value + 1)
  }, [])

  useEffect(() => {
    let active = true

    // oxlint-disable-next-line react/set-state-in-effect
    setLoading(true)
    setError(null)

    Promise.all([repositories.content.getAbout(), repositories.content.listTeam()])
      .then(([about, team]) => {
        if (!active) return
        setData({ about, team: team.filter((member) => member.status === 'active') })
        setLoading(false)
      })
      .catch((cause: unknown) => {
        if (!active) return
        setError(cause instanceof Error ? cause : new Error('Gagal memuat konten tentang.'))
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [attempt])

  return { data, loading, error, retry }
}
