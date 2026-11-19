import { forwardRef, type TextareaHTMLAttributes } from 'react'

import { fieldStyles } from './field-styles'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid = false, className, rows = 4, ...rest },
  ref,
) {
  return (
    <textarea
      {...rest}
      ref={ref}
      rows={rows}
      aria-invalid={invalid ? true : rest['aria-invalid']}
      className={fieldStyles({ invalid, extra: 'min-h-28 py-3', className })}
    />
  )
})
