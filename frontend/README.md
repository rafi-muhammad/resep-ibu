# Frontend Resep Ibu (Phase 1)

Aplikasi React + TypeScript + Vite + Tailwind CSS dengan data mock.

**Status:** scaffold selesai (issue `#2`). Halaman produk dibangun pada issue berikutnya.

## Stack

| Lapisan   | Pilihan                                |
| --------- | -------------------------------------- |
| Build     | Vite                                   |
| UI        | React 19 + TypeScript strict           |
| Styling   | Tailwind CSS v4                        |
| Lint      | oxlint                                 |
| Format    | Prettier                               |
| Unit test | Vitest + React Testing Library + jsdom |

Tidak ada backend, API, database, atau autentikasi nyata pada Phase 1.

## Perintah

```bash
npm install
npm run dev          # server pengembangan
npm run build        # build produksi
npm run preview      # pratinjau build
npm run typecheck    # TypeScript strict
npm run lint         # oxlint
npm run lint:fix     # oxlint dengan perbaikan otomatis
npm run format       # Prettier
npm run format:check # cek format
npm run test         # Vitest sekali jalan
npm run test:watch   # Vitest watch
```

Alias impor: `@/` mengarah ke `src/`.

## Aturan

- Tidak ada backend, API, database, atau autentikasi nyata.
- Semua akses data melalui repository di `src/lib/api` dengan adapter mock.
- Jangan menyalin konfigurasi, dependency, atau file build dari proyek lain.
- Jangan memakai nilai warna langsung di komponen; gunakan token design system (issue `#3`).
- Dokumentasi arsitektur: `../docs/architecture/frontend-architecture.md`.

## Quality gate

Sebelum commit, jalankan:

```bash
npm run typecheck && npm run lint && npm run format:check && npm run test && npm run build
```
