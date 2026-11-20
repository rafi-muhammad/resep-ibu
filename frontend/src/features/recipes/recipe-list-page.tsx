import { SearchX } from 'lucide-react'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { RecipeFilters, RecipeGrid } from '@/components/recipe'
import { Button, EmptyState, ErrorState, PageHeader, Pagination } from '@/components/ui'
import { useCategories } from '@/features/categories/use-categories'
import type { RecipeSort } from '@/lib/api/types'

import {
  buildRecipeListSearch,
  parseRecipeListParams,
  updateRecipeListParams,
  type RecipeListParams,
} from './query'
import { useRecipeList } from './use-recipe-list'

export function RecipeListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const params = parseRecipeListParams(searchParams)
  const { categories, loading: categoriesLoading } = useCategories()
  const { data, loading, error, retry } = useRecipeList(params)

  useEffect(() => {
    if (categoriesLoading || !params.category) return

    const known = categories.some((category) => category.slug === params.category)
    if (!known) {
      setSearchParams(buildRecipeListSearch({ ...params, category: '', page: 1 }), {
        replace: true,
      })
    }
  }, [categories, categoriesLoading, params, setSearchParams])

  useEffect(() => {
    if (!data || loading || data.page === params.page) return

    setSearchParams(buildRecipeListSearch({ ...params, page: data.page }), {
      replace: true,
    })
  }, [data, loading, params, setSearchParams])

  function apply(patch: Partial<RecipeListParams>) {
    setSearchParams(buildRecipeListSearch(updateRecipeListParams(params, patch)))
  }

  const resultLabel = loading
    ? 'Memuat resep…'
    : data
      ? `${data.total} resep ditemukan`
      : 'Jelajahi seluruh resep yang tersedia.'

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Katalog" title="Semua resep" description={resultLabel} />

      <RecipeFilters
        q={params.q}
        category={params.category}
        sort={params.sort}
        categories={categories}
        onQueryChange={(value) => apply({ q: value })}
        onCategoryChange={(value) => apply({ category: value })}
        onSortChange={(value: RecipeSort) => apply({ sort: value })}
        onReset={() => setSearchParams(new URLSearchParams())}
      />

      <p aria-live="polite" className="sr-only">
        {loading ? 'Memuat daftar resep' : `Daftar diperbarui, ${data?.total ?? 0} resep tampil.`}
      </p>

      {error ? (
        <ErrorState
          title="Resep gagal dimuat"
          description="Daftar resep belum bisa ditampilkan. Periksa koneksi lalu coba lagi."
          onRetry={retry}
        />
      ) : loading ? (
        <RecipeGrid recipes={[]} categories={categories} loading skeletonCount={6} />
      ) : data && data.items.length > 0 ? (
        <>
          <RecipeGrid recipes={data.items} categories={categories} />
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onChange={(page) => apply({ page })}
          />
        </>
      ) : (
        <EmptyState
          icon={<SearchX className="h-6 w-6" />}
          title="Belum ada resep yang cocok"
          description="Coba kata kunci lain, pilih kategori berbeda, atau atur ulang filter."
          action={
            <Button variant="secondary" onClick={() => setSearchParams(new URLSearchParams())}>
              Atur ulang filter
            </Button>
          }
        />
      )}
    </div>
  )
}
