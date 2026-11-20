import { act, render, screen, waitFor, within } from '@testing-library/react'
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

/** Toolbar halaman, bukan searchbox global di header. */
function filterToolbar() {
  return within(screen.getByRole('region', { name: 'Filter resep' }))
}

beforeEach(() => {
  vi.stubEnv('VITE_MOCK_LATENCY', '0')
  window.localStorage.clear()
  Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('halaman semua resep', () => {
  it('menampilkan 12 resep dan jumlah total dari data', async () => {
    renderAt('/resep')

    expect(await screen.findByText('24 resep ditemukan')).toBeVisible()
    expect(await screen.findAllByRole('article')).toHaveLength(12)
    expect(screen.getByRole('button', { name: 'Halaman 2' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Atur ulang' })).toBeDisabled()
  })

  it('memfilter kategori dan mengembalikan halaman ke 1', async () => {
    const user = userEvent.setup()
    const router = renderAt('/resep?halaman=2')

    await screen.findAllByRole('article')
    await user.selectOptions(screen.getByLabelText('Kategori'), 'makanan-berkuah')

    await waitFor(() => {
      expect(router.state.location.search).toContain('kategori=makanan-berkuah')
      expect(router.state.location.search).not.toContain('halaman=2')
    })
    expect(await screen.findByText('4 resep ditemukan')).toBeVisible()
  })

  it('mengurutkan A-Z dan populer', async () => {
    const user = userEvent.setup()
    const router = renderAt('/resep')

    await screen.findAllByRole('article')
    await user.selectOptions(screen.getByLabelText('Urutan'), 'az')

    await waitFor(() => {
      expect(router.state.location.search).toContain('urutan=az')
    })
    expect(
      await screen.findByRole('heading', { level: 3, name: 'Ayam Geprek Sambal Bawang' }),
    ).toBeVisible()

    await user.selectOptions(screen.getByLabelText('Urutan'), 'populer')

    expect(
      await screen.findByRole('heading', { level: 3, name: 'Soto Ayam Kampung' }),
    ).toBeVisible()
  })

  it('mencari tanpa membedakan huruf besar-kecil setelah debounce', async () => {
    const user = userEvent.setup()
    const router = renderAt('/resep')

    await screen.findAllByRole('article')
    await user.type(filterToolbar().getByRole('searchbox'), 'SOTO')

    // Jalankan timer debounce di dalam act agar transisi URL ikut ter-flush.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350))
    })

    await waitFor(() => {
      expect(router.state.location.search).toContain('q=SOTO')
    })

    expect(await screen.findByText('1 resep ditemukan')).toBeVisible()
    expect(screen.getByRole('heading', { level: 3, name: 'Soto Ayam Kampung' })).toBeVisible()
  })

  it('mempertahankan filter dari URL saat reload dan navigasi kembali', async () => {
    const user = userEvent.setup()
    const router = renderAt('/resep?q=rawon&urutan=az')

    expect(await screen.findByText('1 resep ditemukan')).toBeVisible()
    expect(filterToolbar().getByRole('searchbox')).toHaveValue('rawon')

    await user.selectOptions(screen.getByLabelText('Kategori'), 'makanan-berkuah')
    await screen.findByText('1 resep ditemukan')

    await act(async () => {
      await router.navigate(-1)
    })

    await waitFor(() => {
      expect(router.state.location.search).not.toContain('kategori=')
    })
    expect(await screen.findByText('1 resep ditemukan')).toBeVisible()
  })

  it('mengarahkan halaman di luar rentang ke halaman terakhir', async () => {
    const router = renderAt('/resep?halaman=99')

    await waitFor(() => {
      expect(router.state.location.search).toContain('halaman=2')
    })
    expect(await screen.findAllByRole('article')).toHaveLength(12)
  })

  it('menganggap kategori tidak dikenal sebagai semua kategori', async () => {
    const router = renderAt('/resep?kategori=tidak-ada')

    await waitFor(() => {
      expect(router.state.location.search).not.toContain('kategori=')
    })
    expect(await screen.findByText('24 resep ditemukan')).toBeVisible()
  })

  it('menampilkan empty state dan tombol atur ulang', async () => {
    const user = userEvent.setup()
    const router = renderAt('/resep?q=tidakmungkinada')

    expect(await screen.findByRole('heading', { name: 'Belum ada resep yang cocok' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Atur ulang filter' }))

    await waitFor(() => {
      expect(router.state.location.search).toBe('')
    })
    expect(await screen.findByText('24 resep ditemukan')).toBeVisible()
  })

  it('menampilkan error lokal dan memuat ulang lewat tombol coba lagi', async () => {
    const user = userEvent.setup()
    vi.spyOn(repositories.recipes, 'list').mockRejectedValueOnce(new Error('gagal'))

    renderAt('/resep')

    expect(await screen.findByRole('heading', { name: 'Resep gagal dimuat' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Coba lagi' }))

    expect(await screen.findByText('24 resep ditemukan')).toBeVisible()
  })
})

describe('halaman resep populer', () => {
  it('menampilkan 10 resep berurutan dan tanpa klaim kunjungan', async () => {
    renderAt('/resep/populer')

    const cards = await screen.findAllByRole('article')

    expect(cards).toHaveLength(10)
    expect(within(cards[0] as HTMLElement).getByRole('heading', { level: 3 })).toHaveTextContent(
      'Soto Ayam Kampung',
    )
    expect(screen.getByText(/Bukan jumlah kunjungan/)).toBeVisible()
    expect(screen.getByRole('link', { name: 'Lihat semua resep' })).toHaveAttribute(
      'href',
      '/resep',
    )
  })
})
