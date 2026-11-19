import { hashPassword } from '@/lib/api/mock/hash'

/**
 * Kata sandi demo untuk seluruh akun seed: `resepibu123`.
 * Nilai yang disimpan hanya hash demo, bukan kata sandi asli.
 */
export const DEMO_PASSWORD = 'resepibu123'

export const seedCredentials: Record<string, string> = {
  'user-admin': hashPassword(DEMO_PASSWORD),
  'user-dapur': hashPassword(DEMO_PASSWORD),
  'user-pembaca-1': hashPassword(DEMO_PASSWORD),
  'user-pembaca-2': hashPassword(DEMO_PASSWORD),
}
