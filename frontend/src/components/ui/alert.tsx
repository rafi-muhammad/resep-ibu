import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type AlertTone = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps {
  tone?: AlertTone
  title?: ReactNode
  children?: ReactNode
  className?: string
}

const toneStyles: Record<AlertTone, { container: string; icon: string; Icon: LucideIcon }> = {
  info: { container: 'border-border bg-surface', icon: 'text-action', Icon: Info },
  success: { container: 'border-success/40 bg-success/5', icon: 'text-success', Icon: CircleCheck },
  warning: {
    container: 'border-accent bg-accent/10',
    icon: 'text-brown',
    Icon: TriangleAlert,
  },
  danger: {
    container: 'border-danger/40 bg-danger/5',
    icon: 'text-danger',
    Icon: CircleAlert,
  },
}

export function Alert({ tone = 'info', title, children, className }: AlertProps) {
  const { container, icon, Icon } = toneStyles[tone]
  const isUrgent = tone === 'danger' || tone === 'warning'

  return (
    <div
      role={isUrgent ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-md border p-4 text-ink', container, className)}
    >
      <Icon aria-hidden="true" className={cn('mt-0.5 h-5 w-5 shrink-0', icon)} />
      <div className="flex flex-col gap-1">
        {title ? <p className="font-bold">{title}</p> : null}
        {children ? <div className="text-small text-muted">{children}</div> : null}
      </div>
    </div>
  )
}
