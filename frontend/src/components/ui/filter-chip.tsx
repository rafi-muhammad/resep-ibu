import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

export interface FilterChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  selected?: boolean
  onToggle?: () => void
  children: ReactNode
}

export function FilterChip({
  selected = false,
  onToggle,
  className,
  children,
  ...rest
}: FilterChipProps) {
  return (
    <button
      {...rest}
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-small font-bold transition-colors duration-fast',
        selected
          ? 'border-brown bg-brown text-ink-inverse hover:bg-inverse'
          : 'border-field-border bg-transparent text-brown hover:bg-surface',
        className,
      )}
    >
      {children}
    </button>
  )
}
