import { UtensilsCrossed } from 'lucide-react'

import { CategoryTile, CategoryTileSkeleton, RecipeGrid } from '@/components/recipe'
import { EmptyState, ErrorState, LinkButton, SectionHeader } from '@/components/ui'
import { useCategories } from '@/features/categories/use-categories'
import type { RecipeListParams } from '@/features/recipes'
import { useRecipeList } from '@/features/recipes'

import { HomeHero } from './home-hero'

const POPULAR_PARAMS: RecipeListParams = { q: '', category: '', sort: 'populer', page: 1 }
const LATEST_PARAMS: RecipeListParams = { q: '', category: '', sort: 'terbaru', page: 1 }

export function HomePage() {
  const popular = useRecipeList(POPULAR_PARAMS, 5)
  const latest = useRecipeList(LATEST_PARAMS, 6)
  const categories = useCategories()

  const featured = popular.data?.items[0] ?? null
  const featuredCategory = featured
    ? categories.categories.find((category) => category.id === featured.categoryId)
    : undefined

  const recipeTotal = latest.error ? undefined : latest.data?.total
  const categoryTotal = categories.error ? undefined : categories.categories.length

  return (
    <div className="flex flex-col gap-12 sm:gap-14 lg:gap-16">
      <HomeHero
        featured={featured}
        featuredCategory={featuredCategory}
        featuredLoading={popular.loading}
        recipeTotal={recipeTotal}
        categoryTotal={categoryTotal}
        statsLoading={latest.loading || categories.loading}
      />

      <section aria-label="Resep populer" className="flex flex-col gap-5">
        <SectionHeader
          title="Sedang populer"
          description="Lima resep pilihan berdasarkan popularitas internal, bukan jumlah kunjungan."
          action={
            <LinkButton to="/resep/populer" variant="secondary" size="sm">
              Lihat semua
            </LinkButton>
          }
        />

        {popular.error ? (
          <ErrorState
            title="Resep populer gagal dimuat"
            description="Bagian ini belum bisa ditampilkan. Coba lagi sebentar."
            onRetry={popular.retry}
          />
        ) : !popular.loading && (popular.data?.items.length ?? 0) === 0 ? (
          <EmptyState
            icon={<UtensilsCrossed className="h-6 w-6" />}
            title="Belum ada resep populer"
            description="Saat ini belum ada resep aktif untuk ditampilkan."
          />
        ) : (
          <RecipeGrid
            recipes={popular.data?.items ?? []}
            categories={categories.categories}
            loading={popular.loading}
            skeletonCount={5}
            variant="compact"
            className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          />
        )}
      </section>

      <section aria-label="Kategori" className="flex flex-col gap-5">
        <SectionHeader
          title="Jelajahi kategori"
          description="Pilih jenis masakan yang ingin dimasak hari ini."
          action={
            <LinkButton to="/kategori" variant="secondary" size="sm">
              Semua kategori
            </LinkButton>
          }
        />

        {categories.error ? (
          <ErrorState
            title="Kategori gagal dimuat"
            description="Bagian ini belum bisa ditampilkan. Coba lagi sebentar."
            onRetry={categories.retry}
          />
        ) : categories.loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 7 }, (_, index) => (
              <CategoryTileSkeleton key={`category-skeleton-${index}`} />
            ))}
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {categories.categories.map((category) => (
              <li key={category.id} className="h-full">
                <CategoryTile category={category} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Resep terbaru" className="flex flex-col gap-5">
        <SectionHeader
          title="Baru ditambahkan"
          description="Enam resep terbaru dari dapur kami."
          action={
            <LinkButton to="/resep" variant="secondary" size="sm">
              Semua resep
            </LinkButton>
          }
        />

        {latest.error ? (
          <ErrorState
            title="Resep terbaru gagal dimuat"
            description="Bagian ini belum bisa ditampilkan. Coba lagi sebentar."
            onRetry={latest.retry}
          />
        ) : !latest.loading && (latest.data?.items.length ?? 0) === 0 ? (
          <EmptyState
            icon={<UtensilsCrossed className="h-6 w-6" />}
            title="Belum ada resep terbaru"
            description="Saat ini belum ada resep aktif untuk ditampilkan."
          />
        ) : (
          <RecipeGrid
            recipes={latest.data?.items ?? []}
            categories={categories.categories}
            loading={latest.loading}
            skeletonCount={6}
          />
        )}
      </section>

      <section
        aria-label="Bagikan resep"
        className="overflow-hidden rounded-lg bg-brown px-5 py-9 sm:px-9 sm:py-11"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex max-w-xl flex-col gap-2">
            <h2 className="text-h2 text-ink-inverse">Punya resep andalan keluarga?</h2>
            <p className="text-body text-ink-inverse/85">
              Bagikan masakan yang paling sering kamu buat, lengkap dengan cerita dan tipsnya.
            </p>
          </div>
          <LinkButton
            to="/bagikan"
            variant="ghost"
            size="lg"
            className="bg-bg text-brown hover:bg-surface"
          >
            Bagikan resep
          </LinkButton>
        </div>
      </section>
    </div>
  )
}
