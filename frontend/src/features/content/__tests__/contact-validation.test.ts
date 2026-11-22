import { describe, expect, it } from 'vitest'

import { validateContact, type ContactFormValues } from '../contact-validation'

const valid: ContactFormValues = {
  name: 'Sari Penguji',
  email: 'sari@contoh.com',
  subject: 'Pertanyaan resep',
  message: 'Apakah soto bisa disimpan semalaman?',
  consent: true,
}

describe('validasi form kontak', () => {
  it('menerima isian yang valid', () => {
    expect(validateContact(valid)).toEqual({})
  })

  it('menolak nama dan subjek di luar batas', () => {
    expect(validateContact({ ...valid, name: 'A' }).name).toMatch(/2–80/)
    expect(validateContact({ ...valid, subject: 'abc' }).subject).toMatch(/4–120/)
  })

  it('menolak email kosong dan format tidak valid', () => {
    expect(validateContact({ ...valid, email: '' }).email).toBe('Email wajib diisi.')
    expect(validateContact({ ...valid, email: 'sari@' }).email).toMatch(/Format email/)
    expect(validateContact({ ...valid, email: 'sari contoh.com' }).email).toMatch(/Format email/)
  })

  it('menolak pesan kurang dari 20 karakter dan lebih dari 2000', () => {
    expect(validateContact({ ...valid, message: 'Terlalu pendek' }).message).toMatch(/20–2000/)
    expect(validateContact({ ...valid, message: 'x'.repeat(2001) }).message).toMatch(/20–2000/)
  })

  it('mewajibkan persetujuan', () => {
    expect(validateContact({ ...valid, consent: false }).consent).toMatch(/persetujuan/i)
  })

  it('mengabaikan spasi di awal dan akhir', () => {
    expect(
      validateContact({
        ...valid,
        name: '  Sari  ',
        email: '  sari@contoh.com  ',
        subject: '  Tanya resep  ',
        message: '  Apakah soto bisa disimpan semalaman?  ',
      }),
    ).toEqual({})
  })
})
