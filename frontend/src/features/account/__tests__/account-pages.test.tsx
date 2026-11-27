import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AppProviders } from '@/app/providers'
import { routes } from '@/app/router'
import { DEMO_PASSWORD, repositories } from '@/lib/api'
import { STORAGE_NAMESPACE } from '@/lib/api/mock/store'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const result = render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return { router, ...result }
}

function seedSession(userId: string) {
  window.localStorage.setItem(
    `${STORAGE_NAMESPACE}session`,
    JSON.stringify({ userId, startedAt: new Date().toISOString() }),
  )
}

beforeEach(() => {
  vi.stubEnv('VITE_MOCK_LATENCY', '0')
  window.localStorage.clear()
  Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('halaman profil', () => {
  it('menyimpan perubahan dan mempertahankannya setelah render ulang', async () => {
    seedSession('user-pembaca-1')
    const user = userEvent.setup()
    const first = renderAt('/profil')

    expect(await screen.findByRole('heading', { level: 1, name: 'Profil saya' })).toBeVisible()

    const name = screen.getByLabelText(/^Nama/)
    await user.clear(name)
    await user.type(name, 'Pembaca Diperbarui')

    const bio = screen.getByLabelText(/^Bio/)
    await user.clear(bio)
    await user.type(bio, 'Bio baru untuk akun demo.')

    await user.click(screen.getByRole('radio', { name: /Preset dua/ }))
    await user.click(screen.getByRole('button', { name: 'Simpan perubahan' }))

    expect(await screen.findByText('Profil diperbarui')).toBeVisible()

    const session = await repositories.auth.getSession()
    expect(session?.name).toBe('Pembaca Diperbarui')
    expect(session?.bio).toBe('Bio baru untuk akun demo.')
    expect(session?.avatar).toBe('/media/avatars/preset-2.webp')

    first.unmount()

    renderAt('/profil')
    expect(await screen.findByRole('heading', { level: 1, name: 'Profil saya' })).toBeVisible()
    expect(await screen.findByLabelText(/^Nama/)).toHaveValue('Pembaca Diperbarui')
    expect(screen.getByLabelText(/^Bio/)).toHaveValue('Bio baru untuk akun demo.')
    expect(screen.getByRole('radio', { name: /Preset dua/ })).toBeChecked()
  })

  it('menolak email yang sudah dipakai akun lain dan fokus ke kolom email', async () => {
    seedSession('user-pembaca-1')
    const user = userEvent.setup()
    renderAt('/profil')

    await screen.findByRole('heading', { level: 1, name: 'Profil saya' })

    const email = screen.getByLabelText(/^Email/)
    await user.clear(email)
    await user.type(email, 'admin@resepibu.test')
    await user.click(screen.getByRole('button', { name: 'Simpan perubahan' }))

    expect(await screen.findByText('Email sudah dipakai akun lain.')).toBeVisible()
    await waitFor(() => expect(email).toHaveFocus())

    const session = await repositories.auth.getSession()
    expect(session?.email).toBe('pembaca1@resepibu.test')
  })

  it('memvalidasi nama dan email dengan fokus ke error pertama', async () => {
    seedSession('user-pembaca-1')
    const user = userEvent.setup()
    renderAt('/profil')

    await screen.findByRole('heading', { level: 1, name: 'Profil saya' })

    const name = screen.getByLabelText(/^Nama/)
    await user.clear(name)
    const email = screen.getByLabelText(/^Email/)
    await user.clear(email)
    await user.type(email, 'bukan-email')
    await user.click(screen.getByRole('button', { name: 'Simpan perubahan' }))

    expect(screen.getByText('Nama harus 2–80 karakter.')).toBeVisible()
    expect(screen.getByText(/Format email belum benar/)).toBeVisible()
    expect(name).toHaveFocus()
  })

  it('mengembalikan isian ke data tersimpan saat dibatalkan', async () => {
    seedSession('user-pembaca-1')
    const user = userEvent.setup()
    renderAt('/profil')

    await screen.findByRole('heading', { level: 1, name: 'Profil saya' })

    const name = screen.getByLabelText(/^Nama/)
    await user.clear(name)
    await user.type(name, 'Nama Sementara')
    await user.click(screen.getByRole('button', { name: 'Batalkan' }))

    expect(name).toHaveValue('Pembaca Satu')
  })

  it('dapat diselesaikan lewat keyboard dari kolom nama sampai tombol simpan', async () => {
    seedSession('user-pembaca-1')
    const user = userEvent.setup()
    renderAt('/profil')

    await screen.findByRole('heading', { level: 1, name: 'Profil saya' })

    const name = screen.getByLabelText(/^Nama/)
    await user.click(name)
    await user.clear(name)
    await user.type(name, 'Pembaca Keyboard')

    name.focus()
    await user.tab()
    expect(screen.getByLabelText(/^Email/)).toHaveFocus()
    await user.tab()
    expect(screen.getByLabelText(/^Bio/)).toHaveFocus()
    await user.tab()
    expect(screen.getAllByRole('radio')[0]).toHaveFocus()

    const submit = screen.getByRole('button', { name: 'Simpan perubahan' })
    submit.focus()
    await user.keyboard('{Enter}')

    expect(await screen.findByText('Profil diperbarui')).toBeVisible()
    expect((await repositories.auth.getSession())?.name).toBe('Pembaca Keyboard')
  })

  it('tidak menampilkan kata sandi atau hash di halaman profil', async () => {
    seedSession('user-pembaca-1')
    renderAt('/profil')

    await screen.findByRole('heading', { level: 1, name: 'Profil saya' })

    expect(document.body.textContent).not.toMatch(/[a-f0-9]{32,}/i)
    expect(document.querySelector('input[type="password"]')).toBeNull()
  })
})

describe('halaman keamanan', () => {
  it('menolak kata sandi saat ini yang salah tanpa mengubah kredensial', async () => {
    seedSession('user-pembaca-1')
    const user = userEvent.setup()
    renderAt('/profil/keamanan')

    expect(await screen.findByRole('heading', { level: 1, name: 'Keamanan akun' })).toBeVisible()

    await user.type(screen.getByLabelText(/^Kata sandi saat ini/), 'salah-sekali')
    await user.type(screen.getByLabelText(/^Kata sandi baru/), 'resepbaru123')
    await user.type(screen.getByLabelText(/^Konfirmasi kata sandi baru/), 'resepbaru123')
    await user.click(screen.getByRole('button', { name: 'Perbarui kata sandi' }))

    expect(await screen.findByText('Kata sandi saat ini salah.')).toBeVisible()
    await waitFor(() => expect(screen.getByLabelText(/^Kata sandi saat ini/)).toHaveFocus())
    expect((await repositories.auth.getSession())?.email).toBe('pembaca1@resepibu.test')
    await expect(
      repositories.auth.login('pembaca1@resepibu.test', DEMO_PASSWORD),
    ).resolves.toMatchObject({ id: 'user-pembaca-1' })
  })

  it('memvalidasi kata sandi baru dan konfirmasi dengan fokus ke error pertama', async () => {
    seedSession('user-pembaca-1')
    const user = userEvent.setup()
    renderAt('/profil/keamanan')

    await screen.findByRole('heading', { level: 1, name: 'Keamanan akun' })

    await user.type(screen.getByLabelText(/^Kata sandi saat ini/), DEMO_PASSWORD)
    await user.type(screen.getByLabelText(/^Kata sandi baru/), 'pendek')
    await user.type(screen.getByLabelText(/^Konfirmasi kata sandi baru/), 'beda')
    await user.click(screen.getByRole('button', { name: 'Perbarui kata sandi' }))

    expect(screen.getByText('Kata sandi baru minimal 8 karakter.')).toBeVisible()
    expect(screen.getByText('Konfirmasi kata sandi belum sama.')).toBeVisible()
    expect(screen.getByLabelText(/^Kata sandi baru/)).toHaveFocus()
  })

  it('mengubah kata sandi, kosongkan form, lalu dapat masuk dengan kata sandi baru', async () => {
    seedSession('user-pembaca-1')
    const user = userEvent.setup()
    renderAt('/profil/keamanan')

    await screen.findByRole('heading', { level: 1, name: 'Keamanan akun' })

    await user.type(screen.getByLabelText(/^Kata sandi saat ini/), DEMO_PASSWORD)
    await user.type(screen.getByLabelText(/^Kata sandi baru/), 'resepbaru123')
    await user.type(screen.getByLabelText(/^Konfirmasi kata sandi baru/), 'resepbaru123')
    await user.click(screen.getByRole('button', { name: 'Perbarui kata sandi' }))

    expect(await screen.findByText('Kata sandi diperbarui')).toBeVisible()
    expect(screen.getByLabelText(/^Kata sandi saat ini/)).toHaveValue('')
    expect(screen.getByLabelText(/^Kata sandi baru/)).toHaveValue('')

    await repositories.auth.logout()

    await expect(
      repositories.auth.login('pembaca1@resepibu.test', DEMO_PASSWORD),
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
    await expect(
      repositories.auth.login('pembaca1@resepibu.test', 'resepbaru123'),
    ).resolves.toMatchObject({ id: 'user-pembaca-1' })
  })

  it('selalu menyembunyikan nilai kata sandi dan tidak merender hash', async () => {
    seedSession('user-pembaca-1')
    renderAt('/profil/keamanan')

    await screen.findByRole('heading', { level: 1, name: 'Keamanan akun' })

    const passwordInputs = document.querySelectorAll('input[type="password"]')
    expect(passwordInputs).toHaveLength(3)
    expect(document.body.textContent).not.toMatch(/[a-f0-9]{32,}/i)

    await waitFor(() => expect(screen.getByText('Mode demo')).toBeVisible())
  })
})
