import { Link } from 'react-router-dom'

import { Badge, LinkButton } from '@/components/ui'
import type { Category } from '@/lib/api/types'

export interface CategoryHeroProps {
  category: Category
}

/** Header kategori: foto, nama, deskripsi, jumlah resep, dan tautan indeks. */
export function CategoryHero({ category }: CategoryHeroProps) {
  return (
    <section
      aria-label={`Kategori ${category.name}`}
      className="overflow-hidden rounded-lg border border-border bg-white shadow-sm"
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
          <p className="eyebrow text-action">Kategori</p>
          <h1 className="text-h1 text-brown">{category.name}</h1>
          <p className="measure text-body text-muted">{category.description}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="accent">{category.recipeCount} resep</Badge>
            <LinkButton to="/kategori" variant="secondary" size="sm">
              Semua kategori
            </LinkButton>
          </div>
          <Link
            to="/resep"
            className="text-small font-bold text-action hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Lihat seluruh resep
          </Link>
        </div>
        <img
          src={category.image}
          alt={`Foto kategori ${category.name}`}
          width={840}
          height={525}
          className="h-full max-h-[360px] w-full object-cover lg:max-h-[420px]"
        />
      </div>
    </section>
  )
}
