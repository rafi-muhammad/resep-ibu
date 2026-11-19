import { Link, Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg lg:grid lg:grid-cols-2">
      <aside
        data-surface="inverse"
        className="hidden flex-col justify-between p-10 lg:flex"
        aria-label="Tentang Resep Ibu"
      >
        <Link
          to="/"
          className="flex items-center gap-2 rounded-sm text-h3 font-extrabold text-ink-inverse"
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-full bg-accent text-label text-ink"
          >
            RI
          </span>
          Resep Ibu
        </Link>

        <div className="flex max-w-md flex-col gap-4">
          <p className="eyebrow text-accent">Masak dengan tenang</p>
          <p className="text-h1 text-ink-inverse">
            Resep rumahan, tersimpan rapi dalam satu tempat.
          </p>
          <p className="text-body text-ink-inverse/80">
            Simpan resep favorit, bagikan resep keluarga, dan temukan inspirasi masakan sehari-hari.
          </p>
        </div>

        <p className="text-small text-ink-inverse/70">Data demo untuk Phase 1.</p>
      </aside>

      <main
        id="main"
        tabIndex={-1}
        className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8"
      >
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 rounded-sm text-h3 font-extrabold text-brown lg:hidden"
          >
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-full bg-accent text-label text-ink"
            >
              RI
            </span>
            Resep Ibu
          </Link>
          <Outlet />
          <p className="mt-8 rounded-sm border border-border bg-surface px-4 py-3 text-small text-muted">
            Mode demo: sesi disimpan di browser ini. Ini bukan autentikasi nyata dan tidak boleh
            dipakai untuk data sungguhan.
          </p>
        </div>
      </main>
    </div>
  )
}
