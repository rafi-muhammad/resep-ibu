import { useCallback, useEffect, useState } from 'react'

import { repositories } from '@/lib/api'
import type { Category, Paginated, Recipe } from '@/lib/api/types'

export interface CategoryDetail {
  category: Category
  recipes: Paginated<Recipe>
}

export interface CategoryDetailState {
  data: CategoryDetail | null
  loading: boolean
  notFound: boolean
  error: Error | null
  retry: () => void
}

/** Memuat kategori aktif beserta satu halaman resep aktif (12 per halaman). */
export function useCategoryDetail(slug: string | undefined, page: number): CategoryDetailState {
  const [data, setData] = useState<CategoryDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
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
    setNotFound(false)
    setData(null)

    if (!slug) {
      setLoading(false)
      setNotFound(true)
      return () => {
        active = false
      }
    }

    repositories.categories
      .getBySlug(slug)
      .then(async (category) => {
        if (!active) return

        if (!category || category.status !== 'active') {
          setNotFound(true)
          setLoading(false)
          return
        }

        const recipes = await repositories.recipes.list({
          category: category.id,
          status: 'active',
          sort: 'terbaru',
          page,
          perPage: 12,
        })

        if (!active) return

        setData({ category, recipes })
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
  }, [slug, page, attempt])

  return { data, loading, notFound, error, retry }
}
