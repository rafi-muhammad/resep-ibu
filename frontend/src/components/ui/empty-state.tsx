import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <section
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-surface/40 px-6 py-12 text-center',
        className,
      )}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-brown"
        >
          {icon}
        </span>
      ) : null}
      <h2 className="text-h3 text-brown">{title}</h2>
      {description ? <p className="measure text-body text-muted">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </section>
  )
}
