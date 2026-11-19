import { cloneElement, type ReactElement, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

export interface FormFieldProps {
  /** ID kontrol; juga menjadi dasar ID pesan bantuan dan error. */
  id: string
  label: ReactNode
  error?: string
  hint?: string
  required?: boolean
  children: ReactElement
  className?: string
  /** Sembunyikan label secara visual, tetap tersedia untuk pembaca layar. */
  hideLabel?: boolean
}

export function FormField({
  id,
  label,
  error,
  hint,
  required = false,
  children,
  className,
  hideLabel = false,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  const control = cloneElement(children as ReactElement<Record<string, unknown>>, {
    id,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
    invalid: Boolean(error),
  })

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className={cn('text-small font-bold text-brown', hideLabel && 'sr-only')}>
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-danger">
            *
          </span>
        ) : null}
      </label>

      {control}

      {hint ? (
        <p id={hintId} className="text-small text-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="text-small font-bold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
