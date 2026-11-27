import { render, screen } from '@testing-library/react'
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthProvider } from '@/features/auth/auth-provider'
import { ProtectedRoute } from '@/features/auth/protected-route'
import { DEMO_PASSWORD } from '@/lib/api'
import { createAuthRepository } from '@/lib/api/mock/auth-repository'
import { createDemoStore } from '@/lib/api/mock/store'

function setup() {
  const store = createDemoStore(null)
  return createAuthRepository(store)
}

function renderGuarded(path: string, auth: ReturnType<typeof setup>) {
  const router = createMemoryRouter(
    [
      { path: '/masuk', element: <h1>Masuk</h1> },
      { path: '/', element: <h1>Beranda</h1> },
      {
        element: (
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [{ path: '/profil', element: <h1>Profil</h1> }],
      },
      {
        element: (
          <ProtectedRoute requireRole="admin">
            <Outlet />
          </ProtectedRoute>
        ),
        children: [{ path: '/admin', element: <h1>Admin</h1> }],
      },
    ],
    { initialEntries: [path] },
  )

  render(
    <AuthProvider auth={auth}>
      <RouterProvider router={router} />
    </AuthProvider>,
  )

  return router
}

beforeEach(() => {
  vi.stubEnv('VITE_MOCK_LATENCY', '0')
})

describe('ProtectedRoute', () => {
  it('mengarahkan tamu ke halaman masuk dengan returnTo', async () => {
    const auth = setup()
    const router = renderGuarded('/profil', auth)

    expect(await screen.findByRole('heading', { name: 'Masuk' })).toBeVisible()
    expect(router.state.location.pathname).toBe('/masuk')
    expect(new URLSearchParams(router.state.location.search).get('returnTo')).toBe('/profil')
  })

  it('mempertahankan path admin sebagai returnTo', async () => {
    const auth = setup()
    const router = renderGuarded('/admin', auth)

    await screen.findByRole('heading', { name: 'Masuk' })
    expect(new URLSearchParams(router.state.location.search).get('returnTo')).toBe('/admin')
  })

  it('mengizinkan pengguna yang sudah login membuka profil', async () => {
    const auth = setup()
    await auth.login('dapur@resepibu.test', DEMO_PASSWORD)

    renderGuarded('/profil', auth)

    expect(await screen.findByRole('heading', { name: 'Profil' })).toBeVisible()
  })

  it('menolak pengguna biasa membuka admin dan mengembalikannya ke beranda', async () => {
    const auth = setup()
    await auth.login('dapur@resepibu.test', DEMO_PASSWORD)

    const router = renderGuarded('/admin', auth)

    expect(await screen.findByRole('heading', { name: 'Beranda' })).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Admin' })).toBeNull()
    expect(router.state.location.pathname).toBe('/')
  })

  it('mengizinkan admin membuka area admin', async () => {
    const auth = setup()
    await auth.login('admin@resepibu.test', DEMO_PASSWORD)

    renderGuarded('/admin', auth)

    expect(await screen.findByRole('heading', { name: 'Admin' })).toBeVisible()
  })

  it('menampilkan status memeriksa sesi selama sesi dimuat', () => {
    const auth = {
      login: async () => {
        throw new Error('tidak dipakai')
      },
      register: async () => {
        throw new Error('tidak dipakai')
      },
      logout: async () => {},
      getSession: () => new Promise<never>(() => {}),
      updateProfile: async () => {
        throw new Error('tidak dipakai')
      },
      changePassword: async () => {
        throw new Error('tidak dipakai')
      },
    }

    renderGuarded('/profil', auth)

    expect(screen.getByText('Memeriksa sesi')).toBeInTheDocument()
  })
})
