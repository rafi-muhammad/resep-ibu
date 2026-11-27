import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DEMO_PASSWORD } from '@/lib/api'
import { createAuthRepository } from '@/lib/api/mock/auth-repository'
import { createDemoStore, STORAGE_NAMESPACE, type StorageLike } from '@/lib/api/mock/store'
import { createUserRepository } from '@/lib/api/mock/user-repository'
import { AuthProvider } from '@/features/auth/auth-provider'
import { useAuth } from '@/features/auth/use-auth'

class FakeStorage implements StorageLike {
  readonly data = new Map<string, string>()

  getItem(key: string) {
    return this.data.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.data.set(key, value)
  }

  removeItem(key: string) {
    this.data.delete(key)
  }
}

function setup() {
  const storage = new FakeStorage()
  const store = createDemoStore(storage)
  return {
    storage,
    store,
    auth: createAuthRepository(store),
    users: createUserRepository(store),
  }
}

function Harness() {
  const { user, status, login, logout } = useAuth()

  return (
    <div>
      <p>status: {status}</p>
      <p>pengguna: {user?.name ?? 'tamu'}</p>
      <button type="button" onClick={() => void login('admin@resepibu.test', DEMO_PASSWORD)}>
        Masuk admin
      </button>
      <button type="button" onClick={() => void login('dapur@resepibu.test', 'salah-sekali')}>
        Masuk salah
      </button>
      <button type="button" onClick={() => void logout()}>
        Keluar
      </button>
    </div>
  )
}

beforeEach(() => {
  vi.stubEnv('VITE_MOCK_LATENCY', '0')
})

describe('AuthProvider', () => {
  it('memulihkan sesi dari store setelah provider dipasang ulang', async () => {
    const { auth, storage } = setup()
    const user = userEvent.setup()

    const first = render(
      <AuthProvider auth={auth}>
        <Harness />
      </AuthProvider>,
    )

    await screen.findByText('status: anonymous')
    await user.click(screen.getByRole('button', { name: 'Masuk admin' }))

    expect(await screen.findByText('pengguna: Admin Resep Ibu')).toBeVisible()
    expect(screen.getByText('status: authenticated')).toBeVisible()
    expect(storage.getItem(`${STORAGE_NAMESPACE}session`)).toContain('user-admin')

    first.unmount()

    render(
      <AuthProvider auth={auth}>
        <Harness />
      </AuthProvider>,
    )

    expect(await screen.findByText('pengguna: Admin Resep Ibu')).toBeVisible()
    expect(screen.getByText('status: authenticated')).toBeVisible()
  })

  it('membersihkan sesi saat logout', async () => {
    const { auth, storage } = setup()
    const user = userEvent.setup()

    render(
      <AuthProvider auth={auth}>
        <Harness />
      </AuthProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Masuk admin' }))
    await screen.findByText('pengguna: Admin Resep Ibu')

    await user.click(screen.getByRole('button', { name: 'Keluar' }))

    expect(await screen.findByText('pengguna: tamu')).toBeVisible()
    expect(storage.getItem(`${STORAGE_NAMESPACE}session`)).toBeNull()
  })

  it('menolak akun non-aktif dan menghapus sesi lama', async () => {
    const { auth, store, storage } = setup()

    store.write('session', { userId: 'user-pembaca-2', startedAt: new Date().toISOString() })

    expect(await auth.getSession()).toBeNull()
    expect(storage.getItem(`${STORAGE_NAMESPACE}session`)).toBeNull()

    await expect(auth.login('pembaca2@resepibu.test', DEMO_PASSWORD)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    })
  })

  it('tidak menampilkan kata sandi atau hash pada objek pengguna', async () => {
    const { auth } = setup()
    const user = await auth.login('admin@resepibu.test', DEMO_PASSWORD)

    expect(JSON.stringify(user)).not.toContain(DEMO_PASSWORD)
    expect(Object.keys(user)).not.toContain('password')
  })
})

describe('repository autentikasi demo', () => {
  it('memberi pesan yang sama untuk email tidak dikenal dan kata sandi salah', async () => {
    const { auth } = setup()

    await expect(auth.login('tidak-ada@resepibu.test', DEMO_PASSWORD)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Email atau kata sandi salah.',
    })
    await expect(auth.login('admin@resepibu.test', 'salah')).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Email atau kata sandi salah.',
    })
  })

  it('mendaftarkan pengguna baru dan langsung membuat sesi', async () => {
    const { auth } = setup()

    const user = await auth.register({
      name: 'Pengguna Baru',
      email: '  Baru@Example.Test ',
      password: 'rahasia123',
    })

    expect(user).toMatchObject({
      name: 'Pengguna Baru',
      email: 'baru@example.test',
      role: 'user',
      status: 'active',
    })
    expect((await auth.getSession())?.id).toBe(user.id)
  })

  it('menolak email duplikat dan input tidak valid', async () => {
    const { auth } = setup()

    await expect(
      auth.register({
        name: 'Duplikat',
        email: 'admin@resepibu.test',
        password: 'rahasia123',
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT', fields: { email: 'Email sudah terdaftar.' } })

    await expect(
      auth.register({ name: 'A', email: 'bukan-email', password: 'pendek' }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('menolak pendaftaran dengan kata sandi kurang dari 8 karakter', async () => {
    const { auth } = setup()

    await expect(
      auth.register({ name: 'Nama Valid', email: 'valid@example.test', password: '1234567' }),
    ).rejects.toMatchObject({ fields: { password: 'Kata sandi minimal 8 karakter.' } })
  })

  it('menolak login setelah akun dinonaktifkan', async () => {
    const { auth, users } = setup()

    await auth.login('pembaca1@resepibu.test', DEMO_PASSWORD)
    await users.updateStatus('user-pembaca-1', 'inactive')

    expect(await auth.getSession()).toBeNull()
    await expect(auth.login('pembaca1@resepibu.test', DEMO_PASSWORD)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    })
  })

  it('menyimpan hash demo, bukan kata sandi teks biasa', async () => {
    const { auth, storage } = setup()

    await auth.login('admin@resepibu.test', DEMO_PASSWORD)

    const credentials = storage.getItem(`${STORAGE_NAMESPACE}credentials`)

    expect(credentials).not.toBeNull()
    expect(credentials).not.toContain(DEMO_PASSWORD)
  })
})

describe('AuthProvider tanpa sesi', () => {
  it('berakhir di status anonymous bila getSession gagal', async () => {
    const failing = {
      login: async () => {
        throw new Error('tidak dipakai')
      },
      register: async () => {
        throw new Error('tidak dipakai')
      },
      logout: async () => {},
      getSession: async () => {
        throw new Error('rusak')
      },
      updateProfile: async () => {
        throw new Error('tidak dipakai')
      },
      changePassword: async () => {
        throw new Error('tidak dipakai')
      },
    }

    render(
      <AuthProvider auth={failing}>
        <Harness />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('status: anonymous')).toBeVisible()
    })
  })
})
