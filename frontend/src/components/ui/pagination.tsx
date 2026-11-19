import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/cn'

import { IconButton } from './icon-button'
import { getPageItems } from './pagination-utils'

export interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const items = getPageItems(page, totalPages)

  return (
    <nav aria-label="Navigasi halaman" className={cn('flex justify-center', className)}>
      <p className="sr-only" aria-live="polite">
        Halaman {page} dari {totalPages}
      </p>
      <ul className="flex flex-wrap items-center gap-1">
        <li>
          <IconButton
            label="Halaman sebelumnya"
            variant="ghost"
            icon={<ChevronLeft aria-hidden="true" className="h-5 w-5" />}
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
          />
        </li>

        {items.map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              <button
                type="button"
                aria-label={`Halaman ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => {
                  if (item !== page) onChange(item)
                }}
                className={cn(
                  'inline-flex h-11 w-11 items-center justify-center rounded-sm text-body font-bold transition-colors duration-fast',
                  item === page ? 'bg-brown text-ink-inverse' : 'text-brown hover:bg-surface',
                )}
              >
                {item}
              </button>
            </li>
          ) : (
            <li
              key={item}
              aria-hidden="true"
              className="inline-flex h-11 w-8 items-center justify-center text-muted"
            >
              …
            </li>
          ),
        )}

        <li>
          <IconButton
            label="Halaman berikutnya"
            variant="ghost"
            icon={<ChevronRight aria-hidden="true" className="h-5 w-5" />}
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
          />
        </li>
      </ul>
    </nav>
  )
}
