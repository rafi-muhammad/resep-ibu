import type { Category } from '@/lib/api/types'

/**
 * Tujuh kategori dari struktur legacy.
 * `recipeCount` dihitung ulang oleh repository dari daftar resep.
 */
export const seedCategories: Category[] = [
  {
    id: 'category-minuman',
    name: 'Minuman',
    slug: 'minuman',
    description: 'Minuman hangat dan dingin untuk melengkapi hidangan.',
    image: '/media/categories/minuman.webp',
    status: 'active',
    recipeCount: 0,
  },
  {
    id: 'category-makanan-penutup',
    name: 'Makanan Penutup',
    slug: 'makanan-penutup',
    description: 'Kudapan manis dan pencuci mulut untuk keluarga.',
    image: '/media/categories/makanan-penutup.webp',
    status: 'active',
    recipeCount: 0,
  },
  {
    id: 'category-makanan-berkuah',
    name: 'Makanan Berkuah',
    slug: 'makanan-berkuah',
    description: 'Soto, sup, dan sayur berkuah yang menghangatkan.',
    image: '/media/categories/makanan-berkuah.webp',
    status: 'active',
    recipeCount: 0,
  },
  {
    id: 'category-makanan-pedas',
    name: 'Makanan Pedas',
    slug: 'makanan-pedas',
    description: 'Sajian dengan sambal dan bumbu pedas menggugah selera.',
    image: '/media/categories/makanan-pedas.webp',
    status: 'active',
    recipeCount: 0,
  },
  {
    id: 'category-makanan-sehat',
    name: 'Makanan Sehat',
    slug: 'makanan-sehat',
    description: 'Pilihan sayur dan lauk ringan untuk menu sehari-hari.',
    image: '/media/categories/makanan-sehat.webp',
    status: 'active',
    recipeCount: 0,
  },
  {
    id: 'category-olahan-buah',
    name: 'Olahan Buah',
    slug: 'olahan-buah',
    description: 'Buah segar yang diolah menjadi camilan dan minuman.',
    image: '/media/categories/olahan-buah.webp',
    status: 'active',
    recipeCount: 0,
  },
  {
    id: 'category-lainnya',
    name: 'Lainnya',
    slug: 'lainnya',
    description: 'Resep praktis yang tidak masuk kategori lain.',
    image: '/media/categories/lainnya.webp',
    status: 'active',
    recipeCount: 0,
  },
]
