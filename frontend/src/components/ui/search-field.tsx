import { Search } from 'lucide-react'
import { useState, type FormEvent, type InputHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

import { fieldStyles } from './field-styles'
import { IconButton } from './icon-button'

export interface SearchFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onSubmit' | 'value' | 'defaultValue'
> {
  /** Nilai terkontrol. Bila diisi, komponen berada dalam mode controlled. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onSubmit: (value: string) => void
  label?: string
  placeholder?: string
  buttonLabel?: string
  invalid?: boolean
}

export function SearchField({
  value,
  defaultValue = '',
  onValueChange,
  onSubmit,
  label = 'Cari resep',
  placeholder = 'Cari resep…',
  buttonLabel = 'Cari',
  invalid = false,
  className,
  id,
  ...rest
}: SearchFieldProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const inputId = id ?? 'search-field'
  const currentValue = value ?? internalValue

  function handleChange(next: string) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(currentValue.trim())
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={cn('w-full', className)}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="relative flex items-center">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 h-5 w-5 text-muted"
        />
        <input
          {...rest}
          id={inputId}
          type="search"
          value={currentValue}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          onChange={(event) => handleChange(event.target.value)}
          className={fieldStyles({
            invalid,
            extra: 'min-h-11 py-2 pl-10 pr-14',
          })}
        />
        <IconButton
          type="submit"
          label={buttonLabel}
          variant="primary"
          icon={<Search aria-hidden="true" className="h-5 w-5" />}
          className="absolute right-1 rounded-sm"
        />
      </div>
    </form>
  )
}
