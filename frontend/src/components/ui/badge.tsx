import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'danger'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  size?: BadgeSize
}

/*
 * Kontras terukur (WCAG AA, minimal 4,5:1):
 * neutral  #2B1B10 di atas #FBE8D5 = 13,90:1
 * accent   #2B1B10 di atas #DE876B = 6,14:1
 * success  #FFF7E5 di atas #2F6B4F = 5,90:1
 * danger   #FFF7E5 di atas #A3271C = 6,87:1
 */
const tones: Record<BadgeTone, string> = {
  neutral: 'bg-surface text-ink',
  accent: 'bg-accent text-ink',
  success: 'bg-success text-ink-inverse',
  danger: 'bg-danger text-ink-inverse',
}

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-label',
  md: 'px-2.5 py-1 text-small',
}

export function Badge({ tone = 'neutral', size = 'sm', className, children, ...rest }: BadgeProps) {
  return (
    <span
      {...rest}
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-bold whitespace-nowrap',
        tones[tone],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
