import type { RecipeSort } from '@/lib/api/types'
import { DEFAULT_RECIPE_SORT, isRecipeSort } from '@/lib/recipe-sort'

export interface RecipeListParams {
  q: string
  category: string
  sort: RecipeSort
  page: number
}

/** Membaca state daftar resep dari query string; nilai tidak valid memakai default. */
export function parseRecipeListParams(params: URLSearchParams): RecipeListParams {
  const rawSort = params.get('urutan') ?? ''
  const rawPage = Number(params.get('halaman') ?? '1')
  const page = Number.isFinite(rawPage) ? Math.floor(rawPage) : 1

  return {
    q: (params.get('q') ?? '').trim(),
    category: (params.get('kategori') ?? '').trim(),
    sort: isRecipeSort(rawSort) ? rawSort : DEFAULT_RECIPE_SORT,
    page: page >= 1 ? page : 1,
  }
}

/** Serialisasi state ke URL; nilai default dihilangkan agar URL tetap ringkas. */
export function buildRecipeListSearch(params: RecipeListParams): URLSearchParams {
  const search = new URLSearchParams()
  const q = params.q.trim()

  if (q) search.set('q', q)
  if (params.category) search.set('kategori', params.category)
  if (params.sort !== DEFAULT_RECIPE_SORT) search.set('urutan', params.sort)
  if (params.page > 1) search.set('halaman', String(params.page))

  return search
}

/** Menggabungkan perubahan filter dan selalu kembali ke halaman 1 kecuali halaman diubah. */
export function updateRecipeListParams(
  current: RecipeListParams,
  patch: Partial<RecipeListParams>,
): RecipeListParams {
  return { ...current, ...patch, page: patch.page ?? 1 }
}
