import { forwardRef, type SelectHTMLAttributes } from 'react'

import { fieldStyles } from './field-styles'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[]
  placeholder?: string
  invalid?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, placeholder, invalid = false, className, ...rest },
  ref,
) {
  return (
    <select
      {...rest}
      ref={ref}
      aria-invalid={invalid ? true : rest['aria-invalid']}
      className={fieldStyles({ invalid, extra: 'min-h-11 py-2 pr-9', className })}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  )
})
