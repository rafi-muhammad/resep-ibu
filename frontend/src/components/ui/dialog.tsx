import { X } from 'lucide-react'
import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/cn'

import { IconButton } from './icon-button'

export type DialogSize = 'sm' | 'md' | 'lg'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  size?: DialogSize
  children?: ReactNode
  footer?: ReactNode
  closeOnBackdrop?: boolean
  className?: string
}

const sizes: Record<DialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Dialog({
  open,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  closeOnBackdrop = true,
  className,
}: DialogProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const panel = panelRef.current
    panel?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab' || !panel) return

      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector))
      if (focusables.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (!first || !last) return

      const active = document.activeElement
      const inside = active instanceof Node && panel.contains(active)

      if (event.shiftKey) {
        if (!inside || active === first) {
          event.preventDefault()
          last.focus()
        }
        return
      }

      if (!inside || active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
      previouslyFocused.current?.focus()
    }
  }, [open])

  if (!open) return null

  function handleBackdropMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (!closeOnBackdrop) return
    if (event.target === event.currentTarget) onCloseRef.current()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-inverse/60 p-4 sm:items-center"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-lg bg-white shadow-md focus:outline-none',
          sizes[size],
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <h2 id={titleId} className="text-h3 text-brown">
            {title}
          </h2>
          <IconButton
            label="Tutup dialog"
            size="sm"
            icon={<X aria-hidden="true" className="h-5 w-5" />}
            onClick={() => onCloseRef.current()}
            className="-mt-2 -mr-2"
          />
        </div>

        {children ? <div className="overflow-y-auto p-5 text-ink">{children}</div> : null}

        {footer ? (
          <div className="flex flex-wrap justify-end gap-3 border-t border-border p-5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
