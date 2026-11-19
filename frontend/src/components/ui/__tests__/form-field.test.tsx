import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { FormField, Input, Textarea } from '@/components/ui'

describe('FormField', () => {
  it('menghubungkan label, hint, dan error ke kontrol', async () => {
    const user = userEvent.setup()

    render(
      <FormField
        id="email"
        label="Email"
        hint="Kami tidak mengirim spam."
        error="Email wajib diisi."
        required
      >
        <Input />
      </FormField>,
    )

    const input = screen.getByLabelText(/email/i)
    expect(input).toHaveAttribute('id', 'email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', 'email-hint email-error')

    expect(screen.getByText('Kami tidak mengirim spam.')).toHaveAttribute('id', 'email-hint')
    const error = screen.getByRole('alert')
    expect(error).toHaveTextContent('Email wajib diisi.')
    expect(error).toHaveAttribute('id', 'email-error')

    await user.tab()
    expect(input).toHaveFocus()
  })

  it('tetap mengaitkan label tanpa error dan hint', () => {
    render(
      <FormField id="nama" label="Nama">
        <Input />
      </FormField>,
    )

    const input = screen.getByLabelText('Nama')
    expect(input).not.toHaveAttribute('aria-invalid')
    expect(input).not.toHaveAttribute('aria-describedby')
  })

  it('menerapkan state invalid ke textarea', () => {
    render(
      <FormField id="pesan" label="Pesan" error="Pesan terlalu pendek.">
        <Textarea />
      </FormField>,
    )

    expect(screen.getByLabelText('Pesan')).toHaveAttribute('aria-invalid', 'true')
  })
})
