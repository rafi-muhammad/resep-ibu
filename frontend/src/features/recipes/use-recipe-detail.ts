import { useCallback, useEffect, useState } from 'react'

import { repositories } from '@/lib/api'
import type { Category, Recipe, User } from '@/lib/api/types'

export interface RecipeDetail {
  recipe: Recipe
  category: Category | null
  author: User | null
  related: Recipe[]
}

export interface RecipeDetailState {
  data: RecipeDetail | null
  loading: boolean
  notFound: boolean
  error: Error | null
  retry: () => void
}

/** Memuat detail resep aktif beserta kategori, penulis, dan tiga resep terkait. */
export function useRecipeDetail(slug: string | undefined): RecipeDetailState {
  const [data, setData] = useState<RecipeDetail | null>(null)
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

    repositories.recipes
      .getBySlug(slug)
      .then(async (recipe) => {
        if (!active) return

        if (!recipe || recipe.status !== 'active') {
          setNotFound(true)
          setLoading(false)
          return
        }

        const [categories, author, relatedResult] = await Promise.all([
          repositories.categories.list(),
          repositories.users.getById(recipe.authorId),
          repositories.recipes.list({
            category: recipe.categoryId,
            status: 'active',
            sort: 'terbaru',
            page: 1,
            perPage: 4,
          }),
        ])

        if (!active) return

        setData({
          recipe,
          category: categories.find((category) => category.id === recipe.categoryId) ?? null,
          author,
          related: relatedResult.items.filter((item) => item.id !== recipe.id).slice(0, 3),
        })
        setLoading(false)
      })
      .catch((cause: unknown) => {
        if (!active) return
        setError(cause instanceof Error ? cause : new Error('Gagal memuat resep.'))
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug, attempt])

  return { data, loading, notFound, error, retry }
}
