import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { iconButtonStyles } from './button-styles'
import type { ButtonSize, ButtonVariant } from './button-styles'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Label aksesibel wajib; juga dipakai sebagai title. */
  label: string
  icon: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
}

export function IconButton({
  label,
  icon,
  variant = 'ghost',
  size = 'md',
  type = 'button',
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-label={label}
      title={label}
      className={iconButtonStyles({ variant, size, className })}
    >
      {icon}
    </button>
  )
}
