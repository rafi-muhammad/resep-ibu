export interface LoginValues {
  email: string
  password: string
}

export type LoginField = keyof LoginValues
export type LoginErrors = Partial<Record<LoginField, string>>

export interface RegisterValues {
  name: string
  email: string
  password: string
  confirmPassword: string
  consent: boolean
}

export type RegisterField = keyof RegisterValues
export type RegisterErrors = Partial<Record<RegisterField, string>>

export const AUTH_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  passwordMin: 8,
} as const

export const LOGIN_FIELD_ORDER: LoginField[] = ['email', 'password']

export const REGISTER_FIELD_ORDER: RegisterField[] = [
  'name',
  'email',
  'password',
  'confirmPassword',
  'consent',
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {}
  const email = values.email.trim()

  if (!email) {
    errors.email = 'Email wajib diisi.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Format email belum benar, contoh: nama@contoh.com.'
  }

  if (!values.password) {
    errors.password = 'Kata sandi wajib diisi.'
  }

  return errors
}

export function validateRegister(values: RegisterValues): RegisterErrors {
  const errors: RegisterErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()

  if (name.length < AUTH_LIMITS.nameMin || name.length > AUTH_LIMITS.nameMax) {
    errors.name = `Nama harus ${AUTH_LIMITS.nameMin}–${AUTH_LIMITS.nameMax} karakter.`
  }

  if (!email) {
    errors.email = 'Email wajib diisi.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Format email belum benar, contoh: nama@contoh.com.'
  }

  if (values.password.length < AUTH_LIMITS.passwordMin) {
    errors.password = `Kata sandi minimal ${AUTH_LIMITS.passwordMin} karakter.`
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Ulangi kata sandi.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Konfirmasi kata sandi belum sama.'
  }

  if (!values.consent) {
    errors.consent = 'Centang persetujuan sebelum mendaftar.'
  }

  return errors
}
