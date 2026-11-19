import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Avatar, Badge, Card, EmptyState, FilterChip } from '@/components/ui'

describe('Card', () => {
  it('merender elemen semantik sesuai prop as', () => {
    render(
      <Card as="article">
        <p>Isi kartu</p>
      </Card>,
    )

    const card = screen.getByText('Isi kartu').closest('article')
    expect(card).not.toBeNull()
    expect(card).toHaveClass('rounded-md')
    expect(card).toHaveClass('p-5')
  })

  it('menerapkan padding none dan state interaktif', () => {
    render(
      <Card padding="none" interactive>
        Kartu interaktif
      </Card>,
    )

    const card = screen.getByText('Kartu interaktif')
    expect(card).not.toHaveClass('p-5')
    expect(card).toHaveClass('hover:shadow-md')
  })
})

describe('Badge', () => {
  it.each([
    ['neutral', 'bg-surface'],
    ['accent', 'bg-accent'],
    ['success', 'bg-success'],
    ['danger', 'bg-danger'],
  ] as const)('menerapkan kelas tone %s', (tone, expected) => {
    render(<Badge tone={tone}>Label</Badge>)
    expect(screen.getByText('Label')).toHaveClass(expected)
  })

  it('memakai ukuran kecil secara default dan ukuran md saat diminta', () => {
    const { rerender } = render(<Badge>Kecil</Badge>)
    expect(screen.getByText('Kecil')).toHaveClass('text-label')

    rerender(<Badge size="md">Sedang</Badge>)
    expect(screen.getByText('Sedang')).toHaveClass('text-small')
  })

  /*
   * Rasio kontras terukur (WCAG AA, minimal 4,5:1 untuk teks kecil):
   * neutral 13,90:1 · accent 6,14:1 · success 5,90:1 · danger 6,87:1.
   * Semua kombinasi teks/latar badge lulus AA.
   */
  it('mempertahankan pasangan warna teks dan latar untuk kontras AA', () => {
    const { container } = render(
      <>
        <Badge tone="neutral">A</Badge>
        <Badge tone="accent">B</Badge>
        <Badge tone="success">C</Badge>
        <Badge tone="danger">D</Badge>
      </>,
    )

    const badges = Array.from(container.querySelectorAll('span'))
    expect(badges[0]).toHaveClass('text-ink')
    expect(badges[1]).toHaveClass('text-ink')
    expect(badges[2]).toHaveClass('text-ink-inverse')
    expect(badges[3]).toHaveClass('text-ink-inverse')
  })
})

describe('Avatar', () => {
  it('menampilkan inisial dari nama saat tanpa gambar', () => {
    render(<Avatar name="Siti Rahma" />)

    expect(screen.getByRole('img', { name: 'Siti Rahma' })).toHaveTextContent('SR')
  })

  it('memakai satu inisial untuk nama tunggal dan tanda tanya untuk nama kosong', () => {
    const { rerender } = render(<Avatar name="Budi" />)
    expect(screen.getByRole('img', { name: 'Budi' })).toHaveTextContent('B')

    rerender(<Avatar name="   " />)
    expect(screen.getByRole('img', { name: 'Avatar pengguna' })).toHaveTextContent('?')
  })

  it('menampilkan gambar dengan alt nama dan beralih ke inisial saat gagal dimuat', () => {
    render(<Avatar name="Siti Rahma" src="/foto/siti.webp" />)

    const image = screen.getByRole('img', { name: 'Siti Rahma' })
    expect(image.tagName).toBe('IMG')
    expect(image).toHaveAttribute('src', '/foto/siti.webp')

    fireEvent.error(image)
    expect(screen.getByRole('img', { name: 'Siti Rahma' })).toHaveTextContent('SR')
  })
})

describe('FilterChip', () => {
  it('mengumumkan state terpilih lewat aria-pressed dan dapat di-toggle dengan keyboard', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()

    render(
      <FilterChip selected onToggle={onToggle}>
        Berkuah
      </FilterChip>,
    )

    const chip = screen.getByRole('button', { name: 'Berkuah' })
    expect(chip).toHaveAttribute('aria-pressed', 'true')

    await user.tab()
    expect(chip).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(onToggle).toHaveBeenCalledTimes(1)

    await user.keyboard(' ')
    expect(onToggle).toHaveBeenCalledTimes(2)
  })

  it('menandai state tidak terpilih', () => {
    render(<FilterChip>Goreng</FilterChip>)
    expect(screen.getByRole('button', { name: 'Goreng' })).toHaveAttribute('aria-pressed', 'false')
  })
})

describe('EmptyState', () => {
  it('menampilkan judul, deskripsi, dan aksi', () => {
    render(
      <EmptyState
        title="Belum ada resep tersimpan"
        description="Simpan resep favoritmu agar mudah dibuka kembali."
        action={<button type="button">Jelajahi resep</button>}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Belum ada resep tersimpan' })).toBeInTheDocument()
    expect(
      screen.getByText('Simpan resep favoritmu agar mudah dibuka kembali.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Jelajahi resep' })).toBeInTheDocument()
  })

  it('menyembunyikan ikon dari pembaca layar', () => {
    const { container } = render(<EmptyState icon={<span>ikon</span>} title="Kosong" />)
    const icon = container.querySelector('[aria-hidden="true"]')
    expect(icon).not.toBeNull()
    expect(icon).toHaveTextContent('ikon')
  })
})
