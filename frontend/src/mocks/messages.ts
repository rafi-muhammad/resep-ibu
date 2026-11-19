import type { ContactMessage } from '@/lib/api/types'

/** Enam pesan kontak demo dengan status baca bervariasi. */
export const seedMessages: ContactMessage[] = [
  {
    id: 'message-1',
    name: 'Pembaca Demo',
    email: 'pembaca@example.test',
    subject: 'Pertanyaan takaran santan',
    message: 'Apakah santan bisa diganti dengan susu cair pada resep lodeh?',
    read: false,
    createdAt: '2026-11-17T08:15:00.000Z',
  },
  {
    id: 'message-2',
    name: 'Peserta Demo',
    email: 'peserta@example.test',
    subject: 'Saran kategori',
    message: 'Mungkin bisa ditambahkan kategori masakan kukus.',
    read: false,
    createdAt: '2026-11-15T13:40:00.000Z',
  },
  {
    id: 'message-3',
    name: 'Pengunjung Demo',
    email: 'pengunjung@example.test',
    subject: 'Foto resep tidak tampil',
    message: 'Saya membuka halaman resep dan fotonya belum muncul.',
    read: true,
    createdAt: '2026-11-12T10:05:00.000Z',
  },
  {
    id: 'message-4',
    name: 'Pembaca Demo Dua',
    email: 'pembaca2@example.test',
    subject: 'Terima kasih',
    message: 'Resep sup jagungnya mudah diikuti. Terima kasih.',
    read: true,
    createdAt: '2026-11-09T16:20:00.000Z',
  },
  {
    id: 'message-5',
    name: 'Kontributor Demo',
    email: 'kontributor@example.test',
    subject: 'Cara mengirim resep',
    message: 'Apakah resep bisa dikirim tanpa foto?',
    read: false,
    createdAt: '2026-11-05T09:30:00.000Z',
  },
  {
    id: 'message-6',
    name: 'Pengunjung Demo Dua',
    email: 'pengunjung2@example.test',
    subject: 'Kesalahan ketik',
    message: 'Ada penulisan bahan yang tertukar pada salah satu resep.',
    read: true,
    createdAt: '2026-10-30T14:10:00.000Z',
  },
]
