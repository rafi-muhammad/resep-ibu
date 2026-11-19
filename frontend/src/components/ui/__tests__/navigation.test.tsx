import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { Breadcrumbs, PageHeader, SectionHeader } from '@/components/ui'

describe('Breadcrumbs', () => {
  it('menandai halaman terakhir dengan aria-current dan merender tautan sebelumnya', () => {
    render(
      <MemoryRouter>
        <Breadcrumbs
          items={[
            { label: 'Beranda', to: '/' },
            { label: 'Resep', to: '/resep' },
            { label: 'Soto Ayam' },
          ]}
        />
      </MemoryRouter>,
    )

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(nav).toBeInTheDocument()

    const home = screen.getByRole('link', { name: 'Beranda' })
    expect(home).toHaveAttribute('href', '/')

    const current = screen.getByText('Soto Ayam')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(current.closest('a')).toBeNull()

    expect(screen.getByRole('link', { name: 'Resep' })).toHaveAttribute('href', '/resep')
  })

  it('merender item tanpa tujuan sebagai teks biasa', () => {
    render(
      <MemoryRouter>
        <Breadcrumbs items={[{ label: 'Beranda', to: '/' }, { label: 'Tanpa tautan' }]} />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('link', { name: 'Tanpa tautan' })).not.toBeInTheDocument()
    expect(screen.getByText('Tanpa tautan')).toBeInTheDocument()
  })
})

describe('PageHeader', () => {
  it('merender judul h1, eyebrow, deskripsi, dan aksi', () => {
    render(
      <PageHeader
        eyebrow="Koleksi"
        title="Resep pilihan"
        description="Hidangan rumahan yang mudah diikuti."
        actions={<button type="button">Bagikan resep</button>}
      />,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Resep pilihan' })).toBeInTheDocument()
    expect(screen.getByText('Koleksi')).toBeInTheDocument()
    expect(screen.getByText('Hidangan rumahan yang mudah diikuti.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bagikan resep' })).toBeInTheDocument()
  })

  it('tidak merender eyebrow dan aksi bila tidak diberikan', () => {
    const { container } = render(<PageHeader title="Profil" />)
    expect(container.querySelector('.eyebrow')).toBeNull()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

describe('SectionHeader', () => {
  it('memakai heading level dua secara default dan bisa diganti', () => {
    const { rerender } = render(<SectionHeader title="Resep terbaru" />)
    expect(screen.getByRole('heading', { level: 2, name: 'Resep terbaru' })).toBeInTheDocument()

    rerender(<SectionHeader as="h3" title="Resep terbaru" />)
    expect(screen.getByRole('heading', { level: 3, name: 'Resep terbaru' })).toBeInTheDocument()
  })

  it('merender deskripsi dan aksi', () => {
    render(
      <SectionHeader
        title="Kategori"
        description="Pilih kategori favoritmu."
        action={<a href="/kategori">Lihat semua</a>}
      />,
    )

    expect(screen.getByText('Pilih kategori favoritmu.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Lihat semua' })).toBeInTheDocument()
  })
})
