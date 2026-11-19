import type { AboutContent, TeamMember } from '@/lib/api/types'

export const seedAbout: AboutContent = {
  title: 'Tentang Resep Ibu',
  intro:
    'Resep Ibu adalah kumpulan resep masakan rumahan yang disusun agar mudah diikuti siapa saja.',
  story: [
    'Situs ini dibangun kembali dari arsip lama menjadi antarmuka yang lebih rapi dan mudah diakses.',
    'Setiap resep menampilkan bahan dan langkah dalam bentuk terstruktur, sehingga bisa dibaca dengan nyaman di ponsel maupun desktop.',
    'Seluruh data pada Phase 1 adalah data demo. Tidak ada klaim, angka, atau nama orang nyata di dalamnya.',
  ],
  values: [
    {
      title: 'Jelas',
      description: 'Bahan dan langkah ditulis ringkas agar mudah diikuti.',
    },
    {
      title: 'Ramah keluarga',
      description: 'Porsi dan waktu memasak disesuaikan untuk masakan sehari-hari.',
    },
    {
      title: 'Terbuka',
      description: 'Konten demo dapat diubah dan diuji tanpa backend.',
    },
  ],
}

/** Tiga anggota tim placeholder netral, tanpa nama orang nyata. */
export const seedTeam: TeamMember[] = [
  {
    id: 'team-redaksi',
    name: 'Redaksi Resep Ibu',
    role: 'Penyunting resep',
    bio: 'Menyusun dan merapikan naskah resep.',
    avatar: '/media/avatars/default.webp',
    status: 'active',
    order: 1,
  },
  {
    id: 'team-dapur',
    name: 'Dapur Uji Resep',
    role: 'Penguji resep',
    bio: 'Menguji takaran dan langkah memasak.',
    avatar: '/media/avatars/default.webp',
    status: 'active',
    order: 2,
  },
  {
    id: 'team-komunitas',
    name: 'Komunitas Resep Ibu',
    role: 'Komunitas',
    bio: 'Mengumpulkan masukan dari pembaca.',
    avatar: '/media/avatars/default.webp',
    status: 'active',
    order: 3,
  },
]
