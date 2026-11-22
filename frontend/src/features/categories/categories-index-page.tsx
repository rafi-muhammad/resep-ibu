import { Layers } from 'lucide-react'

import { CategoryTile, CategoryTileSkeleton } from '@/components/recipe'
import { EmptyState, ErrorState, LinkButton, PageHeader } from '@/components/ui'

import { useCategories } from './use-categories'

/** Indeks tujuh kategori dengan jumlah resep aktif terhitung dari data. */
export function CategoriesIndexPage() {
  const { categories, loading, error, retry } = useCategories()

  const description = loading
    ? 'Memuat kategori…'
    : error
      ? 'Kategori belum bisa ditampilkan.'
      : `${categories.length} kategori masakan untuk dijelajahi.`

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Jelajahi" title="Kategori" description={description} />

      <p aria-live="polite" className="sr-only">
        {loading ? 'Memuat kategori' : `${categories.length} kategori tampil.`}
      </p>

      {error ? (
        <ErrorState
          title="Kategori gagal dimuat"
          description="Daftar kategori belum bisa ditampilkan. Coba lagi sebentar."
          onRetry={retry}
        />
      ) : loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 7 }, (_, index) => (
            <CategoryTileSkeleton key={`category-skeleton-${index}`} />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<Layers className="h-6 w-6" />}
          title="Belum ada kategori"
          description="Kategori akan muncul di sini setelah tersedia."
          action={
            <LinkButton to="/resep" variant="secondary">
              Lihat semua resep
            </LinkButton>
          }
        />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id} className="h-full">
              <CategoryTile category={category} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
