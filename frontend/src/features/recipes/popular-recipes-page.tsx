import { Flame, SearchX } from 'lucide-react'

import { RecipeGrid } from '@/components/recipe'
import { EmptyState, ErrorState, LinkButton, PageHeader } from '@/components/ui'
import { useCategories } from '@/features/categories/use-categories'

import { useRecipeList } from './use-recipe-list'

const POPULAR_PARAMS = { q: '', category: '', sort: 'populer', page: 1 } as const

export function PopularRecipesPage() {
  const { categories } = useCategories()
  const { data, loading, error, retry } = useRecipeList(POPULAR_PARAMS, 10)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Katalog"
        title="Pilihan populer"
        description="Sepuluh resep dengan urutan popularitas internal. Bukan jumlah kunjungan atau penilaian pembaca."
        actions={
          <LinkButton to="/resep" variant="secondary">
            Lihat semua resep
          </LinkButton>
        }
      />

      {error ? (
        <ErrorState
          title="Resep populer gagal dimuat"
          description="Daftar resep belum bisa ditampilkan. Coba lagi sebentar."
          onRetry={retry}
        />
      ) : loading ? (
        <RecipeGrid recipes={[]} categories={categories} loading skeletonCount={6} />
      ) : data && data.items.length > 0 ? (
        <RecipeGrid recipes={data.items} categories={categories} />
      ) : (
        <EmptyState
          icon={<SearchX className="h-6 w-6" />}
          title="Belum ada resep populer"
          description="Saat ini belum ada resep aktif untuk ditampilkan."
          action={
            <LinkButton to="/resep" variant="secondary">
              Jelajahi semua resep
            </LinkButton>
          }
        />
      )}

      <p className="flex items-center gap-2 text-small text-muted">
        <Flame aria-hidden="true" className="h-4 w-4 text-action" />
        Urutan memakai metrik popularitas internal, bukan angka kunjungan.
      </p>
    </div>
  )
}
