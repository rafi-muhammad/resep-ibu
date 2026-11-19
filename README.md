# Resep Ibu

Modernisasi situs resep masakan rumahan **Resep Ibu** dari Vanilla PHP/MySQL menjadi aplikasi web modern.

Pengembangan dibagi dua fase dan **hanya Phase 1 yang sedang dikerjakan**:

| Fase | Isi | Status |
| --- | --- | --- |
| Phase 1 | Frontend React + TypeScript + Vite + Tailwind, data mock | Perencanaan selesai, implementasi belum dimulai |
| Phase 2 | Backend Laravel + SQLite + API + autentikasi | Belum dimulai |

## Struktur repositori

```text
resep-ibu/
  legacy/      Arsip situs PHP asli, tidak diubah isinya
  frontend/    Aplikasi React (Phase 1)
  docs/        Audit, PRD, desain, arsitektur, traceability
  backend/     Laravel (Phase 2, belum dibuat)
```

`legacy/` dipertahankan sebagai bukti historis dan sumber audit. Jangan menjalankan atau men-deploy kode legacy.

## Dokumentasi

- [Audit kode](docs/audit/codebase-audit.md)
- [Inventaris fitur](docs/audit/feature-inventory.md)
- [Inventaris aset](docs/audit/asset-inventory.md)
- [Pertanyaan dan keputusan](docs/audit/open-questions.md)
- [PRD](docs/product/PRD.md)
- [Design system](docs/design/design-system.md)
- [Spesifikasi halaman](docs/design/page-specifications.md)
- [Inventaris komponen](docs/design/component-inventory.md)
- [Arsitektur frontend](docs/architecture/frontend-architecture.md)
- [Traceability issue](docs/project/issue-traceability.md)

## Prasyarat

- Node.js 22 atau lebih baru
- npm 10 atau lebih baru
- Git

Perintah frontend akan tersedia setelah issue `M1-01` selesai:

```bash
cd frontend
npm install
npm run dev
```

## Alur kerja

1. Setiap pekerjaan mengacu pada satu GitHub Issue.
2. Satu issue selesai → jalankan quality gate → commit → push.
3. Format commit: `type(scope): ringkasan (#nomor-issue)`.
4. Jangan pernah force push, reset, atau menghapus file di luar scope issue.

## Peringatan legacy

Folder `legacy/` berisi kredensial database lokal default (`root`, password kosong), tanpa autentikasi admin, serta kerentanan SQL injection dan XSS. Nilai tersebut bukan secret aktif, tetapi **jangan dipakai ulang**. Detail ada di [legacy/README.md](legacy/README.md).

## Lisensi aset

Kode asli tidak memiliki pernyataan lisensi. Foto di `legacy/` tampak merupakan unggahan pengguna dan status lisensinya **UNKNOWN**. Lihat [inventaris aset](docs/audit/asset-inventory.md) sebelum mempublikasikan ulang.
