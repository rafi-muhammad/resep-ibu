import { ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { Badge, SearchField } from '@/components/ui'
import type { Category, Recipe } from '@/lib/api/types'
import { cn } from '@/lib/cn'

export interface HomeHeroProps {
  featured: Recipe | null
  featuredCategory?: Category
  featuredLoading: boolean
  recipeTotal?: number
  categoryTotal?: number
  statsLoading: boolean
}

function StatValue({ value, loading }: { value?: number; loading: boolean }) {
  if (loading) {
    return (
      <>
        <span
          aria-hidden="true"
          className="inline-block h-7 w-10 animate-pulse rounded-sm bg-surface-strong"
        />
        <span className="sr-only">Memuat angka</span>
      </>
    )
  }

  return <>{value ?? '—'}</>
}

export function HomeHero({
  featured,
  featuredCategory,
  featuredLoading,
  recipeTotal,
  categoryTotal,
  statsLoading,
}: HomeHeroProps) {
  const navigate = useNavigate()

  return (
    <section
      aria-label="Sambutan"
      className="overflow-hidden rounded-lg border border-border bg-surface/60"
    >
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="flex flex-col gap-5 px-5 py-8 sm:px-8 sm:py-10 lg:justify-center lg:py-14 lg:pr-10 lg:pl-12">
          <p className="eyebrow text-action">Resep rumahan</p>

          <h1 className="text-display text-brown">Resep rumahan, dari dapur kami ke dapur kamu</h1>

          <p className="measure text-lg text-muted">
            Masakan sehari-hari yang mudah diikuti, lengkap dengan bahan dan langkah memasak untuk
            keluarga.
          </p>

          <SearchField
            id="home-search"
            label="Cari resep dari beranda"
            placeholder="Cari resep, bahan, atau ide masakan…"
            buttonLabel="Cari resep"
            onSubmit={(value) =>
              navigate(value ? `/resep?q=${encodeURIComponent(value)}` : '/resep')
            }
          />

          <dl
            aria-busy={statsLoading || undefined}
            className="mt-1 grid max-w-sm grid-cols-2 gap-4 border-t border-border pt-5"
          >
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-small text-muted">Resep aktif</dt>
              <dd className="text-h2 text-brown">
                <StatValue value={recipeTotal} loading={statsLoading} />
              </dd>
            </div>
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-small text-muted">Kategori</dt>
              <dd className="text-h2 text-brown">
                <StatValue value={categoryTotal} loading={statsLoading} />
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative order-first lg:order-last">
          {featured ? (
            <>
              <img
                src={featured.image}
                alt={`Foto hidangan untuk resep ${featured.title}`}
                width={1200}
                height={900}
                loading="eager"
                fetchPriority="high"
                className="h-full min-h-64 w-full object-cover sm:min-h-80 lg:min-h-[540px]"
              />
              <Link
                to={`/resep/${featured.slug}`}
                className={cn(
                  'group absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-md bg-white/95 p-4 shadow-sm backdrop-blur',
                  'transition-shadow duration-base hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                )}
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <Badge tone="accent">{featuredCategory?.name ?? 'Pilihan dapur'}</Badge>
                  <p className="truncate font-bold text-brown">{featured.title}</p>
                  <p className="text-small text-muted">Lihat resep pilihan</p>
                </div>
                <ArrowRight
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-action transition-transform duration-base group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                />
              </Link>
            </>
          ) : (
            <div
              aria-hidden="true"
              className={cn(
                'flex h-full min-h-64 items-center justify-center bg-surface sm:min-h-80 lg:min-h-[540px]',
                featuredLoading && 'animate-pulse',
              )}
            >
              <span className="text-display text-accent/70">RI</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
