import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-sm font-bold transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-[0.55] aria-disabled:cursor-not-allowed aria-disabled:opacity-[0.55]'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-action text-ink-inverse hover:bg-action-hover active:bg-action-hover',
  secondary: 'border border-field-border bg-transparent text-brown hover:bg-surface',
  ghost: 'bg-transparent text-brown hover:bg-surface',
  danger: 'bg-danger text-ink-inverse hover:opacity-90',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-3 text-small',
  md: 'min-h-11 px-5 text-body',
  lg: 'min-h-12 px-6 text-lg',
}

export interface ButtonStyleOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
}

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}) {
  return cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)
}

export function iconButtonStyles({
  variant = 'ghost',
  size = 'md',
  className,
}: Omit<ButtonStyleOptions, 'fullWidth'> = {}) {
  return cn(
    base,
    variants[variant],
    size === 'lg' ? 'h-12 w-12' : 'h-11 w-11',
    'shrink-0 p-0',
    className,
  )
}
