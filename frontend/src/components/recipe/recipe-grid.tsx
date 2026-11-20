import { Skeleton } from '@/components/ui'
import type { Category, Recipe } from '@/lib/api/types'
import { cn } from '@/lib/cn'

import { RecipeCard } from './recipe-card'

export interface RecipeGridProps {
  recipes: Recipe[]
  categories?: Category[]
  loading?: boolean
  skeletonCount?: number
  className?: string
}

function RecipeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-white shadow-sm">
      <Skeleton rounded="sm" className="aspect-[4/3] w-full" />
      <div className="flex flex-col gap-3 p-5">
        <div className="flex gap-2">
          <Skeleton width={72} height={20} rounded="full" />
          <Skeleton width={88} height={20} rounded="full" />
        </div>
        <Skeleton height={22} />
        <Skeleton width="80%" height={22} />
        <Skeleton height={16} />
        <Skeleton width="60%" height={16} />
      </div>
    </div>
  )
}

/** Grid resep responsif: 1 kolom < 640 px, 2 kolom ≥ 640 px, 3 kolom ≥ 1024 px. */
export function RecipeGrid({
  recipes,
  categories = [],
  loading = false,
  skeletonCount = 6,
  className,
}: RecipeGridProps) {
  const categoryById = new Map(categories.map((category) => [category.id, category]))

  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {loading
        ? Array.from({ length: skeletonCount }, (_, index) => (
            <RecipeCardSkeleton key={`skeleton-${index}`} />
          ))
        : recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              category={categoryById.get(recipe.categoryId)}
            />
          ))}
    </div>
  )
}
