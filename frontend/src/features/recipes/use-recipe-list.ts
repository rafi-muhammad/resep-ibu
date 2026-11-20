import { useCallback, useEffect, useState } from 'react'

import { repositories } from '@/lib/api'
import type { Paginated, Recipe } from '@/lib/api/types'

import type { RecipeListParams } from './query'

export interface RecipeListState {
  data: Paginated<Recipe> | null
  loading: boolean
  error: Error | null
  retry: () => void
}

/** Memuat daftar resep aktif sesuai state URL; hasil lama diabaikan saat parameter berubah. */
export function useRecipeList(params: RecipeListParams, perPage = 12): RecipeListState {
  const [data, setData] = useState<Paginated<Recipe> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => {
    setAttempt((value) => value + 1)
  }, [])

  useEffect(() => {
    let active = true

    // Status loading dimulai ulang setiap parameter berubah.
    // oxlint-disable-next-line react/set-state-in-effect
    setLoading(true)
    setError(null)

    repositories.recipes
      .list({
        q: params.q || undefined,
        category: params.category || undefined,
        sort: params.sort,
        page: params.page,
        perPage,
        status: 'active',
      })
      .then((result) => {
        if (!active) return
        setData(result)
        setLoading(false)
      })
      .catch((cause: unknown) => {
        if (!active) return
        setData(null)
        setError(cause instanceof Error ? cause : new Error('Gagal memuat resep.'))
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [params.q, params.category, params.sort, params.page, perPage, attempt])

  return { data, loading, error, retry }
}
