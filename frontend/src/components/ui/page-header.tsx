import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  eyebrow?: string
  className?: string
}

export function PageHeader({ title, description, actions, eyebrow, className }: PageHeaderProps) {
  return (
    <div
      className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}
    >
      <div className="flex max-w-2xl flex-col gap-2">
        {eyebrow ? <p className="eyebrow text-action">{eyebrow}</p> : null}
        <h1 className="text-h1 text-brown">{title}</h1>
        {description ? <p className="text-body text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  )
}

export interface SectionHeaderProps {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  as?: 'h2' | 'h3'
  className?: string
}

export function SectionHeader({
  title,
  description,
  action,
  as: Heading = 'h2',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-3', className)}>
      <div className="flex flex-col gap-1">
        <Heading className="text-h2 text-brown">{title}</Heading>
        {description ? <p className="text-body text-muted">{description}</p> : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  )
}
