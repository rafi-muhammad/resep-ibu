const LOGIN_PATH = '/masuk'

/**
 * Membersihkan `returnTo` dari query string.
 * Hanya path internal yang diizinkan; URL absolut, protocol-relative,
 * backslash, dan halaman auth ditolak agar tidak terjadi open redirect
 * atau loop navigasi.
 */
export function sanitizeReturnTo(value: string | null | undefined, fallback = '/profil'): string {
  if (!value) return fallback
  if (!value.startsWith('/')) return fallback
  if (value.startsWith('//') || value.startsWith('/\\')) return fallback

  for (const character of value) {
    if (character.charCodeAt(0) < 32) return fallback
  }

  const path = value.split('?')[0]?.split('#')[0] ?? ''

  if (path === LOGIN_PATH || path === '/daftar') return fallback

  return value
}

/** Membangun `/masuk?returnTo=...` dari lokasi saat ini. */
export function buildLoginPath(pathname: string, search = '', hash = ''): string {
  const returnTo = sanitizeReturnTo(`${pathname}${search}${hash}`, '/profil')
  return `${LOGIN_PATH}?returnTo=${encodeURIComponent(returnTo)}`
}

/** Membaca `returnTo` dari query string dan memvalidasinya. */
export function getReturnTo(search: string, fallback = '/profil'): string {
  const params = new URLSearchParams(search)
  return sanitizeReturnTo(params.get('returnTo'), fallback)
}
