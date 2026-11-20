import { describe, expect, it } from 'vitest'

import {
  buildRecipeListSearch,
  parseRecipeListParams,
  updateRecipeListParams,
} from '@/features/recipes/query'

describe('parseRecipeListParams', () => {
  it('membaca q, kategori, urutan, dan halaman', () => {
    const params = parseRecipeListParams(
      new URLSearchParams('q=Soto&kategori=makanan-berkuah&urutan=az&halaman=3'),
    )

    expect(params).toEqual({
      q: 'Soto',
      category: 'makanan-berkuah',
      sort: 'az',
      page: 3,
    })
  })

  it('mengabaikan q kosong dan memakai default untuk nilai tidak valid', () => {
    const params = parseRecipeListParams(new URLSearchParams('q=%20%20&urutan=acak&halaman=-4'))

    expect(params).toEqual({ q: '', category: '', sort: 'terbaru', page: 1 })
  })

  it('membulatkan halaman desimal dan menolak NaN', () => {
    expect(parseRecipeListParams(new URLSearchParams('halaman=2.9')).page).toBe(2)
    expect(parseRecipeListParams(new URLSearchParams('halaman=abc')).page).toBe(1)
  })
})

describe('buildRecipeListSearch', () => {
  it('menghilangkan nilai default agar URL ringkas', () => {
    const search = buildRecipeListSearch({
      q: '',
      category: '',
      sort: 'terbaru',
      page: 1,
    })

    expect(search.toString()).toBe('')
  })

  it('menyusun ulang URL lengkap', () => {
    const search = buildRecipeListSearch({
      q: 'soto',
      category: 'makanan-berkuah',
      sort: 'populer',
      page: 2,
    })

    expect(search.toString()).toBe('q=soto&kategori=makanan-berkuah&urutan=populer&halaman=2')
    expect(parseRecipeListParams(search)).toEqual({
      q: 'soto',
      category: 'makanan-berkuah',
      sort: 'populer',
      page: 2,
    })
  })
})

describe('updateRecipeListParams', () => {
  it('kembali ke halaman 1 saat filter berubah', () => {
    const current = { q: 'soto', category: '', sort: 'terbaru' as const, page: 3 }

    expect(updateRecipeListParams(current, { q: 'rawon' }).page).toBe(1)
    expect(updateRecipeListParams(current, { category: 'minuman' }).page).toBe(1)
  })

  it('mempertahankan halaman yang diminta saat pagination', () => {
    const current = { q: 'soto', category: '', sort: 'terbaru' as const, page: 1 }

    expect(updateRecipeListParams(current, { page: 2 })).toEqual({
      ...current,
      page: 2,
    })
  })
})
