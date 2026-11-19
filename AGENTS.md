# AGENTS.md — Resep Ibu

Panduan untuk agen AI yang bekerja di repositori ini.

## Konteks proyek

Resep Ibu adalah situs resep masakan rumahan yang dimodernisasi dua fase:

- **Phase 1 (aktif):** React + TypeScript + Vite + Tailwind CSS, seluruh data mock, tanpa backend/API/database/autentikasi nyata.
- **Phase 2 (belum dimulai):** Laravel + SQLite + API + autentikasi.

Jangan memulai Phase 2 sebelum Phase 1 disetujui.

## Sumber kebenaran

1. Kode di `legacy/` adalah bukti historis. Jangan mengubah isinya.
2. Dokumen di `docs/` adalah acuan produk, desain, dan arsitektur.
3. GitHub Issues adalah acuan eksekusi. Satu issue = satu unit pekerjaan.
4. Jangan mengarang fitur, metrik, nama orang, atau data yang tidak ada buktinya. Gunakan label **CONFIRMED**, **DOCUMENTED**, **INFERRED**, **UNKNOWN**, **DECISION REQUIRED** pada dokumen audit.

## Batasan Phase 1

- Tidak ada backend, API, database, atau autentikasi sungguhan.
- Tidak ada rating, komentar, atau penghitung viewer.
- Tidak ada halaman lupa password atau login Facebook.
- Autentikasi demo memakai `localStorage`, bukan keamanan nyata.
- Jangan menambahkan dependency tanpa alasan yang tercatat di issue.
- Jangan membuat komponen duplikat; gunakan varian props.

## Stack dan konvensi

- React 19 + TypeScript strict + Vite + Tailwind CSS + React Router + Lucide React.
- Vitest + React Testing Library; Playwright untuk alur kritis.
- Tidak ada state management library; gunakan Context untuk auth dan toast.
- Struktur fitur: `frontend/src/features/<domain>`; primitif di `frontend/src/components/ui`.
- Akses data hanya melalui repository di `frontend/src/lib/api`; komponen tidak mengimpor fixture langsung.
- Bahasa UI: Indonesia. Nama variabel dan tipe: Inggris.

## Identitas visual

- Brown `#583217`, Terracotta `#DE876B`, Cream `#FFF7E5`, Beige `#FBE8D5`, aksen aksi `#A34E2E`.
- Font tunggal: Nunito.
- Terracotta tidak boleh dipakai untuk teks kecil di atas cream (kontras 2,53:1).
- Detail lengkap: `docs/design/design-system.md`.

## Git dan issue

1. Kerjakan hanya scope issue yang sedang aktif.
2. Sebelum commit: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` (sesuai ketersediaan).
3. Commit: `type(scope): ringkasan (#issue)`, contoh `feat(public): recipe listing with search (#12)`.
4. Push ke `origin main` setelah setiap issue selesai.
5. Jangan force push, reset, atau menghapus pekerjaan pengguna.
6. Perbarui `docs/project/issue-traceability.md` bila status issue berubah.

## Keamanan

- Jangan menambahkan `.env`, token, kunci, atau kredensial ke repositori.
- Folder `.agents/` adalah tooling lokal dan di-gitignore.
- Kredensial di `legacy/` adalah default lokal dan tidak boleh dipakai ulang.

## Kualitas

- Setiap halaman harus responsif pada 390, 768, 1024, dan 1440 px.
- Tidak ada link mati atau tombol tanpa aksi.
- Fokus keyboard terlihat, label form eksplisit, kontras AA, dukungan `prefers-reduced-motion`.
- Empty state, loading state, dan error state wajib ada untuk daftar dan form.
