export const PROFILE_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  bioMax: 300,
} as const

export interface ProfileValues {
  name: string
  email: string
  bio: string
  avatar: string
}

export type ProfileField = keyof ProfileValues
export type ProfileErrors = Partial<Record<ProfileField, string>>

export interface PasswordValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export type PasswordField = keyof PasswordValues
export type PasswordErrors = Partial<Record<PasswordField, string>>

export interface AvatarPreset {
  src: string
  label: string
}

/** Preset avatar bawaan; Phase 1 tidak mengunggah berkas pengguna. */
export const AVATAR_PRESETS: AvatarPreset[] = [
  { src: '/media/avatars/default.webp', label: 'Avatar bawaan' },
  { src: '/media/avatars/preset-1.webp', label: 'Preset satu' },
  { src: '/media/avatars/preset-2.webp', label: 'Preset dua' },
  { src: '/media/avatars/preset-3.webp', label: 'Preset tiga' },
]

export const DEFAULT_AVATAR = AVATAR_PRESETS[0]!.src

export const PROFILE_FIELD_ORDER: ProfileField[] = ['name', 'email', 'bio', 'avatar']

export const PASSWORD_FIELD_ORDER: PasswordField[] = [
  'currentPassword',
  'newPassword',
  'confirmPassword',
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateProfile(values: ProfileValues): ProfileErrors {
  const errors: ProfileErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()

  if (name.length < PROFILE_LIMITS.nameMin || name.length > PROFILE_LIMITS.nameMax) {
    errors.name = `Nama harus ${PROFILE_LIMITS.nameMin}–${PROFILE_LIMITS.nameMax} karakter.`
  }

  if (!email) {
    errors.email = 'Email wajib diisi.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Format email belum benar, contoh: nama@contoh.com.'
  }

  if (values.bio.trim().length > PROFILE_LIMITS.bioMax) {
    errors.bio = `Bio maksimal ${PROFILE_LIMITS.bioMax} karakter.`
  }

  if (!AVATAR_PRESETS.some((preset) => preset.src === values.avatar)) {
    errors.avatar = 'Pilih salah satu avatar yang tersedia.'
  }

  return errors
}

export function validatePassword(values: PasswordValues): PasswordErrors {
  const errors: PasswordErrors = {}

  if (!values.currentPassword) {
    errors.currentPassword = 'Kata sandi saat ini wajib diisi.'
  }

  if (values.newPassword.length < 8) {
    errors.newPassword = 'Kata sandi baru minimal 8 karakter.'
  } else if (values.newPassword === values.currentPassword) {
    errors.newPassword = 'Kata sandi baru harus berbeda dari yang sekarang.'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Ulangi kata sandi baru.'
  } else if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = 'Konfirmasi kata sandi belum sama.'
  }

  return errors
}
