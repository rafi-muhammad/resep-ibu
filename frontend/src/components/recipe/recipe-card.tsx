import { Clock, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge, Card } from '@/components/ui'
import type { Category, Recipe } from '@/lib/api/types'
import { cn } from '@/lib/cn'

export interface RecipeCardProps {
  recipe: Recipe
  category?: Category
  /** `compact` dipakai rail 5 kartu di beranda; tanpa ringkasan dan CTA. */
  variant?: 'default' | 'compact'
  className?: string
}

export function RecipeCard({ recipe, category, variant = 'default', className }: RecipeCardProps) {
  const totalMinutes = recipe.prepMinutes + recipe.cookMinutes
  const compact = variant === 'compact'

  return (
    <Card
      as="article"
      padding="none"
      interactive
      className={cn(
        'group h-full overflow-hidden shadow-sm transition-[transform,box-shadow] duration-base hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
        className,
      )}
    >
      <Link
        to={`/resep/${recipe.slug}`}
        className="flex h-full flex-col rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <div className="aspect-[4/3] overflow-hidden bg-surface">
          <img
            src={recipe.image}
            alt={`Foto hidangan untuk resep ${recipe.title}`}
            width={1200}
            height={900}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-base group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
          />
        </div>

        <div className={cn('flex flex-1 flex-col gap-3', compact ? 'p-4' : 'p-5')}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{category?.name ?? 'Resep'}</Badge>
            <span className="inline-flex items-center gap-1 text-small text-muted">
              <Clock aria-hidden="true" className="h-4 w-4" />
              {totalMinutes > 0 ? `${totalMinutes} menit` : 'Tanpa masak'}
            </span>
            {compact ? null : (
              <span className="inline-flex items-center gap-1 text-small text-muted">
                <Users aria-hidden="true" className="h-4 w-4" />
                {recipe.servings} porsi
              </span>
            )}
          </div>

          <h3
            className={cn('line-clamp-2 text-brown', compact ? 'text-base font-bold' : 'text-h3')}
          >
            {recipe.title}
          </h3>

          {compact ? null : (
            <>
              <p className="line-clamp-2 text-small text-muted">{recipe.excerpt}</p>
              <p className="mt-auto text-small font-bold text-brown">Lihat resep</p>
            </>
          )}
        </div>
      </Link>
    </Card>
  )
}
