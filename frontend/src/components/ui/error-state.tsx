import { TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/cn'

import { Button } from './button'

export interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

/** Blok error lokal untuk daftar atau panel; tidak menampilkan detail teknis. */
export function ErrorState({
  title = 'Data gagal dimuat',
  description = 'Terjadi kendala saat mengambil data. Coba lagi sebentar.',
  onRetry,
  retryLabel = 'Coba lagi',
  className,
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-danger/30 bg-danger/5 px-6 py-12 text-center',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger"
      >
        <TriangleAlert className="h-6 w-6" />
      </span>
      <h2 className="text-h3 text-brown">{title}</h2>
      <p className="measure text-body text-muted">{description}</p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry} className="mt-2">
          {retryLabel}
        </Button>
      ) : null}
    </section>
  )
}
