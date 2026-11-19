import { CircleAlert } from 'lucide-react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

import { LinkButton } from '@/components/ui'

/**
 * Penangkap error render/route. Tidak menampilkan detail internal
 * dan menyediakan jalan keluar yang jelas.
 */
export function RouteErrorBoundary() {
  const error = useRouteError()
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <main
      id="main"
      tabIndex={-1}
      className="container-page flex min-h-screen flex-col items-center justify-center py-16 text-center"
    >
      <span
        aria-hidden="true"
        className="grid h-14 w-14 place-items-center rounded-full bg-surface text-danger"
      >
        <CircleAlert className="h-7 w-7" />
      </span>
      <p className="eyebrow mt-4 text-action">{isNotFound ? 'Error 404' : 'Terjadi kesalahan'}</p>
      <h1 className="mt-2 text-h1 text-brown">
        {isNotFound ? 'Halaman tidak ditemukan' : 'Halaman gagal dimuat'}
      </h1>
      <p className="measure mt-3 text-body text-muted">
        {isNotFound
          ? 'Alamat yang kamu buka tidak tersedia. Kembali ke beranda untuk melanjutkan.'
          : 'Ada masalah saat menampilkan halaman ini. Coba muat ulang atau kembali ke beranda.'}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <LinkButton to="/">Kembali ke beranda</LinkButton>
        <LinkButton to="/resep" variant="secondary">
          Lihat semua resep
        </LinkButton>
      </div>
    </main>
  )
}
