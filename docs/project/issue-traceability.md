# Issue Traceability — Resep Ibu

| Item | Nilai |
| --- | --- |
| Tanggal | 19 November 2026 |
| Repositori | `rafi-muhammad/resep-ibu` |
| Baseline commit | `4eb2c466c58c1e2a55d938fc925fb31ea442edcd` |
| Jumlah issue | 24 |
| Milestone | M0–M5 |
| Status | Implementasi berjalan; M0-01 dan M1-01 selesai |

## 1. Peta issue

| ID | Issue | Judul | Milestone | Dependencies | Status |
| --- | --- | --- | --- | --- | --- |
| M0-01 | [#1](https://github.com/rafi-muhammad/resep-ibu/issues/1) | Baseline arsip legacy, dokumentasi, struktur | M0 | — | **CLOSED** |
| M1-01 | [#2](https://github.com/rafi-muhammad/resep-ibu/issues/2) | Scaffold Vite React TS + quality scripts | M1 | #1 | **CLOSED** |
| M1-02 | [#3](https://github.com/rafi-muhammad/resep-ibu/issues/3) | Design tokens, Nunito, base styles | M1 | #2 | **CLOSED** |
| M1-03 | [#4](https://github.com/rafi-muhammad/resep-ibu/issues/4) | Form dan feedback primitives | M1 | #3 | **CLOSED** |
| M1-04 | [#5](https://github.com/rafi-muhammad/resep-ibu/issues/5) | Display, dialog, navigation primitives | M1 | #3 | OPEN |
| M1-05 | [#6](https://github.com/rafi-muhammad/resep-ibu/issues/6) | Routing, layout, shell, error boundary | M1 | #3, #4, #5 | OPEN |
| M1-06 | [#7](https://github.com/rafi-muhammad/resep-ibu/issues/7) | Domain types, mock repository, fixtures | M1 | #2 | OPEN |
| M1-07 | [#8](https://github.com/rafi-muhammad/resep-ibu/issues/8) | Demo auth provider dan protected routes | M1 | #6, #7 | OPEN |
| M1-08 | [#9](https://github.com/rafi-muhammad/resep-ibu/issues/9) | Optimasi aset WebP dan mapping | M1 | #1 | OPEN |
| M2-01 | [#10](https://github.com/rafi-muhammad/resep-ibu/issues/10) | Daftar resep, search, filter, pagination, populer | M2 | #5, #6, #7, #9 | OPEN |
| M2-02 | [#11](https://github.com/rafi-muhammad/resep-ibu/issues/11) | Beranda | M2 | #8, #10 | OPEN |
| M2-03 | [#12](https://github.com/rafi-muhammad/resep-ibu/issues/12) | Detail resep | M2 | #8, #10 | OPEN |
| M2-04 | [#13](https://github.com/rafi-muhammad/resep-ibu/issues/13) | Indeks dan detail kategori | M2 | #9, #10 | OPEN |
| M2-05 | [#14](https://github.com/rafi-muhammad/resep-ibu/issues/14) | Tentang Kami dan Kontak | M2 | #4, #6, #7, #9 | OPEN |
| M3-01 | [#15](https://github.com/rafi-muhammad/resep-ibu/issues/15) | Login, registrasi, logout | M3 | #8 | OPEN |
| M3-02 | [#16](https://github.com/rafi-muhammad/resep-ibu/issues/16) | Profil dan ubah password | M3 | #15 | OPEN |
| M3-03 | [#17](https://github.com/rafi-muhammad/resep-ibu/issues/17) | Form berbagi resep | M3 | #4, #15 | OPEN |
| M3-04 | [#18](https://github.com/rafi-muhammad/resep-ibu/issues/18) | Resep saya dan resep disimpan | M3 | #12, #15 | OPEN |
| M4-01 | [#19](https://github.com/rafi-muhammad/resep-ibu/issues/19) | Admin shell, dashboard, pengguna | M4 | #6, #15 | OPEN |
| M4-02 | [#20](https://github.com/rafi-muhammad/resep-ibu/issues/20) | Admin resep dan kategori | M4 | #10, #19 | OPEN |
| M4-03 | [#21](https://github.com/rafi-muhammad/resep-ibu/issues/21) | Admin pesan, tentang, tim | M4 | #14, #19 | OPEN |
| M5-01 | [#22](https://github.com/rafi-muhammad/resep-ibu/issues/22) | Automated tests dan CI | M5 | #10–#21 | OPEN |
| M5-02 | [#23](https://github.com/rafi-muhammad/resep-ibu/issues/23) | Responsive dan accessibility audit | M5 | #10–#21 | OPEN |
| M5-03 | [#24](https://github.com/rafi-muhammad/resep-ibu/issues/24) | Visual QA, docs sync, traceability | M5 | #22, #23 | OPEN |

## 2. Requirement → issue

| Requirement | Issue utama |
| --- | --- |
| FR-PUB-01 Beranda | #11 |
| FR-PUB-02 Daftar, search, filter, pagination | #10 |
| FR-PUB-03 Detail resep | #12 |
| FR-PUB-04 Resep populer | #10 |
| FR-PUB-05 Indeks kategori | #13 |
| FR-PUB-06 Detail kategori | #13 |
| FR-PUB-07 Tentang Kami | #14 |
| FR-PUB-08 Kontak | #14 |
| FR-PUB-09 404 dan error | #6 |
| FR-ACC-01 Login | #15 |
| FR-ACC-02 Registrasi | #15 |
| FR-ACC-03 Logout | #15 |
| FR-ACC-04 Profil | #16 |
| FR-ACC-05 Ubah password | #16 |
| FR-ACC-06 Route guard | #8, #19 |
| FR-CON-01 Berbagi resep | #17 |
| FR-CON-02 Resep saya | #18 |
| FR-CON-03 Resep disimpan | #12, #18 |
| FR-CON-04 Hapus resep sendiri | #18 |
| FR-ADM-01 Dashboard | #19 |
| FR-ADM-02 Kelola resep | #20 |
| FR-ADM-03 Kelola kategori | #20 |
| FR-ADM-04 Kelola pengguna | #19 |
| FR-ADM-05 Kelola pesan | #21 |
| FR-ADM-06 Tentang dan tim | #21 |
| FR-SYS-01 Repository | #7 |
| FR-SYS-02 Persistensi demo | #7 |
| FR-SYS-03 Toast | #4 |
| FR-SYS-04 Loading/empty/error | #10, #14 |
| FR-SYS-05 Responsif | #23 |

## 3. Milestone

| Milestone | Nomor | Jumlah issue | Status |
| --- | --- | --- | --- |
| M0 — Baseline | 1 | 1 | Selesai |
| M1 — Foundation | 2 | 8 | Berjalan (3/8) |
| M2 — Public Experience | 3 | 5 | Belum dimulai |
| M3 — Account & Contribution | 4 | 4 | Belum dimulai |
| M4 — Admin | 5 | 3 | Belum dimulai |
| M5 — QA & Handoff | 6 | 3 | Belum dimulai |

## 4. Label

Label proyek yang dibuat:

| Label | Kegunaan |
| --- | --- |
| `type:feature` | Fitur baru |
| `type:chore` | Pekerjaan teknis |
| `type:docs` | Dokumentasi |
| `type:test` | Testing dan QA |
| `area:foundation` | Fondasi aplikasi |
| `area:public` | Halaman publik |
| `area:account` | Akun dan kontribusi |
| `area:admin` | Area admin |
| `area:qa` | QA dan handoff |
| `area:design` | Desain dan sistem visual |

Label bawaan `documentation` dan `accessibility` juga dipakai.

## 5. Riwayat commit

| Commit | Isi |
| --- | --- |
| `4eb2c46` | Baseline: arsip legacy, 9 dokumen perencanaan, README, AGENTS, .gitignore |
| Commit dokumentasi ini | Traceability 24 issue dan verifikasi |
| `e83eac3` | M1-01: scaffold Vite React TS, Tailwind, Vitest, oxlint, Prettier (#2) |
| `f189d04` | M1-02: design tokens, Nunito, base styles (#3) |
| `cafeb00` | M1-03: 14 form dan feedback primitives + 29 test (#4) |

## 6. Verifikasi

| Pemeriksaan | Hasil |
| --- | --- |
| Jumlah issue | 24 |
| Format wajib (7 heading) | 24/24 lengkap |
| Placeholder belum terisi | 0 |
| Duplikasi judul | 0 |
| Distribusi milestone | 1 / 8 / 5 / 4 / 3 / 3 |
| Dependensi tidak valid | 0 |
| Issue #1 | CLOSED, alasan completed |
| Issue #2 | CLOSED, alasan completed |
| Issue #3 | CLOSED, alasan completed |
| Issue #4 | CLOSED, alasan completed |
| Commit implementasi terakhir | `cafeb00` |
| File terlacak | 207 |
| File terlarang di Git | 0 |
| Fingerprint legacy | `e054d179...977212` (identik) |

## 7. Aturan pembaruan

1. Setiap issue yang selesai dicatat tanggal dan commit-nya di dokumen ini.
2. Jangan mengubah nomor issue; tautkan issue baru bila scope berubah.
3. Jika dependensi berubah, perbarui issue terkait dan tabel ini.
4. Status di sini harus sama dengan status di GitHub.
