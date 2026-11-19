import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'article' | 'section' | 'li' | 'aside'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
  children?: ReactNode
}

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
} as const

export function Card({
  as: Component = 'div',
  padding = 'md',
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Component
      {...rest}
      className={cn(
        'rounded-md border border-border bg-white',
        paddings[padding],
        interactive &&
          'transition-shadow duration-fast hover:shadow-md focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus',
        className,
      )}
    >
      {children}
    </Component>
  )
}
