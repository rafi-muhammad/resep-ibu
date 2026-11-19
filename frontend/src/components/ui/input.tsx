import { forwardRef, type InputHTMLAttributes } from 'react'

import { fieldStyles } from './field-styles'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, className, type = 'text', ...rest },
  ref,
) {
  return (
    <input
      {...rest}
      ref={ref}
      type={type}
      aria-invalid={invalid ? true : rest['aria-invalid']}
      className={fieldStyles({ invalid, extra: 'min-h-11 py-2', className })}
    />
  )
})
