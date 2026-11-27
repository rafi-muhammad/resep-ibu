import { describe, expect, it } from 'vitest'

import {
  DEFAULT_AVATAR,
  validatePassword,
  validateProfile,
  type PasswordValues,
  type ProfileValues,
} from '../profile-validation'

const validProfile: ProfileValues = {
  name: 'Pembaca Satu',
  email: 'pembaca1@resepibu.test',
  bio: 'Suka masakan rumahan.',
  avatar: DEFAULT_AVATAR,
}

const validPassword: PasswordValues = {
  currentPassword: 'resepibu123',
  newPassword: 'resepbaru123',
  confirmPassword: 'resepbaru123',
}

describe('validasi profil', () => {
  it('menerima data profil yang valid', () => {
    expect(validateProfile(validProfile)).toEqual({})
  })

  it('menolak nama di luar 2–80 karakter', () => {
    expect(validateProfile({ ...validProfile, name: 'A' }).name).toMatch(/2–80/)
    expect(validateProfile({ ...validProfile, name: 'x'.repeat(81) }).name).toMatch(/2–80/)
  })

  it('mewajibkan email dengan format benar', () => {
    expect(validateProfile({ ...validProfile, email: '  ' }).email).toBe('Email wajib diisi.')
    expect(validateProfile({ ...validProfile, email: 'pembaca@' }).email).toMatch(/Format email/)
  })

  it('menolak bio lebih dari 300 karakter', () => {
    expect(validateProfile({ ...validProfile, bio: 'x'.repeat(301) }).bio).toMatch(/300/)
  })

  it('menolak avatar di luar preset', () => {
    expect(validateProfile({ ...validProfile, avatar: '/media/avatars/lain.webp' }).avatar).toMatch(
      /preset|avatar/i,
    )
  })
})

describe('validasi kata sandi', () => {
  it('menerima kata sandi baru yang valid', () => {
    expect(validatePassword(validPassword)).toEqual({})
  })

  it('mewajibkan kata sandi saat ini', () => {
    expect(validatePassword({ ...validPassword, currentPassword: '' }).currentPassword).toMatch(
      /wajib diisi/,
    )
  })

  it('menolak kata sandi baru kurang dari 8 karakter', () => {
    expect(
      validatePassword({
        ...validPassword,
        newPassword: 'pendek',
        confirmPassword: 'pendek',
      }).newPassword,
    ).toMatch(/minimal 8/)
  })

  it('menolak kata sandi baru yang sama dengan kata sandi saat ini', () => {
    expect(
      validatePassword({
        ...validPassword,
        newPassword: 'resepibu123',
        confirmPassword: 'resepibu123',
      }).newPassword,
    ).toMatch(/berbeda/)
  })

  it('menolak konfirmasi yang tidak sama', () => {
    expect(
      validatePassword({ ...validPassword, confirmPassword: 'lain12345' }).confirmPassword,
    ).toMatch(/belum sama/)
  })
})
