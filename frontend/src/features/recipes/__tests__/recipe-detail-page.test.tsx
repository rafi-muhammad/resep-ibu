import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AppProviders } from '@/app/providers'
import { routes } from '@/app/router'
import { repositories } from '@/lib/api'
import { STORAGE_NAMESPACE } from '@/lib/api/mock/store'

function renderDetail(path = '/resep/soto-ayam-kampung') {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return router
}

function seedSession(userId: string) {
  window.localStorage.setItem(
    `${STORAGE_NAMESPACE}session`,
    JSON.stringify({ userId, startedAt: new Date().toISOString() }),
  )
}

function region(name: string) {
  return screen.getByRole('region', { name })
}

function complementary(name: string) {
  return screen.getByRole('complementary', { name })
}

beforeEach(() => {
  vi.stubEnv('VITE_MOCK_LATENCY', '0')
  window.localStorage.clear()
  Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('halaman detail resep', () => {
  it('merender seluruh isi resep dari data', async () => {
    renderDetail()

    expect(
      await screen.findByRole(
        'heading',
        { level: 1, name: 'Soto Ayam Kampung' },
        { timeout: 5000 },
      ),
    ).toBeVisible()
    expect(screen.getByText('Kuah kuning hangat dengan ayam, tauge, dan telur.')).toBeVisible()
    expect(
      screen.getByText('Soto ayam adalah hidangan berkuah yang akrab di meja keluarga.'),
    ).toBeVisible()
    expect(screen.getByText('Diterbitkan 16 November 2026')).toBeVisible()
    expect(screen.getByText('Dapur Ibu')).toBeVisible()

    const categoryLinks = screen.getAllByRole('link', { name: 'Makanan Berkuah' })
    expect(categoryLinks).toHaveLength(2)
    for (const link of categoryLinks) {
      expect(link).toHaveAttribute('href', '/kategori/makanan-berkuah')
    }

    const summary = complementary('Ringkasan resep')
    expect(within(summary).getByText('Persiapan')).toBeVisible()
    expect(within(summary).getByText('20 menit')).toBeVisible()
    expect(within(summary).getByText('Memasak')).toBeVisible()
    expect(within(summary).getByText('45 menit')).toBeVisible()
    expect(within(summary).getByText('65 menit')).toBeVisible()
    expect(within(summary).getByText('4 porsi')).toBeVisible()
    expect(within(summary).getByText('Sedang')).toBeVisible()

    const ingredients = region('Bahan-bahan')
    for (const group of ['Bahan utama', 'Bumbu halus', 'Pelengkap']) {
      expect(within(ingredients).getByRole('heading', { name: group })).toBeVisible()
    }
    expect(within(ingredients).getAllByRole('listitem')).toHaveLength(13)
    expect(within(ingredients).getByText('2 cm kunyit')).toBeVisible()

    const steps = region('Langkah memasak')
    expect(within(steps).getAllByRole('listitem')).toHaveLength(5)
    expect(
      within(steps).getByText('Tumis bumbu halus hingga harum, lalu masukkan ke rebusan ayam.'),
    ).toBeVisible()

    const related = region('Resep terkait')
    const relatedCards = await within(related).findAllByRole('article')
    expect(relatedCards).toHaveLength(3)
    expect(within(related).queryByText('Soto Ayam Kampung')).toBeNull()

    expect(
      screen.getByRole('img', { name: /Foto hidangan untuk resep Soto Ayam Kampung/ }),
    ).toHaveAttribute('src', '/media/recipes/soto-ayam-kampung.webp')
    expect(screen.getByRole('button', { name: 'Simpan resep' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.getByRole('button', { name: 'Salin tautan' })).toBeVisible()
    expect(screen.queryByText(/rating|jumlah kunjungan|jumlah viewer/i)).toBeNull()
  })

  it('menampilkan 404 untuk slug yang tidak dikenal', async () => {
    renderDetail('/resep/tidak-ada')

    expect(
      await screen.findByRole('heading', { name: 'Halaman tidak ditemukan' }, { timeout: 5000 }),
    ).toBeVisible()
    expect(screen.queryByRole('heading', { level: 1, name: 'Soto Ayam Kampung' })).toBeNull()
  })

  it('meminta login lalu kembali ke resep saat tamu menyimpan', async () => {
    const user = userEvent.setup()
    const router = renderDetail()

    await screen.findByRole('heading', { level: 1, name: 'Soto Ayam Kampung' }, { timeout: 5000 })
    const save = screen.getByRole('button', { name: 'Simpan resep' })
    await waitFor(() => expect(save).toBeEnabled())

    await user.click(save)

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/masuk')
    })
    expect(router.state.location.search).toContain(
      `returnTo=${encodeURIComponent('/resep/soto-ayam-kampung')}`,
    )
    expect(await screen.findByText('Masuk untuk menyimpan resep')).toBeVisible()
  })

  it('menyimpan dan melepas simpanan untuk pengguna yang sudah masuk', async () => {
    seedSession('user-pembaca-1')
    const user = userEvent.setup()
    renderDetail()

    await screen.findByRole('heading', { level: 1, name: 'Soto Ayam Kampung' }, { timeout: 5000 })
    const save = screen.getByRole('button', { name: 'Simpan resep' })
    await waitFor(() => expect(save).toBeEnabled())

    await user.click(save)

    expect(await screen.findByRole('button', { name: 'Tersimpan' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(await screen.findByText('Resep disimpan.')).toBeVisible()

    const saved = await repositories.recipes.listSaved('user-pembaca-1')
    expect(saved.map((recipe) => recipe.slug)).toContain('soto-ayam-kampung')

    await user.click(screen.getByRole('button', { name: 'Tersimpan' }))

    expect(await screen.findByText('Resep dihapus dari simpanan.')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Simpan resep' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('menyalin tautan resep dan menampilkan toast', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    renderDetail()

    await screen.findByRole('heading', { level: 1, name: 'Soto Ayam Kampung' }, { timeout: 5000 })
    await user.click(screen.getByRole('button', { name: 'Salin tautan' }))

    expect(await screen.findByText('Tautan disalin.')).toBeVisible()
    expect(writeText).toHaveBeenCalledWith(window.location.href)
  })

  it('menampilkan error dan memuat ulang detail', async () => {
    const user = userEvent.setup()
    vi.spyOn(repositories.recipes, 'getBySlug').mockRejectedValueOnce(new Error('gagal'))

    renderDetail()

    expect(
      await screen.findByRole('heading', { name: 'Resep gagal dimuat' }, { timeout: 5000 }),
    ).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Coba lagi' }))

    expect(
      await screen.findByRole(
        'heading',
        { level: 1, name: 'Soto Ayam Kampung' },
        { timeout: 5000 },
      ),
    ).toBeVisible()
  })
})
