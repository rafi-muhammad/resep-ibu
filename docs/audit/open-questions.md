# Pertanyaan Terbuka dan Log Keputusan

## 1. Keputusan yang sudah final

| ID | Topik | Keputusan | Tanggal | Dampak |
| --- | --- | --- | --- | --- |
| D-01 | Proyek Laravel/Vue lama | Diabaikan; bangun React baru | 18 Nov 2026 | Tidak ada kode lama yang dipakai |
| D-02 | Scope Phase 1 | Publik + akun + admin mock | 18 Nov 2026 | 23 issue, 6 milestone |
| D-03 | Halaman hilang | Dibangun semua, ditandai INFERRED | 18 Nov 2026 | Kategori, detail, kontak, tersimpan |
| D-04 | Struktur repo | `legacy/` + `frontend/` + `docs/` | 18 Nov 2026 | Baseline dipisah dari aplikasi |
| D-05 | Arah visual | Photo-led, Nunito saja | 18 Nov 2026 | Tanpa font tambahan |
| D-06 | Model konten | Bahan/langkah array terstruktur | 19 Nov 2026 | Bukan HTML CKEditor |
| D-07 | Pagination | 12 resep per halaman | 19 Nov 2026 | Meninggalkan 4/halaman |
| D-08 | Rating/komentar | Tidak ada | 19 Nov 2026 | Tidak ada tabel/UI |
| D-09 | Viewer | Tidak ditampilkan | 19 Nov 2026 | Urutan populer dari field mock |
| D-10 | Lupa password/Facebook | Dihapus sampai Phase 2 | 19 Nov 2026 | Tidak ada UI palsu |
| D-11 | Kontak | Form saja, tanpa PII | 19 Nov 2026 | Tidak ada alamat/telepon karangan |
| D-12 | Foto Phase 1 | Foto legacy saja, WebP | 19 Nov 2026 | Lisensi dicatat UNKNOWN |
| D-13 | Nama tim/penulis | Placeholder netral | 19 Nov 2026 | Tidak memakai nama tanpa izin |
| D-14 | Git | Commit + push setiap issue | 19 Nov 2026 | Direct ke `main` |
| D-15 | `.agents/` | Gitignore, `skills-lock.json` di-track | 19 Nov 2026 | Repo lebih ringan |
| D-16 | Kredensial legacy | Arsip apa adanya + peringatan | 19 Nov 2026 | Tidak ada redaksi |

## 2. Pertanyaan yang masih terbuka

| ID | Pertanyaan | Status | Dibutuhkan sebelum | Dampak bila tidak dijawab |
| --- | --- | --- | --- | --- |
| Q-01 | Apakah ada dump SQL / data resep asli? | **UNKNOWN** | Phase 2 | Data lama tidak bisa dimigrasikan; mock tetap dipakai |
| Q-02 | Siapa pemilik hak foto legacy? | **UNKNOWN** | Publikasi publik | Risiko takedown/hukum |
| Q-03 | Nama dan bio tim Resep Ibu yang sebenarnya? | **DECISION REQUIRED** | Sebelum rilis konten | Placeholder tetap dipakai |
| Q-04 | Email/kanal kontak resmi? | **DECISION REQUIRED** | Sebelum rilis | Form demo tanpa tujuan nyata |
| Q-05 | Apakah admin boleh membuat resep baru di Phase 1? | **INFERRED: ya** | M4-02 | Jika tidak, form admin dibatasi |
| Q-06 | Apakah resep tersimpan perlu status "favorit"? | **INFERRED: tidak** | M3-04 | Daftar simpan sederhana |
| Q-07 | Target hosting dan nama domain Phase 2? | **UNKNOWN** | Phase 2 | Arsitektur deployment belum ditentukan |
| Q-08 | Apakah perlu analitik? | **UNKNOWN** | Sebelum rilis | Tidak ada tracking di Phase 1 |

## 3. Asumsi yang dipakai sampai dikoreksi

| ID | Asumsi | Alasan | Risiko |
| --- | --- | --- | --- |
| A-01 | Semua resep mock adalah contoh, bukan data asli | Tidak ada dump DB | User bisa mengira data nyata |
| A-02 | "Populer" ditentukan field `popularity` statis | `viewers` tidak pernah di-increment | Urutan tidak dinamis |
| A-03 | Resep disimpan hanya untuk user login | Tautan ada di profil | Tidak ada bukti skema |
| A-04 | Admin dapat mengelola semua konten | Modul admin legacy mencakup semuanya | Scope admin cukup besar |
| A-05 | Satu bahasa, Indonesia | Seluruh UI legacy berbahasa Indonesia | Tidak ada i18n |
| A-06 | Tanpa komentar/rating | Tidak ada bukti implementasi | Kebutuhan bisa muncul nanti |
| A-07 | Foto lama cukup untuk demo internal | Keputusan D-12 | Tidak untuk publikasi |

## 4. Hal yang tidak akan dilakukan tanpa persetujuan baru

- Mengubah isi `legacy/`.
- Menghapus aset atau file.
- Menambahkan dependency berat (state management, UI kit, form library).
- Membuat backend/API/database di Phase 1.
- Menambahkan rating, komentar, atau penghitung viewer.
- Memakai foto stok atau hasil generate.
- Force push, reset, atau menulis ulang history.

## 5. Cara menutup pertanyaan

1. Tambahkan jawaban ke tabel keputusan dengan tanggal.
2. Perbarui dokumen yang terdampak (`PRD`, `page-specifications`, `design-system`, `frontend-architecture`).
3. Buat atau ubah issue terkait, jangan membuat issue duplikat.
4. Catat perubahan di `docs/project/issue-traceability.md`.
