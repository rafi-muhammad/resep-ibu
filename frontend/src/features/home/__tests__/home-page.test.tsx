import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { routes } from '@/app/router'
import { repositories } from '@/lib/api'

function renderHome() {
  const router = createMemoryRouter(routes, { initialEntries: ['/'] })
  const view = render(<RouterProvider router={router} />)
  return { router, ...view }
}

function region(name: string) {
  return within(screen.getByRole('region', { name }))
}

beforeEach(() => {
  vi.stubEnv('VITE_MOCK_LATENCY', '0')
  window.localStorage.clear()
  Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('beranda', () => {
  it('menampilkan hero dengan statistik yang sama dengan data', async () => {
    renderHome()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Resep rumahan, dari dapur kami ke dapur kamu',
      }),
    ).toBeVisible()

    const recipeStat = region('Sambutan').getByText('Resep aktif').parentElement as HTMLElement
    const categoryStat = region('Sambutan').getByText('Kategori').parentElement as HTMLElement

    expect(await within(recipeStat).findByText('24')).toBeVisible()
    expect(await within(categoryStat).findByText('7')).toBeVisible()
    expect(screen.queryByText(/5\.000/)).not.toBeInTheDocument()
  })

  it('mengirim pencarian hero ke daftar resep', async () => {
    const user = userEvent.setup()
    const { router } = renderHome()

    await screen.findAllByRole('article')
    await user.type(region('Sambutan').getByRole('searchbox'), 'soto')
    await user.click(region('Sambutan').getByRole('button', { name: 'Cari resep' }))

    expect(router.state.location.pathname).toBe('/resep')
    expect(router.state.location.search).toBe('?q=soto')
  })

  it('menampilkan 5 populer, 7 kategori, dan 6 terbaru dengan tautan benar', async () => {
    renderHome()

    const popular = region('Resep populer')
    const popularCards = await popular.findAllByRole('article')
    expect(popularCards).toHaveLength(5)
    expect(
      within(popularCards[0] as HTMLElement).getByRole('heading', { level: 3 }),
    ).toHaveTextContent('Soto Ayam Kampung')
    expect(within(popularCards[0] as HTMLElement).getByRole('link')).toHaveAttribute(
      'href',
      '/resep/soto-ayam-kampung',
    )
    expect(popular.getByRole('link', { name: 'Lihat semua' })).toHaveAttribute(
      'href',
      '/resep/populer',
    )

    const categoryRegion = region('Kategori')
    const categoryList = categoryRegion.getByRole('list')
    const categoryLinks = within(categoryList).getAllByRole('link')
    expect(categoryLinks).toHaveLength(7)
    const berkuah = within(categoryList).getByRole('link', { name: /Makanan Berkuah/ })
    expect(berkuah).toHaveAttribute('href', '/kategori/makanan-berkuah')
    expect(within(berkuah).getByText(/\d+ resep/)).toBeVisible()

    const latest = region('Resep terbaru')
    expect(await latest.findAllByRole('article')).toHaveLength(6)
    expect(latest.getByRole('link', { name: 'Semua resep' })).toHaveAttribute('href', '/resep')
  })

  it('menampilkan CTA berbagi dan tidak ada gambar rusak', async () => {
    renderHome()

    await screen.findAllByRole('article')

    expect(region('Bagikan resep').getByRole('link', { name: 'Bagikan resep' })).toHaveAttribute(
      'href',
      '/bagikan',
    )

    for (const image of Array.from(document.querySelectorAll('img'))) {
      expect(image.getAttribute('src')).toMatch(/^\/media\//)
      expect(image.getAttribute('alt')?.trim()).not.toBe('')
    }
  })

  it('memuat ulang hanya section populer saat terjadi error lokal', async () => {
    const user = userEvent.setup()
    vi.spyOn(repositories.recipes, 'list').mockRejectedValueOnce(new Error('gagal'))

    renderHome()

    const popular = region('Resep populer')
    expect(
      await popular.findByRole('heading', { name: 'Resep populer gagal dimuat' }),
    ).toBeVisible()

    // Section lain tetap tampil.
    expect(await region('Resep terbaru').findAllByRole('article')).toHaveLength(6)
    expect(within(region('Kategori').getByRole('list')).getAllByRole('link')).toHaveLength(7)

    await user.click(popular.getByRole('button', { name: 'Coba lagi' }))

    expect(await popular.findAllByRole('article')).toHaveLength(5)
  })
})
