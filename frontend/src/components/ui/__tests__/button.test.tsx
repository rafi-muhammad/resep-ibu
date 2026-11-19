import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { Button, IconButton, LinkButton } from '@/components/ui'

describe('Button', () => {
  it('dapat diaktifkan dengan keyboard dan memanggil onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Simpan</Button>)

    await user.tab()
    const button = screen.getByRole('button', { name: 'Simpan' })
    expect(button).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)

    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('menonaktifkan tombol dan memblokir klik saat loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <Button loading onClick={onClick}>
        Simpan
      </Button>,
    )

    const button = screen.getByRole('button', { name: /simpan/i })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Memproses')

    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('menerapkan varian, ukuran, dan lebar penuh', () => {
    render(
      <Button variant="secondary" size="lg" fullWidth>
        Lanjut
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Lanjut' })
    expect(button).toHaveClass('border-field-border')
    expect(button).toHaveClass('w-full')
    expect(button).toHaveClass('min-h-12')
  })

  it('memakai type button secara default agar tidak men-submit form', () => {
    render(<Button>Batal</Button>)
    expect(screen.getByRole('button', { name: 'Batal' })).toHaveAttribute('type', 'button')
  })
})

describe('IconButton', () => {
  it('memiliki label aksesibel dan fokus keyboard', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<IconButton label="Tutup" icon={<span aria-hidden="true">x</span>} onClick={onClick} />)

    const button = screen.getByRole('button', { name: 'Tutup' })
    expect(button).toHaveAttribute('title', 'Tutup')

    await user.tab()
    expect(button).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('LinkButton', () => {
  it('merender tautan dengan tujuan dan menerima fokus keyboard', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LinkButton to="/resep">Lihat resep</LinkButton>
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: 'Lihat resep' })
    expect(link).toHaveAttribute('href', '/resep')

    await user.tab()
    expect(link).toHaveFocus()
  })
})
