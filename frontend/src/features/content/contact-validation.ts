export interface ContactFormValues {
  name: string
  email: string
  subject: string
  message: string
  consent: boolean
}

export type ContactField = keyof ContactFormValues

export type ContactErrors = Partial<Record<ContactField, string>>

export const CONTACT_FIELD_ORDER: ContactField[] = [
  'name',
  'email',
  'subject',
  'message',
  'consent',
]

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  subjectMin: 4,
  subjectMax: 120,
  messageMin: 20,
  messageMax: 2000,
} as const

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Validasi form kontak; mengembalikan pesan per field yang bermasalah. */
export function validateContact(values: ContactFormValues): ContactErrors {
  const errors: ContactErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const subject = values.subject.trim()
  const message = values.message.trim()

  if (name.length < CONTACT_LIMITS.nameMin || name.length > CONTACT_LIMITS.nameMax) {
    errors.name = `Nama harus ${CONTACT_LIMITS.nameMin}–${CONTACT_LIMITS.nameMax} karakter.`
  }

  if (!email) {
    errors.email = 'Email wajib diisi.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Format email belum benar, contoh: nama@contoh.com.'
  }

  if (subject.length < CONTACT_LIMITS.subjectMin || subject.length > CONTACT_LIMITS.subjectMax) {
    errors.subject = `Subjek harus ${CONTACT_LIMITS.subjectMin}–${CONTACT_LIMITS.subjectMax} karakter.`
  }

  if (message.length < CONTACT_LIMITS.messageMin || message.length > CONTACT_LIMITS.messageMax) {
    errors.message = `Pesan harus ${CONTACT_LIMITS.messageMin}–${CONTACT_LIMITS.messageMax} karakter.`
  }

  if (!values.consent) {
    errors.consent = 'Centang persetujuan sebelum mengirim pesan.'
  }

  return errors
}
