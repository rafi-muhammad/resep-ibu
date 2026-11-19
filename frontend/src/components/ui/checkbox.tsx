import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  description?: ReactNode
  invalid?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, invalid = false, className, id, ...rest },
  ref,
) {
  return (
    <label
      className={cn(
        'flex min-h-11 cursor-pointer items-start gap-3 rounded-sm py-2 text-body text-ink',
        rest.disabled && 'cursor-not-allowed opacity-[0.55]',
        className,
      )}
      htmlFor={id}
    >
      <input
        {...rest}
        ref={ref}
        id={id}
        type="checkbox"
        aria-invalid={invalid ? true : rest['aria-invalid']}
        className={cn(
          'mt-0.5 h-5 w-5 shrink-0 rounded-sm border-field-border accent-action',
          invalid && 'outline-2 outline-offset-2 outline-danger',
        )}
      />
      <span className="flex flex-col gap-1">
        <span className="font-bold">{label}</span>
        {description ? <span className="text-small text-muted">{description}</span> : null}
      </span>
    </label>
  )
})
