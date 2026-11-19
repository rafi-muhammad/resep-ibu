import type { User } from '@/lib/api/types'

/**
 * Empat akun demo: 1 admin, 1 kontributor, 2 pembaca.
 * Nama sengaja netral; tidak mewakili orang nyata.
 */
export const seedUsers: User[] = [
  {
    id: 'user-admin',
    name: 'Admin Resep Ibu',
    email: 'admin@resepibu.test',
    role: 'admin',
    bio: 'Akun demo untuk mengelola isi situs.',
    avatar: '/media/avatars/default.webp',
    status: 'active',
    joinedAt: '2025-01-05T09:00:00.000Z',
  },
  {
    id: 'user-dapur',
    name: 'Dapur Ibu',
    email: 'dapur@resepibu.test',
    role: 'user',
    bio: 'Akun demo kontributor resep.',
    avatar: '/media/avatars/default.webp',
    status: 'active',
    joinedAt: '2025-02-11T09:00:00.000Z',
  },
  {
    id: 'user-pembaca-1',
    name: 'Pembaca Satu',
    email: 'pembaca1@resepibu.test',
    role: 'user',
    bio: 'Akun demo pembaca.',
    avatar: '/media/avatars/default.webp',
    status: 'active',
    joinedAt: '2025-06-18T09:00:00.000Z',
  },
  {
    id: 'user-pembaca-2',
    name: 'Pembaca Dua',
    email: 'pembaca2@resepibu.test',
    role: 'user',
    bio: 'Akun demo pembaca.',
    avatar: '/media/avatars/default.webp',
    status: 'inactive',
    joinedAt: '2025-08-02T09:00:00.000Z',
  },
]
