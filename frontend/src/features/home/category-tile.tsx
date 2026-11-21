import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Category } from '@/lib/api/types'

export interface CategoryTileProps {
  category: Category
}

export function CategoryTile({ category }: CategoryTileProps) {
  return (
    <Link
      to={`/kategori/${category.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-white shadow-sm transition-[transform,box-shadow] duration-base hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0"
    >
      <div className="aspect-[16/10] overflow-hidden bg-surface">
        <img
          src={category.image}
          alt={`Foto kategori ${category.name}`}
          width={800}
          height={500}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-base group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 p-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-bold text-brown">{category.name}</h3>
          <p className="text-small text-muted">{category.recipeCount} resep</p>
        </div>
        <ArrowRight
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-action transition-transform duration-base group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
        />
      </div>
    </Link>
  )
}
