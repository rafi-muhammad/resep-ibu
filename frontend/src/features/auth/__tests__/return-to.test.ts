import { describe, expect, it } from 'vitest'

import { buildLoginPath, getReturnTo, sanitizeReturnTo } from '@/features/auth/return-to'

describe('sanitizeReturnTo', () => {
  it('menerima path internal beserta query dan hash', () => {
    expect(sanitizeReturnTo('/resep?q=soto#bahan')).toBe('/resep?q=soto#bahan')
    expect(sanitizeReturnTo('/admin')).toBe('/admin')
  })

  it('menolak URL absolut dan protocol-relative', () => {
    expect(sanitizeReturnTo('https://contoh.test/masuk')).toBe('/profil')
    expect(sanitizeReturnTo('//contoh.test')).toBe('/profil')
    expect(sanitizeReturnTo('/\\contoh.test')).toBe('/profil')
    expect(sanitizeReturnTo('javascript:alert(1)')).toBe('/profil')
    expect(sanitizeReturnTo('masuk')).toBe('/profil')
  })

  it('menolak karakter kontrol dan fallback kustom', () => {
    expect(sanitizeReturnTo('/resep\nSet-Cookie: x')).toBe('/profil')
    expect(sanitizeReturnTo(null, '/')).toBe('/')
  })

  it('menghindari loop kembali ke halaman auth', () => {
    expect(sanitizeReturnTo('/masuk')).toBe('/profil')
    expect(sanitizeReturnTo('/daftar?returnTo=/admin')).toBe('/profil')
  })
})

describe('buildLoginPath dan getReturnTo', () => {
  it('membangun returnTo terenkode dari lokasi saat ini', () => {
    expect(buildLoginPath('/resep', '?q=soto', '#bahan')).toBe(
      '/masuk?returnTo=%2Fresep%3Fq%3Dsoto%23bahan',
    )
  })

  it('membaca kembali returnTo yang valid', () => {
    const path = buildLoginPath('/admin/resep')
    const search = path.slice(path.indexOf('?'))

    expect(getReturnTo(search)).toBe('/admin/resep')
  })

  it('mengganti returnTo berbahaya dengan fallback', () => {
    expect(getReturnTo('?returnTo=%2F%2Fjahat.test')).toBe('/profil')
    expect(getReturnTo('')).toBe('/profil')
  })
})
