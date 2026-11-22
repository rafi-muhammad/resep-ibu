import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { routes } from '@/app/router'
import { repositories } from '@/lib/api'
import type { ContactMessage } from '@/lib/api/types'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

async function fillContactForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Nama/), 'Sari Penguji')
  await user.type(screen.getByLabelText(/^Email/), 'sari@contoh.com')
  await user.type(screen.getByLabelText(/^Subjek/), 'Pertanyaan resep')
  await user.type(screen.getByLabelText(/^Pesan/), 'Apakah soto bisa disimpan semalaman?')
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

describe('halaman tentang', () => {
  it('menampilkan cerita, nilai, tim placeholder, dan CTA kontak', async () => {
    renderAt('/tentang')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Tentang Resep Ibu' }),
    ).toBeVisible()
    expect(
      screen.getByText(
        'Resep Ibu adalah kumpulan resep masakan rumahan yang disusun agar mudah diikuti siapa saja.',
      ),
    ).toBeVisible()

    expect(screen.getByRole('heading', { name: 'Cerita kami' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Nilai yang kami pegang' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Tim di balik layar' })).toBeVisible()

    for (const value of ['Jelas', 'Ramah keluarga', 'Terbuka']) {
      expect(screen.getByRole('heading', { level: 3, name: value })).toBeVisible()
    }

    for (const member of ['Redaksi Resep Ibu', 'Dapur Uji Resep', 'Komunitas Resep Ibu']) {
      expect(screen.getByRole('heading', { level: 3, name: member })).toBeVisible()
    }
    expect(screen.getByText(/placeholder demo, bukan orang nyata/)).toBeVisible()

    expect(screen.getByRole('link', { name: 'Hubungi kami' })).toHaveAttribute('href', '/kontak')
    expect(screen.queryByRole('link', { name: /mailto:|tel:/ })).toBeNull()
  })

  it('menampilkan error dan memuat ulang konten tentang', async () => {
    const user = userEvent.setup()
    vi.spyOn(repositories.content, 'getAbout').mockRejectedValueOnce(new Error('gagal'))

    renderAt('/tentang')

    expect(
      await screen.findByRole('heading', { name: 'Halaman tentang gagal dimuat' }),
    ).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Coba lagi' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Tentang Resep Ibu' }),
    ).toBeVisible()
  })
})

describe('halaman kontak', () => {
  it('menampilkan form dan catatan demo tanpa PII resmi', async () => {
    renderAt('/kontak')

    expect(await screen.findByRole('heading', { level: 1, name: 'Hubungi kami' })).toBeVisible()
    expect(screen.getByLabelText(/^Nama/)).toBeVisible()
    expect(screen.getByLabelText(/^Email/)).toBeVisible()
    expect(screen.getByLabelText(/^Subjek/)).toBeVisible()
    expect(screen.getByLabelText(/^Pesan/)).toBeVisible()
    expect(screen.getByRole('checkbox', { name: /Saya setuju/ })).toBeVisible()
    expect(screen.getByText('Mode demo')).toBeVisible()
    expect(screen.getByRole('complementary', { name: 'Informasi kontak' })).toBeVisible()
    expect(screen.queryByText(/\+62|Jl\.|@resepibu\.com/)).toBeNull()
  })

  it('memvalidasi isian kosong, menampilkan ringkasan, dan fokus ke field pertama', async () => {
    const user = userEvent.setup()
    const create = vi.spyOn(repositories.contact, 'create')
    renderAt('/kontak')

    await screen.findByRole('heading', { level: 1, name: 'Hubungi kami' })
    await user.click(screen.getByRole('button', { name: 'Kirim pesan' }))

    expect(screen.getByText('5 kolom perlu diperbaiki sebelum pesan bisa dikirim.')).toBeVisible()
    expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(5)
    expect(screen.getByLabelText(/^Nama/)).toHaveFocus()
    expect(create).not.toHaveBeenCalled()
  })

  it('memvalidasi email saat blur', async () => {
    const user = userEvent.setup()
    renderAt('/kontak')

    await screen.findByRole('heading', { level: 1, name: 'Hubungi kami' })
    const email = screen.getByLabelText(/^Email/)
    await user.type(email, 'sari@')
    await user.tab()

    expect(screen.getByText(/Format email belum benar/)).toBeVisible()
  })

  it('mengirim pesan valid ke repository dan menampilkan sukses demo', async () => {
    const user = userEvent.setup()
    renderAt('/kontak')

    await screen.findByRole('heading', { level: 1, name: 'Hubungi kami' })
    await fillContactForm(user)
    await user.click(screen.getByRole('button', { name: 'Kirim pesan' }))

    expect(await screen.findByText('Pesan terkirim (demo)')).toBeVisible()
    expect(screen.getByText(/tersimpan di kotak masuk demo/)).toBeVisible()
    expect(screen.getByRole('button', { name: 'Kirim pesan lain' })).toBeVisible()

    const messages = await repositories.contact.list()
    expect(messages[0]?.subject).toBe('Pertanyaan resep')
    expect(messages[0]?.email).toBe('sari@contoh.com')
    expect(messages[0]?.read).toBe(false)
  })

  it('mempertahankan isian saat pengiriman gagal', async () => {
    const user = userEvent.setup()
    vi.spyOn(repositories.contact, 'create').mockRejectedValueOnce(new Error('gagal'))

    renderAt('/kontak')

    await screen.findByRole('heading', { level: 1, name: 'Hubungi kami' })
    await fillContactForm(user)
    await user.click(screen.getByRole('button', { name: 'Kirim pesan' }))

    expect(await screen.findByText('Pesan belum terkirim')).toBeVisible()
    expect(screen.getByLabelText(/^Nama/)).toHaveValue('Sari Penguji')
    expect(screen.getByLabelText(/^Email/)).toHaveValue('sari@contoh.com')
    expect(screen.getByLabelText(/^Pesan/)).toHaveValue('Apakah soto bisa disimpan semalaman?')
    expect(screen.getByRole('checkbox', { name: /Saya setuju/ })).toBeChecked()
  })

  it('mencegah submit ganda selama pengiriman', async () => {
    const user = userEvent.setup()
    let resolveCreate!: (message: ContactMessage) => void
    const pending = new Promise<ContactMessage>((resolve) => {
      resolveCreate = resolve
    })
    const create = vi.spyOn(repositories.contact, 'create').mockReturnValue(pending)

    renderAt('/kontak')

    await screen.findByRole('heading', { level: 1, name: 'Hubungi kami' })
    await fillContactForm(user)
    await user.click(screen.getByRole('button', { name: 'Kirim pesan' }))

    expect(create).toHaveBeenCalledTimes(1)
    const busy = screen.getByRole('button', { name: /Kirim pesan/ })
    expect(busy).toBeDisabled()

    resolveCreate({
      id: 'message-uji',
      name: 'Sari Penguji',
      email: 'sari@contoh.com',
      subject: 'Pertanyaan resep',
      message: 'Apakah soto bisa disimpan semalaman?',
      read: false,
      createdAt: new Date().toISOString(),
    })

    expect(await screen.findByText('Pesan terkirim (demo)')).toBeVisible()
    await waitFor(() => expect(create).toHaveBeenCalledTimes(1))
  })
})
