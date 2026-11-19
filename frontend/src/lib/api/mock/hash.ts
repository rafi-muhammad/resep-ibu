/**
 * Hash demo yang **bukan** kriptografi aman.
 * Hanya untuk menyamarkan kata sandi demo di localStorage agar tidak
 * tersimpan sebagai teks biasa. Jangan dipakai di produksi.
 */
const DEMO_SALT = 'resep-ibu-demo-v1'

export function hashPassword(password: string): string {
  const input = `${DEMO_SALT}:${password}`
  let hash = 0x811c9dc5

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }

  return (hash >>> 0).toString(16).padStart(8, '0')
}
