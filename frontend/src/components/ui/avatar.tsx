import { useState } from 'react'

import { cn } from '@/lib/cn'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  src?: string
  name: string
  size?: AvatarSize
  className?: string
}

const sizes: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-label',
  md: 'h-10 w-10 text-small',
  lg: 'h-12 w-12 text-body',
  xl: 'h-16 w-16 text-h3',
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return `${first}${last}`.toUpperCase()
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const showFallback = !src || failed
  const label = name.trim() || 'Avatar pengguna'

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface font-bold text-brown',
        sizes[size],
        className,
      )}
    >
      {showFallback ? (
        <span role="img" aria-label={label}>
          {initials(name)}
        </span>
      ) : (
        <img
          src={src}
          alt={label}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  )
}
