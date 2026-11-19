import { cn } from '@/lib/cn'

export interface FieldStyleOptions {
  invalid?: boolean
  className?: string
  /** Kelas tambahan khusus tipe kontrol, dimerge setelah style dasar. */
  extra?: string
}

export function fieldStyles({ invalid = false, className, extra }: FieldStyleOptions = {}) {
  return cn(
    'block w-full rounded-sm border bg-white px-3 text-body text-ink transition-colors duration-fast placeholder:text-muted/70 disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted',
    invalid ? 'border-danger' : 'border-field-border hover:border-brown',
    extra,
    className,
  )
}
