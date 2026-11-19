import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { buttonStyles, type ButtonSize, type ButtonVariant } from './button-styles'
import { Spinner } from './spinner'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  disabled,
  type = 'button',
  className,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      {...rest}
      type={type}
      className={buttonStyles({ variant, size, fullWidth, className })}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={(event) => {
        if (loading) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
    >
      {loading ? <Spinner size="sm" label="Memproses" /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </button>
  )
}
