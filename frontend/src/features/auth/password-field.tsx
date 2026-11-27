import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { IconButton, Input, type InputProps } from '@/components/ui'
import { cn } from '@/lib/cn'

export type PasswordFieldProps = Omit<InputProps, 'type'>

/** Input kata sandi dengan tombol tampil/sembunyikan yang dapat diakses. */
export function PasswordField({ className, ...rest }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input {...rest} type={visible ? 'text' : 'password'} className={cn('pr-12', className)} />
      <IconButton
        label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        aria-pressed={visible}
        icon={
          visible ? (
            <EyeOff aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Eye aria-hidden="true" className="h-5 w-5" />
          )
        }
        onClick={() => setVisible((value) => !value)}
        className="absolute right-1 top-1/2 -translate-y-1/2"
      />
    </div>
  )
}
