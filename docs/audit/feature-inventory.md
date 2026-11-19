# Inventaris Fitur — Resep Ibu

Dokumen ini memetakan setiap fitur yang terbukti ada, rusak, atau hanya tersirat, lalu menetapkan keputusan Phase 1.

- **CONFIRMED** — berjalan sesuai kode.
- **BROKEN** — kode ada tetapi gagal/parse error.
- **INFERRED** — hanya terbukti lewat tautan/skema, file tidak ada.
- **ABSENT** — tidak ada bukti sama sekali.
- **DROPPED** — sengaja tidak dibawa ke Phase 1.

## 1. Publik

| ID | Fitur | Status legacy | Bukti | Keputusan Phase 1 |
| --- | --- | --- | --- | --- |
| F-PUB-01 | Beranda | CONFIRMED | `legacy/Homepage/homepage.php` | Dipertahankan, desain ulang |
| F-PUB-02 | Pencarian judul | CONFIRMED | `legacy/Search/search.php` | Dipertahankan sebagai state `/resep?q=` |
| F-PUB-03 | Daftar semua resep + pagination | CONFIRMED | `legacy/Search/revisi.php` | Dipertahankan, 12 per halaman |
| F-PUB-04 | Resep populer | CONFIRMED | `legacy/ResepPopuler/resepPopuler.php` | Dipertahankan; urutan dari data mock |
| F-PUB-05 | Indeks kategori | INFERRED | link `kategori.php` | Dibangun baru |
| F-PUB-06 | Detail kategori | INFERRED | link `detilkategori.php?id_kategori=` | Dibangun baru |
| F-PUB-07 | Detail resep | INFERRED | link `detailresep.php?id_resep=` | Dibangun baru |
| F-PUB-08 | Tentang Kami | BROKEN | `legacy/tentangkami/tentangkami.php` | Dibangun ulang |
| F-PUB-09 | Kontak | INFERRED | link `kontak.php` + tabel `kontak` | Dibangun baru, form saja |
| F-PUB-10 | Rating | ABSENT | hanya komentar HTML `<!-- Ratting -->` | DROPPED |
| F-PUB-11 | Komentar | ABSENT | tidak ada tabel/field | DROPPED |
| F-PUB-12 | Penghitung viewer | PARTIAL | kolom dibaca, tidak pernah di-update | DROPPED dari UI |

## 2. Akun

| ID | Fitur | Status legacy | Bukti | Keputusan Phase 1 |
| --- | --- | --- | --- | --- |
| F-ACC-01 | Login email + password | CONFIRMED | `Login_Registrasi/login.php` | Dipertahankan sebagai demo |
| F-ACC-02 | Registrasi | BROKEN | `registrasi.php:11` parse error | Dibangun ulang, demo |
| F-ACC-03 | Logout | CONFIRMED | `Profil/logout.php` | Dipertahankan |
| F-ACC-04 | Lihat profil | CONFIRMED | `Profil/personalData.php` | Dipertahankan |
| F-ACC-05 | Ubah data profil | CONFIRMED | `Functions/functions.php` (`ubah`) | Dipertahankan |
| F-ACC-06 | Ubah password | CONFIRMED | `Profil/editPassword.php` | Dipertahankan |
| F-ACC-07 | Lupa password | ABSENT (UI only) | `login.php:96,115` `href="#"` | DROPPED sampai Phase 2 |
| F-ACC-08 | Login Facebook | ABSENT (tombol) | `login.php` `DaftarFB` | DROPPED |

## 3. Kontribusi

| ID | Fitur | Status legacy | Bukti | Keputusan Phase 1 |
| --- | --- | --- | --- | --- |
| F-CON-01 | Form berbagi resep | BROKEN | `bagi_Resep/bagiresep.php:136` | Dibangun ulang |
| F-CON-02 | Daftar resep yang dibagikan | INFERRED | link `resepdibagi.php` | Dibangun baru |
| F-CON-03 | Resep disimpan | INFERRED | link `resepdisimpan.php` | Dibangun baru (mock) |
| F-CON-04 | Hapus resep sendiri | CONFIRMED | `bagi_Resep/delete_resep.php` | Dipertahankan |
| F-CON-05 | Upload foto resep | BROKEN | `bagiresep.php` | Preview lokal, tanpa upload nyata |

## 4. Admin

| ID | Fitur | Status legacy | Bukti | Keputusan Phase 1 |
| --- | --- | --- | --- | --- |
| F-ADM-01 | Dashboard | ABSENT | — | Dibangun baru |
| F-ADM-02 | Kelola pengguna | CONFIRMED (tanpa auth) | `admin/kel_user/` | Mock UI |
| F-ADM-03 | Kelola resep | CONFIRMED (tanpa auth) | `admin/kel_resep/` | Mock UI |
| F-ADM-04 | Kelola kategori | BROKEN | `inputan.php:3` | Mock UI |
| F-ADM-05 | Kelola tim | CONFIRMED (tanpa auth) | `admin/kel_tim/` | Mock UI |
| F-ADM-06 | Edit tentang | CONFIRMED (tanpa auth) | `admin/kel_tentang/` | Mock UI |
| F-ADM-07 | Kelola pesan | PARTIAL | `admin/kel_kontak/` | Mock UI, hapus diperbaiki |
| F-ADM-08 | Moderasi resep | ABSENT | hanya status toggle | Status toggle |
| F-ADM-09 | Autentikasi admin | ABSENT | 0 session check | Demo role guard |

## 5. Sistem

| ID | Fitur | Status | Bukti | Keputusan |
| --- | --- | --- | --- | --- |
| F-SYS-01 | Session login | CONFIRMED | `$_SESSION["login"]` | Diganti auth demo |
| F-SYS-02 | Status aktif/non-aktif | CONFIRMED | `status_*` 0/1 | Dipertahankan di mock |
| F-SYS-03 | Pagination | CONFIRMED | 4 per halaman | 12 per halaman |
| F-SYS-04 | Upload gambar | CONFIRMED (lemah) | `upload()` | Preview saja |
| F-SYS-05 | Pencarian SQL `LIKE` | CONFIRMED | `search.php:87` | Diganti filter mock |
| F-SYS-06 | CSRF | ABSENT | tidak ada token | Diabaikan di Phase 1, wajib Phase 2 |
| F-SYS-07 | Timestamp | ABSENT | tidak ada `created_at` | Ditambahkan di mock |
| F-SYS-08 | Soft delete | ABSENT | `DELETE` permanen | Tidak diperlukan |

## 6. Aturan bisnis yang dipertahankan

| ID | Aturan | Phase 1 |
| --- | --- | --- |
| BR-01 | `0` aktif, `1` non-aktif | Dipertahankan sebagai `status: "active" \| "inactive"` |
| BR-02 | Hanya user aktif dapat login | Dipertahankan di mock |
| BR-03 | Email unik | Divalidasi di mock |
| BR-04 | Password di-hash | Tidak relevan (demo), jangan menampilkan hash |
| BR-05 | Pencarian judul case-insensitive | Dipertahankan |
| BR-06 | Populer berdasarkan viewers | Diganti `popularity` mock yang eksplisit |
| BR-07 | Beranda 5 populer, 6 kategori, 10 resep | Dipertahankan sebagai batas tampilan |
| BR-08 | 4 resep per halaman | Diubah menjadi 12 |
| BR-09 | Upload jpg/jpeg/png max 5 MB | Divalidasi di form demo |
| BR-10 | Foto default | Dipertahankan |

## 7. Fitur yang sengaja tidak dibawa

- Rating bintang dan ulasan.
- Komentar.
- Penghitung dan metrik viewer.
- Lupa password, reset password, verifikasi email.
- Login pihak ketiga.
- Moderasi/approval workflow.
- Multi-bahasa.
- Notifikasi real-time.
- Pembayaran atau langganan.

## 8. Kebutuhan baru untuk Phase 1

| ID | Kebutuhan | Alasan |
| --- | --- | --- |
| N-01 | Indeks kategori + detail | Navigasi legacy menautkannya |
| N-02 | Detail resep | Inti produk; legacy tidak punya file |
| N-03 | Halaman kontak | Tabel pesan ada, UI tidak |
| N-04 | Resep disimpan | Tautan profil ada |
| N-05 | Daftar resep dibagikan | Tautan profil ada |
| N-06 | Dashboard admin | Area admin ada tanpa ringkasan |
| N-07 | Empty/loading/error state | Tidak ada di legacy |
| N-08 | Route guard | Admin legacy terbuka |
| N-09 | 404 dan error boundary | Tidak ada |
| N-10 | Responsif dan aksesibel | Tidak ada media query |

Semua kebutuhan baru ditandai **INFERRED** sampai dikonfirmasi pemilik produk melalui PRD dan issue.
