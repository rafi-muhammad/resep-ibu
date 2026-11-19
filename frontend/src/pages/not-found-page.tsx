import { Compass } from 'lucide-react'

import { LinkButton } from '@/components/ui'

export function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-4 py-12 text-center">
      <span
        aria-hidden="true"
        className="grid h-14 w-14 place-items-center rounded-full bg-surface text-brown"
      >
        <Compass className="h-7 w-7" />
      </span>
      <p className="eyebrow text-action">Error 404</p>
      <h1 className="text-h1 text-brown">Halaman tidak ditemukan</h1>
      <p className="text-body text-muted">
        Alamat yang kamu buka tidak tersedia atau sudah berpindah. Coba kembali ke beranda atau
        jelajahi daftar resep.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <LinkButton to="/">Kembali ke beranda</LinkButton>
        <LinkButton to="/resep" variant="secondary">
          Lihat semua resep
        </LinkButton>
      </div>
    </section>
  )
}
