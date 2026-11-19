/** Tautan lewati navigasi; hanya terlihat saat fokus keyboard. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-sm bg-brown px-4 py-2 font-bold text-ink-inverse focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
    >
      Lewati ke konten utama
    </a>
  )
}
