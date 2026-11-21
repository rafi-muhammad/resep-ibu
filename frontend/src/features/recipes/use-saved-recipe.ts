import { useCallback, useEffect, useState } from 'react'

import { repositories } from '@/lib/api'

export interface SavedRecipeState {
  saved: boolean
  checking: boolean
  busy: boolean
  /** Mengembalikan status simpan terbaru; null bila tidak ada sesi. */
  toggle: () => Promise<boolean | null>
}

/** Status simpan resep untuk pengguna aktif; tamu selalu `false`. */
export function useSavedRecipe(
  recipeId: string | undefined,
  userId: string | undefined,
): SavedRecipeState {
  const [saved, setSaved] = useState(false)
  const [checking, setChecking] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true

    if (!recipeId || !userId) {
      // oxlint-disable-next-line react/set-state-in-effect
      setSaved(false)
      setChecking(false)
      return () => {
        active = false
      }
    }

    // oxlint-disable-next-line react/set-state-in-effect
    setChecking(true)

    repositories.recipes
      .listSaved(userId)
      .then((items) => {
        if (!active) return
        setSaved(items.some((item) => item.id === recipeId))
        setChecking(false)
      })
      .catch(() => {
        if (!active) return
        setChecking(false)
      })

    return () => {
      active = false
    }
  }, [recipeId, userId])

  const toggle = useCallback(async () => {
    if (!recipeId || !userId) return null

    setBusy(true)

    try {
      if (saved) {
        await repositories.recipes.unsave(userId, recipeId)
        setSaved(false)
        return false
      }

      await repositories.recipes.save(userId, recipeId)
      setSaved(true)
      return true
    } finally {
      setBusy(false)
    }
  }, [recipeId, userId, saved])

  return { saved, checking, busy, toggle }
}
