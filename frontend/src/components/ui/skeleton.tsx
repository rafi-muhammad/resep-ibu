import type { CSSProperties } from 'react'

import { cn } from '@/lib/cn'

export interface SkeletonProps {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

const roundedStyles = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const

export function Skeleton({ width, height, rounded = 'md', className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      style={{ width, height }}
      className={cn('animate-pulse bg-surface-strong', roundedStyles[rounded], className)}
    />
  )
}
