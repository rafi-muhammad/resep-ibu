import { useCallback, useEffect, useState } from 'react'

import { repositories } from '@/lib/api'
import type { Category } from '@/lib/api/types'

export interface CategoriesState {
  categories: Category[]
  loading: boolean
  error: Error | null
  retry: () => void
}

/** Tujuh kategori dengan jumlah resep terhitung dari data. */
export function useCategories(): CategoriesState {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => {
    setAttempt((value) => value + 1)
  }, [])

  useEffect(() => {
    let active = true

    // Status loading dimulai ulang setiap percobaan.
    // oxlint-disable-next-line react/set-state-in-effect
    setLoading(true)
    setError(null)

    repositories.categories
      .list()
      .then((result) => {
        if (!active) return
        setCategories(result)
        setLoading(false)
      })
      .catch((cause: unknown) => {
        if (!active) return
        setError(cause instanceof Error ? cause : new Error('Gagal memuat kategori.'))
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [attempt])

  return { categories, loading, error, retry }
}
