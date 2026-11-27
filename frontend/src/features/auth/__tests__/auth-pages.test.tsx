import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { routes } from '@/app/router'
import { AppProviders } from '@/app/providers'
import { DEMO_PASSWORD, repositories } from '@/lib/api'
import { STORAGE_NAMESPACE } from '@/lib/api/mock/store'

function renderAt(path: string) {
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

async function loginAs(user: ReturnType<typeof userEvent.setup>, email: string) {
  await screen.findByRole('heading', { level: 1, name: 'Masuk' })
  await user.type(screen.getByLabelText(/^Email/), email)
  await user.type(screen.getByLabelText(/^Kata sandi/), DEMO_PASSWORD)
  await user.click(screen.getByRole('button', { name: 'Masuk' }))
}

async function fillRegisterForm(
  user: ReturnType<typeof userEvent.setup>,
  values: { name: string; email: string; password: string; confirmPassword: string },
) {
  await user.type(screen.getByLabelText(/^Nama/), values.name)
  await user.type(screen.getByLabelText(/^Email/), values.email)
  await user.type(screen.getByLabelText(/^Kata sandi/), values.password)
  await user.type(screen.getByLabelText(/^Konfirmasi kata sandi/), values.confirmPassword)
  await user.click(screen.getByRole('checkbox', { name: /Saya setuju/ }))
}

beforeEach(() => {
  vi.stubEnv('VITE_MOCK_LATENCY', '0')
  window.localStorage.clear()
  Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('halaman masuk', () => {
  it('menampilkan form, tautan daftar, dan akun demo tanpa fitur terlarang', async () => {
    renderAt('/masuk')

    expect(await screen.findByRole('heading', { level: 1, name: 'Masuk' })).toBeVisible()
    expect(screen.getByLabelText(/^Email/)).toBeVisible()
    expect(screen.getByLabelText(/^Kata sandi/)).toBeVisible()
    expect(screen.getByRole('link', { name: 'Daftar' })).toHaveAttribute('href', '/daftar')
    expect(screen.getByRole('region', { name: 'Akun demo' })).toBeVisible()
    expect(screen.getByText(DEMO_PASSWORD)).toBeVisible()
    expect(screen.queryByText(/lupa kata sandi|facebook|google/i)).toBeNull()
    expect(screen.queryByRole('link', { name: /lupa/i })).toBeNull()
  })

  it('menolak kredensial salah tanpa membocorkan keberadaan email', async () => {
    const user = userEvent.setup()
    const router = renderAt('/masuk')

    await loginAs(user, 'tidak-ada@resepibu.test')

    expect(await screen.findByText('Email atau kata sandi salah.')).toBeVisible()
    expect(router.state.location.pathname).toBe('/masuk')
    expect(await repositories.auth.getSession()).toBeNull()
  })

  it('mengisi form dari akun demo dan menampilkan kata sandi', async () => {
    const user = userEvent.setup()
    renderAt('/masuk')

    await screen.findByRole('heading', { level: 1, name: 'Masuk' })
    await user.click(screen.getByRole('button', { name: 'Isi otomatis akun pembaca' }))

    expect(screen.getByLabelText(/^Email/)).toHaveValue('pembaca1@resepibu.test')
    expect(screen.getByLabelText(/^Kata sandi/)).toHaveValue(DEMO_PASSWORD)

    const toggle = screen.getByRole('button', { name: 'Tampilkan kata sandi' })
    expect(screen.getByLabelText(/^Kata sandi/)).toHaveAttribute('type', 'password')
    await user.click(toggle)
    expect(screen.getByLabelText(/^Kata sandi/)).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Sembunyikan kata sandi' })).toBeVisible()
  })

  it('masuk lalu diarahkan ke profil', async () => {
    const user = userEvent.setup()
    const router = renderAt('/masuk')

    await loginAs(user, 'pembaca1@resepibu.test')

    await waitFor(() => expect(router.state.location.pathname).toBe('/profil'))
  })

  it('menghormati returnTo internal setelah masuk', async () => {
    const user = userEvent.setup()
    const router = renderAt('/masuk?returnTo=%2Fresep%2Fsoto-ayam-kampung')

    await loginAs(user, 'pembaca1@resepibu.test')

    await waitFor(() => expect(router.state.location.pathname).toBe('/resep/soto-ayam-kampung'))
    expect(
      await screen.findByRole(
        'heading',
        { level: 1, name: 'Soto Ayam Kampung' },
        { timeout: 15000 },
      ),
    ).toBeVisible()
  })

  it('menolak returnTo ke domain luar dan kembali ke profil', async () => {
    const user = userEvent.setup()
    const router = renderAt('/masuk?returnTo=https%3A%2F%2Fevil.test%2F')

    await loginAs(user, 'pembaca1@resepibu.test')

    await waitFor(() => expect(router.state.location.pathname).toBe('/profil'))
  })

  it('mengarahkan pengguna yang sudah masuk keluar dari halaman masuk', async () => {
    seedSession('user-pembaca-1')
    const router = renderAt('/masuk')

    await waitFor(() => expect(router.state.location.pathname).toBe('/profil'))
  })
})

describe('halaman daftar', () => {
  it('menolak email duplikat dan mempertahankan isian', async () => {
    const user = userEvent.setup()
    const router = renderAt('/daftar')

    await screen.findByRole('heading', { level: 1, name: 'Daftar akun' })
    await fillRegisterForm(user, {
      name: 'Pembaca Baru',
      email: 'pembaca1@resepibu.test',
      password: 'resepibu123',
      confirmPassword: 'resepibu123',
    })
    await user.click(screen.getByRole('button', { name: 'Daftar' }))

    expect(await screen.findByText('Email sudah terdaftar.')).toBeVisible()
    expect(router.state.location.pathname).toBe('/daftar')
    expect(screen.getByLabelText(/^Email/)).toHaveValue('pembaca1@resepibu.test')
    expect(screen.getByLabelText(/^Nama/)).toHaveValue('Pembaca Baru')
  })

  it('memvalidasi kata sandi, konfirmasi, dan persetujuan dengan fokus ke error pertama', async () => {
    const user = userEvent.setup()
    renderAt('/daftar')

    await screen.findByRole('heading', { level: 1, name: 'Daftar akun' })
    await user.type(screen.getByLabelText(/^Nama/), 'Pengguna Baru')
    await user.type(screen.getByLabelText(/^Email/), 'baru@contoh.com')
    await user.type(screen.getByLabelText(/^Kata sandi/), 'pendek')
    await user.type(screen.getByLabelText(/^Konfirmasi kata sandi/), 'berbeda')
    await user.click(screen.getByRole('button', { name: 'Daftar' }))

    expect(screen.getByText('Kata sandi minimal 8 karakter.')).toBeVisible()
    expect(screen.getByText('Konfirmasi kata sandi belum sama.')).toBeVisible()
    expect(screen.getByText('Centang persetujuan sebelum mendaftar.')).toBeVisible()
    expect(screen.getByLabelText(/^Kata sandi/)).toHaveFocus()
  })

  it('mendaftarkan akun baru, membuat sesi, dan menuju profil', async () => {
    const user = userEvent.setup()
    const router = renderAt('/daftar')

    await screen.findByRole('heading', { level: 1, name: 'Daftar akun' })
    await fillRegisterForm(user, {
      name: 'Pengguna Baru',
      email: 'baru@contoh.com',
      password: 'resepibu123',
      confirmPassword: 'resepibu123',
    })
    await user.click(screen.getByRole('button', { name: 'Daftar' }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/profil'))

    const session = await repositories.auth.getSession()
    expect(session?.email).toBe('baru@contoh.com')
    expect(session?.name).toBe('Pengguna Baru')
  })

  it('menyediakan tautan kembali ke halaman masuk', async () => {
    renderAt('/daftar')

    expect(await screen.findByRole('heading', { level: 1, name: 'Daftar akun' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Masuk' })).toHaveAttribute('href', '/masuk')
  })
})
