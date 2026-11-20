import type { RecipeSort } from '@/lib/api/types'

/** Label urutan yang dipakai toolbar dan URL state. */
export const RECIPE_SORT_OPTIONS: { value: RecipeSort; label: string }[] = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'populer', label: 'Populer' },
  { value: 'az', label: 'A–Z' },
]

export const DEFAULT_RECIPE_SORT: RecipeSort = 'terbaru'

export function isRecipeSort(value: string): value is RecipeSort {
  return RECIPE_SORT_OPTIONS.some((option) => option.value === value)
}
