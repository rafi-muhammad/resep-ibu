import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { routes } from '@/app/router'
import { repositories } from '@/lib/api'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

beforeEach(() => {
  vi.stubEnv('VITE_MOCK_LATENCY', '0')
  window.localStorage.clear()
  Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('indeks kategori', () => {
  it('menampilkan tujuh kategori dengan jumlah resep dari data', async () => {
    renderAt('/kategori')

    expect(await screen.findByRole('heading', { level: 1, name: 'Kategori' })).toBeVisible()
    expect(await screen.findByText('7 kategori masakan untuk dijelajahi.')).toBeVisible()

    const tiles = await screen.findAllByRole('heading', { level: 3 })
    expect(tiles).toHaveLength(7)

    const expected: Array<[string, string, number]> = [
      ['Minuman', 'minuman', 3],
      ['Makanan Penutup', 'makanan-penutup', 4],
      ['Makanan Berkuah', 'makanan-berkuah', 4],
      ['Makanan Pedas', 'makanan-pedas', 4],
      ['Makanan Sehat', 'makanan-sehat', 4],
      ['Olahan Buah', 'olahan-buah', 3],
      ['Lainnya', 'lainnya', 2],
    ]

    for (const [name, slug, count] of expected) {
      const link = screen.getByRole('link', { name: new RegExp(name) })
      expect(link).toHaveAttribute('href', `/kategori/${slug}`)
      expect(within(link).getByText(`${count} resep`)).toBeVisible()
    }
  })

  it('menampilkan error dan memuat ulang daftar kategori', async () => {
    const user = userEvent.setup()
    vi.spyOn(repositories.categories, 'list').mockRejectedValueOnce(new Error('gagal'))

    renderAt('/kategori')

    expect(await screen.findByRole('heading', { name: 'Kategori gagal dimuat' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Coba lagi' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Kategori' })).toBeVisible()
    expect(await screen.findAllByRole('heading', { level: 3 })).toHaveLength(7)
  })
})

describe('detail kategori', () => {
  it('menampilkan hero dan seluruh resep kategori yang sama dengan hitungan tile', async () => {
    renderAt('/kategori/makanan-berkuah')

    expect(await screen.findByRole('heading', { level: 1, name: 'Makanan Berkuah' })).toBeVisible()
    expect(screen.getByText('Soto, sup, dan sayur berkuah yang menghangatkan.')).toBeVisible()
    expect(screen.getByText('4 resep')).toBeVisible()
    expect(screen.getByText('4 resep aktif, diurutkan dari yang terbaru.')).toBeVisible()

    const cards = await screen.findAllByRole('article')
    expect(cards).toHaveLength(4)
    expect(screen.queryByRole('navigation', { name: 'Navigasi halaman' })).toBeNull()

    const backLink = screen.getByRole('link', { name: 'Semua kategori' })
    expect(backLink).toHaveAttribute('href', '/kategori')
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible()
    expect(screen.getAllByRole('link', { name: 'Kategori' })[0]).toHaveAttribute(
      'href',
      '/kategori',
    )
  })

  it('mengoreksi nomor halaman di luar rentang ke halaman pertama', async () => {
    const router = renderAt('/kategori/makanan-berkuah?halaman=5')

    await screen.findByRole('heading', { level: 1, name: 'Makanan Berkuah' })

    await waitFor(() => {
      expect(router.state.location.search).not.toContain('halaman=5')
    })
    expect(await screen.findAllByRole('article')).toHaveLength(4)
  })

  it('menampilkan 404 untuk slug kategori yang tidak dikenal', async () => {
    renderAt('/kategori/tidak-ada')

    expect(await screen.findByRole('heading', { name: 'Halaman tidak ditemukan' })).toBeVisible()
  })

  it('menampilkan empty state dengan tautan keluar untuk kategori tanpa resep', async () => {
    const category = await repositories.categories.create({
      name: 'Kategori Uji',
      description: 'Kategori tanpa resep untuk pengujian.',
    })

    renderAt(`/kategori/${category.slug}`)

    expect(
      await screen.findByRole('heading', { name: 'Belum ada resep di kategori ini' }),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'Lihat semua resep' })).toHaveAttribute(
      'href',
      '/resep',
    )
    expect(screen.getByRole('link', { name: 'Pilih kategori lain' })).toHaveAttribute(
      'href',
      '/kategori',
    )
  })
})
