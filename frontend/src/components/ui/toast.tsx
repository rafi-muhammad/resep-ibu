import { CircleAlert, CircleCheck, Info, TriangleAlert, X, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

import { Button } from './button'
import { IconButton } from './icon-button'
import { ToastContext, type ToastInput, type ToastTone } from './toast-context'

interface ToastItem extends ToastInput {
  id: string
  tone: ToastTone
  duration: number
}

const toneStyles: Record<ToastTone, { icon: string; Icon: LucideIcon }> = {
  info: { icon: 'text-action', Icon: Info },
  success: { icon: 'text-success', Icon: CircleCheck },
  warning: { icon: 'text-brown', Icon: TriangleAlert },
  danger: { icon: 'text-danger', Icon: CircleAlert },
}

let toastCounter = 0

function nextToastId() {
  toastCounter += 1
  return `toast-${toastCounter}`
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const { id, title, description, tone, duration, action } = item
  const { icon, Icon } = toneStyles[tone]

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(id), duration)
    return () => window.clearTimeout(timer)
  }, [id, duration, onDismiss])

  return (
    <div className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-md border border-border bg-white p-4 text-ink shadow-md">
      <Icon aria-hidden="true" className={cn('mt-0.5 h-5 w-5 shrink-0', icon)} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-bold">{title}</p>
        {description ? <p className="text-small text-muted">{description}</p> : null}
        {action ? (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 self-start px-0 text-action"
            onClick={() => {
              action.onClick()
              onDismiss(id)
            }}
          >
            {action.label}
          </Button>
        ) : null}
      </div>
      <IconButton
        label="Tutup notifikasi"
        size="sm"
        icon={<X aria-hidden="true" className="h-4 w-4" />}
        onClick={() => onDismiss(id)}
        className="-mt-1 -mr-1"
      />
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const toast = useCallback((input: ToastInput) => {
    const id = nextToastId()
    const item: ToastItem = {
      ...input,
      id,
      tone: input.tone ?? 'info',
      duration: input.duration ?? 5000,
    }
    setItems((current) => [...current, item])
    return id
  }, [])

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-3 p-4"
      >
        {items.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
