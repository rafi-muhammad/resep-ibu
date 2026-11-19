import { Suspense, type ReactNode } from 'react'

import { Spinner } from '@/components/ui'

export function RouteFallback() {
  return (
    <div className="flex justify-center py-16">
      <Spinner size="lg" label="Memuat halaman" />
    </div>
  )
}

/** Membungkus route lazy dengan indikator muat yang dapat diumumkan. */
export function AdminRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}
