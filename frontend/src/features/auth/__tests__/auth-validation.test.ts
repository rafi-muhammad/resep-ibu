import { describe, expect, it } from 'vitest'

import { validateLogin, validateRegister, type RegisterValues } from '../auth-validation'

const validRegister: RegisterValues = {
  name: 'Pengguna Baru',
  email: 'baru@contoh.com',
  password: 'resepibu123',
  confirmPassword: 'resepibu123',
  consent: true,
}

describe('validasi login', () => {
  it('menerima email dan kata sandi yang terisi', () => {
    expect(validateLogin({ email: 'admin@resepibu.test', password: 'resepibu123' })).toEqual({})
  })

  it('mewajibkan email dan kata sandi', () => {
    const errors = validateLogin({ email: '', password: '' })
    expect(errors.email).toBe('Email wajib diisi.')
    expect(errors.password).toBe('Kata sandi wajib diisi.')
  })

  it('menolak format email yang salah', () => {
    expect(validateLogin({ email: 'admin@', password: 'x' }).email).toMatch(/Format email/)
  })
})

describe('validasi registrasi', () => {
  it('menerima isian yang valid', () => {
    expect(validateRegister(validRegister)).toEqual({})
  })

  it('menolak nama di luar 2–80 karakter', () => {
    expect(validateRegister({ ...validRegister, name: 'A' }).name).toMatch(/2–80/)
    expect(validateRegister({ ...validRegister, name: 'x'.repeat(81) }).name).toMatch(/2–80/)
  })

  it('menolak kata sandi kurang dari 8 karakter', () => {
    expect(
      validateRegister({ ...validRegister, password: 'pendek', confirmPassword: 'pendek' })
        .password,
    ).toMatch(/minimal 8/)
  })

  it('menolak konfirmasi yang tidak sama', () => {
    expect(
      validateRegister({ ...validRegister, confirmPassword: 'berbeda123' }).confirmPassword,
    ).toMatch(/belum sama/)
  })

  it('mewajibkan persetujuan', () => {
    expect(validateRegister({ ...validRegister, consent: false }).consent).toMatch(/persetujuan/i)
  })
})
