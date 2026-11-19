import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'header' | 'footer' | 'section' | 'nav'
  children: ReactNode
}

/** Lebar maksimum 1200 px dengan gutter responsif. */
export function Container({ as: Component = 'div', className, children, ...rest }: ContainerProps) {
  return (
    <Component {...rest} className={cn('container-page', className)}>
      {children}
    </Component>
  )
}
