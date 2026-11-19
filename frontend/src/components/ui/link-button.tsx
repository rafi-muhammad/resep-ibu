import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { buttonStyles, type ButtonSize, type ButtonVariant } from './button-styles'

export interface LinkButtonProps extends Omit<ComponentProps<typeof Link>, 'className'> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
  leadingIcon?: ReactNode
  children: ReactNode
}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  leadingIcon,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <Link {...rest} className={buttonStyles({ variant, size, fullWidth, className })}>
      {leadingIcon}
      {children}
    </Link>
  )
}
