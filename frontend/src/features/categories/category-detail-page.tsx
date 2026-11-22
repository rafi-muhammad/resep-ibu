import { SearchX } from 'lucide-react'
import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { CategoryHero, RecipeGrid } from '@/components/recipe'
import {
  Breadcrumbs,
  EmptyState,
  ErrorState,
  LinkButton,
  Pagination,
  SectionHeader,
  Skeleton,
} from '@/components/ui'
import { NotFoundPage } from '@/pages/not-found-page'

import { useCategoryDetail } from './use-category-detail'

function parsePage(value: string | null): number {
  const page = Number(value ?? '1')
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1
}

function CategoryDetailSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <span role="status" className="sr-only">
        Memuat kategori…
      </span>
      <Skeleton width={260} height={16} />
      <div className="grid overflow-hidden rounded-lg border border-border bg-white shadow-sm lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <Skeleton width={90} height={14} />
          <Skeleton width="60%" height={44} />
          <Skeleton width="90%" height={18} />
          <Skeleton width={120} height={28} rounded="full" />
        </div>
        <Skeleton rounded="sm" className="aspect-[16/10] w-full lg:aspect-auto" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={`card-skeleton-${index}`} rounded="md" className="h-72 w-full" />
        ))}
      </div>
    </div>
  )
}

/** Detail kategori: hero, grid resep 12 per halaman, 404, dan empty state. */
export function CategoryDetailPage() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePage(searchParams.get('halaman'))
  const { data, loading, notFound, error, retry } = useCategoryDetail(slug, page)

  useEffect(() => {
    if (!data || loading || data.recipes.page === page) return

    const next = new URLSearchParams()
    if (data.recipes.page > 1) next.set('halaman', String(data.recipes.page))
    setSearchParams(next, { replace: true })
  }, [data, loading, page, setSearchParams])

  if (loading) return <CategoryDetailSkeleton />

  if (error) {
    return (
      <ErrorState
        title="Kategori gagal dimuat"
        description="Halaman kategori belum bisa ditampilkan. Coba lagi sebentar."
        onRetry={retry}
      />
    )
  }

  if (notFound || !data) return <NotFoundPage />

  const { category, recipes } = data

  function changePage(nextPage: number) {
    const next = new URLSearchParams()
    if (nextPage > 1) next.set('halaman', String(nextPage))
    setSearchParams(next)
  }

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        items={[
          { label: 'Beranda', to: '/' },
          { label: 'Kategori', to: '/kategori' },
          { label: category.name },
        ]}
      />

      <CategoryHero category={category} />

      <p aria-live="polite" className="sr-only">
        {`${recipes.total} resep dalam kategori ${category.name}.`}
      </p>

      <section aria-label="Resep dalam kategori" className="flex flex-col gap-5">
        <SectionHeader
          title="Resep di kategori ini"
          description={
            recipes.total > 0
              ? `${recipes.total} resep aktif, diurutkan dari yang terbaru.`
              : 'Belum ada resep aktif di kategori ini.'
          }
          action={
            <LinkButton to="/resep" variant="secondary" size="sm">
              Semua resep
            </LinkButton>
          }
        />

        {recipes.items.length > 0 ? (
          <>
            <RecipeGrid recipes={recipes.items} categories={[category]} />
            <Pagination page={recipes.page} totalPages={recipes.totalPages} onChange={changePage} />
          </>
        ) : (
          <EmptyState
            icon={<SearchX className="h-6 w-6" />}
            title="Belum ada resep di kategori ini"
            description="Coba jelajahi kategori lain atau lihat seluruh resep yang tersedia."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <LinkButton to="/resep">Lihat semua resep</LinkButton>
                <LinkButton to="/kategori" variant="secondary">
                  Pilih kategori lain
                </LinkButton>
              </div>
            }
          />
        )}
      </section>
    </div>
  )
}
