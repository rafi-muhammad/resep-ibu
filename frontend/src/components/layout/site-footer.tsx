import { Link } from 'react-router-dom'

import { Container } from './container'

const currentYear = new Date().getFullYear()

const footerLinks = [
  { label: 'Semua resep', to: '/resep' },
  { label: 'Resep populer', to: '/resep/populer' },
  { label: 'Kategori', to: '/kategori' },
  { label: 'Tentang kami', to: '/tentang' },
  { label: 'Kontak', to: '/kontak' },
  { label: 'Bagikan resep', to: '/bagikan' },
]

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface/40">
      <Container className="grid gap-8 py-10 sm:grid-cols-[1.5fr_1fr]">
        <div className="flex max-w-sm flex-col gap-3">
          <p className="flex items-center gap-2 text-h3 font-extrabold text-brown">
            <span
              aria-hidden="true"
              className="grid h-8 w-8 place-items-center rounded-full bg-accent text-label text-ink"
            >
              RI
            </span>
            Resep Ibu
          </p>
          <p className="text-small text-muted">
            Kumpulan resep masakan rumahan untuk dimasak bersama keluarga.
          </p>
        </div>

        <nav aria-label="Navigasi footer">
          <h2 className="text-small font-bold text-brown">Jelajahi</h2>
          <ul className="mt-3 grid gap-1 sm:grid-cols-2">
            {footerLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="inline-flex min-h-11 items-center text-small text-muted hover:text-action hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <Container className="border-t border-border py-4">
        <p className="text-small text-muted">© {currentYear} Resep Ibu. Data demo untuk Phase 1.</p>
      </Container>
    </footer>
  )
}
