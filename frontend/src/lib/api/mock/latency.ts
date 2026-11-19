const DEFAULT_MIN_MS = 150
const DEFAULT_MAX_MS = 300

function resolveLatency(): number {
  const configured = import.meta.env.VITE_MOCK_LATENCY

  if (typeof configured === 'string' && configured.trim() !== '') {
    const parsed = Number(configured)
    if (Number.isFinite(parsed)) return Math.max(0, parsed)
  }

  return DEFAULT_MIN_MS + Math.floor(Math.random() * (DEFAULT_MAX_MS - DEFAULT_MIN_MS + 1))
}

/**
 * Meniru latensi jaringan. Set `VITE_MOCK_LATENCY=0` pada test
 * agar seluruh operasi selesai seketika.
 */
export async function simulateLatency(): Promise<void> {
  const ms = resolveLatency()
  if (ms <= 0) return

  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
