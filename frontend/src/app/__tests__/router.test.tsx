import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RouteErrorBoundary } from '@/app/error-boundary'
import { routes } from '@/app/router'
import { STORAGE_NAMESPACE } from '@/lib/api/mock/store'

function seedSession(userId: string) {
  window.localStorage.setItem(
    `${STORAGE_NAMESPACE}session`,
    JSON.stringify({ userId, startedAt: new Date().toISOString() }),
  )
}

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

describe('Router', () => {
  beforeEach(() => {
    window.localStorage.clear()
    Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })
  })

  it('merender beranda di dalam header dan footer publik', () => {
    renderRoute('/')

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Resep rumahan, dari dapur kami ke dapur kamu',
      }),
    ).toBeVisible()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Navigasi utama' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Halaman tidak ditemukan' })).toBeNull()
  })

  it('menandai tautan aktif dengan aria-current', () => {
    renderRoute('/resep/populer')

    expect(screen.getByRole('link', { name: 'Populer' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Resep' })).not.toHaveAttribute('aria-current')
  })

  it('memindahkan fokus ke main setelah navigasi', async () => {
    const user = userEvent.setup()
    renderRoute('/')

    await user.click(screen.getByRole('link', { name: 'Tentang' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Tentang Resep Ibu' }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('main')).toHaveFocus()
    })
  })

  it('menampilkan 404 di dalam layout publik untuk route tidak dikenal', () => {
    renderRoute('/alamat-tidak-ada')

    expect(screen.getByRole('heading', { level: 1, name: 'Halaman tidak ditemukan' })).toBeVisible()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Kembali ke beranda' })).toHaveAttribute('href', '/')
  })

  it('membuka menu mobile, menahan fokus, dan menutup dengan Escape', async () => {
    const user = userEvent.setup()
    renderRoute('/')

    const opener = screen.getByRole('button', { name: 'Buka menu navigasi' })
    await user.click(opener)

    const dialog = screen.getByRole('dialog', { name: 'Menu navigasi' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveFocus()
    expect(document.body.style.overflow).toBe('hidden')

    await user.tab()
    expect(dialog.contains(document.activeElement)).toBe(true)

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(opener).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('menutup menu mobile setelah tautan dipilih', async () => {
    const user = userEvent.setup()
    renderRoute('/')

    await user.click(screen.getByRole('button', { name: 'Buka menu navigasi' }))
    const dialog = screen.getByRole('dialog', { name: 'Menu navigasi' })
    await user.click(within(dialog).getByRole('link', { name: 'Kategori' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Kategori' })).toBeVisible()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('memuat route admin secara lazy beserta sidebar', async () => {
    seedSession('user-admin')
    renderRoute('/admin')

    expect(await screen.findByRole('heading', { level: 1, name: 'Dasbor admin' })).toBeVisible()
    expect(screen.getByRole('navigation', { name: 'Navigasi admin' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Lihat situs' })).toHaveAttribute('href', '/')
  })

  it('merender halaman akun dengan navigasi akun', async () => {
    seedSession('user-pembaca-1')
    renderRoute('/profil/disimpan')

    expect(await screen.findByRole('heading', { level: 1, name: 'Resep disimpan' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Resep disimpan' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('mengarahkan tamu dari profil ke halaman masuk dengan returnTo', async () => {
    renderRoute('/profil')

    expect(await screen.findByRole('heading', { level: 1, name: 'Masuk' })).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Profil saya' })).toBeNull()
  })

  it('menolak pengguna biasa membuka admin', async () => {
    seedSession('user-dapur')
    renderRoute('/admin')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Resep rumahan, dari dapur kami ke dapur kamu',
      }),
    ).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Dasbor admin' })).toBeNull()
  })

  it('menampilkan sesi aktif di header dan logout kembali ke halaman masuk', async () => {
    seedSession('user-admin')
    renderRoute('/')

    expect(await screen.findByText('Admin Resep Ibu', {}, { timeout: 5000 })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin')

    await userEvent.setup().click(screen.getByRole('button', { name: 'Keluar' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Masuk' }, { timeout: 5000 }),
    ).toBeVisible()
    expect(window.localStorage.getItem(`${STORAGE_NAMESPACE}session`)).toBeNull()
  })

  it('merender formulir masuk di dalam layout auth', () => {
    renderRoute('/masuk')

    expect(screen.getByRole('heading', { level: 1, name: 'Masuk' })).toBeVisible()
    expect(screen.queryByRole('banner')).toBeNull()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})

describe('RouteErrorBoundary', () => {
  it('menangkap error render dan menyediakan jalan kembali', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    function Boom(): never {
      throw new Error('gagal render')
    }

    const router = createMemoryRouter([
      { path: '/', element: <Boom />, errorElement: <RouteErrorBoundary /> },
    ])

    render(<RouterProvider router={router} />)

    expect(screen.getByRole('heading', { level: 1, name: 'Halaman gagal dimuat' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Kembali ke beranda' })).toHaveAttribute('href', '/')

    consoleError.mockRestore()
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})
