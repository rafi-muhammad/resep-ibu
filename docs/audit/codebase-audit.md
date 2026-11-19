# Audit Kode — Resep Ibu Legacy

| Item | Nilai |
| --- | --- |
| Tanggal audit | 18 November 2026 |
| Cakupan | Seluruh file di repositori `rafi-muhammad/resep-ibu` |
| Metode | Pembacaan kode, grep query, lint PHP 8.5, pemeriksaan aset, verifikasi Git/GitHub |
| Status repo saat audit | Remote kosong, lokal tanpa commit, seluruh file untracked |
| Lokasi arsip akhir | `legacy/` |

## Legenda status

| Label | Arti |
| --- | --- |
| **CONFIRMED** | Terbukti langsung di kode atau output perintah |
| **DOCUMENTED** | Disebut dokumentasi/kode, tetapi tidak dapat dijalankan |
| **INFERRED** | Direkonstruksi dari referensi, bukan dari implementasi utuh |
| **UNKNOWN** | Tidak ada bukti |
| **DECISION REQUIRED** | Butuh keputusan pemilik produk |

## 1. Ringkasan eksekutif

Situs legacy adalah kumpulan halaman PHP prosedural tanpa framework, tanpa router, dan tanpa lapisan data. Tidak ada commit, dokumentasi proyek, dump database, test, atau build tooling. Sebagian besar alur inti berjalan, tetapi empat halaman publik yang ditautkan dari navigasi **tidak ada di repositori**, dua file **gagal parse di PHP 8.5**, dan seluruh area admin **tanpa autentikasi**.

Temuan paling serius: SQL injection di hampir semua query yang menerima input, XSS pada output data pengguna, tidak ada CSRF, dan hash password ditampilkan di tabel admin. Situs ini tidak layak dipublikasikan tanpa penulisan ulang.

## 2. Keadaan repositori

| Pemeriksaan | Hasil | Status |
| --- | --- | --- |
| Commit lokal | Tidak ada (`main` belum punya commit) | CONFIRMED |
| Remote | `origin` → `github.com/rafi-muhammad/resep-ibu` | CONFIRMED |
| Isi remote | Kosong (0 branch, 0 commit, 0 tag, 0 release) | CONFIRMED |
| Issue/milestone | 0 / 0 | CONFIRMED |
| `AGENTS.md` | Tidak ada sebelum audit | CONFIRMED |
| `DOKUMENTASI_PROYEK_RESEPIBU.md` | Tidak ditemukan di repo maupun folder tetangga | CONFIRMED |
| `README.md`, `.gitignore` | Tidak ada | CONFIRMED |
| Dump SQL / migration | Tidak ada | CONFIRMED |
| Test | Tidak ada | CONFIRMED |
| `package.json` / `composer.json` | Tidak ada | CONFIRMED |

Karena belum ada commit, tidak ada history yang perlu dipertahankan. Baseline dibuat dari kondisi apa adanya.

## 3. Struktur dan teknologi

```text
legacy/
  admin/              6 modul admin (20 file PHP)
  bagi_Resep/         form berbagi resep + list + delete
  Functions/          koneksi DB, auth, upload, profil, password
  Homepage/           beranda
  Login_Registrasi/   login + registrasi
  Profil/             data pribadi, ubah password, logout
  ResepPopuler/       daftar resep populer
  Search/             pencarian, semua resep, file eksperimen
  style/              CSS global
  tentangkami/        halaman tentang + utilitas admin
  UserProfil/         avatar pengguna
  WebAset/            logo + ilustrasi
```

- **Bahasa:** PHP prosedural, tanpa namespace, autoload, atau Composer.
- **Database:** `mysqli`, query string langsung, tanpa prepared statement.
- **View:** HTML/CSS/JS inline dalam file PHP.
- **Auth:** session PHP (`$_SESSION["login"]`, `$_SESSION["id_user"]`).
- **CSS:** 13 file, global + duplikat per halaman.
- **JS:** hanya inline `alert`, redirect, dan CKEditor dari CDN.
- **Font:** Nunito via Google Fonts.
- **Ikon:** SVG inline + Material Icons CDN.

Jumlah file: 41 PHP, 13 CSS, 94 gambar, 12 `desktop.ini`, 1 `.DS_Store`.

## 4. Halaman dan status implementasi

| Halaman | File | Status | Bukti |
| --- | --- | --- | --- |
| Beranda | `Homepage/homepage.php` | CONFIRMED | 5 populer, 6 kategori, 10 resep |
| Pencarian | `Search/search.php` | CONFIRMED | `LIKE` judul, hanya status aktif |
| Semua resep | `Search/revisi.php` | CONFIRMED | 4 per halaman |
| Eksperimen daftar | `Search/cth.php` | CONFIRMED | Duplikat logika `revisi.php` |
| Resep populer | `ResepPopuler/resepPopuler.php` | CONFIRMED | `ORDER BY viewers DESC` |
| Login | `Login_Registrasi/login.php` | CONFIRMED | `password_verify`, status aktif |
| Registrasi | `Login_Registrasi/registrasi.php` | CONFIRMED (RUSAK) | Parse error baris 11 |
| Profil | `Profil/personalData.php` | CONFIRMED | Data + upload foto |
| Ubah password | `Profil/editPassword.php` | CONFIRMED | Verifikasi password lama |
| Logout | `Profil/logout.php` | CONFIRMED | Hapus session |
| Berbagi resep | `bagi_Resep/bagiresep.php` | CONFIRMED (RUSAK) | `INSERT` tanpa `id_user`, jumlah kolom tidak cocok |
| Daftar upload | `bagi_Resep/list_resep.php` | CONFIRMED | Tabel + hapus |
| Tentang Kami | `tentangkami/tentangkami.php` | CONFIRMED (RUSAK) | `$rowtim` undefined, gambar hilang |
| Kategori resep | — | INFERRED / MISSING | Link ke `../../PROGRES/bebas/kategori/kategori.php` |
| Detail kategori | — | INFERRED / MISSING | Link ke `detilkategori.php` |
| Detail resep | — | INFERRED / MISSING | Link ke `detailresep.php?id_resep=` |
| Hubungi kami | — | INFERRED / MISSING | Link ke `kontak.php`, tabel `kontak` ada |
| Resep disimpan | — | INFERRED / MISSING | Link ke `../../PROGRES/simpan-resep/` |
| Resep dibagikan | — | INFERRED / MISSING | Link ke `../../PROGRES/upload_resep/` |
| Dashboard admin | — | NOT PRESENT | Tidak ada |
| Lupa password | — | UI ONLY | `href="#"` |
| Login Facebook | — | UI ONLY | Tombol tanpa handler |

## 5. Modul admin

| Modul | File utama | Fungsi | Catatan |
| --- | --- | --- | --- |
| Pengguna | `admin/kel_user/kelolauser.php` | List, cari, ubah status, hapus | **Kolom password hash ditampilkan** |
| Resep | `admin/kel_resep/list_resep.php` | List, ubah status, hapus | Tidak ada create/edit; pencarian memanggil `cari()` yang mencari user |
| Kategori | `admin/kel_kategori/index.php` | List, tambah, ubah status, hapus | `inputan.php` parse error baris 3 |
| Tim | `admin/kel_tim/index.php` | List, tambah, ubah status, hapus | Upload ke path di luar repo; field tidak konsisten |
| Tentang | `admin/kel_tentang/index.php` | List, edit | Membaca `tentang`; publik membaca `tentang_desk` |
| Pesan | `admin/kel_kontak/index.php` | List, hapus | Link hapus `?id=`, handler membaca `id_k` → hapus tidak pernah bekerja |

**Tidak ada satu pun `session_start()` atau pengecekan role di folder `admin/`.**

## 6. Rekonstruksi database

Tidak ada dump SQL. Skema berikut **INFERRED** dari query.

| Tabel | Kolom yang terbukti | Catatan |
| --- | --- | --- |
| `user` | `id_user`, `nama_user`, `email_user`, `pass_user`, `jk_user`, `tgl_lhr_user`, `profil_user`, `status_user` | `INSERT` memakai 8 nilai |
| `resep` | `id_resep`, `id_user`, `judul_resep`, `foto_menu`, `tentang_resep`, `bahan_utama`, `cara_masak`, `viewers`, `status_resep` | `INSERT` legacy hanya mengirim 6 nilai → gagal |
| `kategori` | `id_kategori`, `judul`, `foto`, `status_kategori` | `INSERT` memakai 4 nilai |
| `bio_tim` | `id_tim`, `foto`, `nama`, `nim`, `status_tim` | Nama kolom tidak konsisten (`foto` vs `foto_tim`) |
| `tentang` | `deskripsi`, `foto` | Dibaca admin |
| `tentang_desk` | `foto`, `deskripsi` | Dibaca halaman publik |
| `tentang_deskripsi` | tidak diketahui | Dibaca `tentangkami/index.php` |
| `foto_tim` | `foto_tim`, `nama`, `nim` | Hanya untuk insert |
| `kontak` | `id_k`, `nama`, `email`, `deskripsi` | Tidak ada halaman publik yang menulis |

**UNKNOWN:** tipe data, panjang kolom, foreign key, index, default, auto increment, collation, dan isi data aktual. Ini blocker migrasi Phase 2.

## 7. Business rules yang terbukti

| ID | Aturan | Bukti |
| --- | --- | --- |
| BR-01 | `status_* = 0` aktif, `1` non-aktif | Filter query + komentar kode |
| BR-02 | Login hanya untuk `status_user = 0` | `login.php:12` |
| BR-03 | Email registrasi harus unik | `functions.php:29` |
| BR-04 | Password disimpan dengan `password_hash` | `functions.php:47-52` |
| BR-05 | Pencarian hanya pada judul, case-insensitive via collation | `search.php:87` |
| BR-06 | Populer = `ORDER BY viewers DESC` | `homepage.php:132`, `resepPopuler.php:106` |
| BR-07 | Beranda: 5 populer, 6 kategori, 10 resep | `homepage.php:132,181,222` |
| BR-08 | Daftar semua resep: 4 per halaman | `revisi.php:88` |
| BR-09 | Upload: ekstensi jpg/jpeg/png, maks 5 MB | `functions.php:78-96` |
| BR-10 | Foto profil default `default.jpg` | `functions.php:52` |

`viewers` **tidak pernah di-increment** di mana pun. Rating dan komentar tidak ada.

## 8. Temuan keamanan

| ID | Severity | Temuan | Bukti | Dampak |
| --- | --- | --- | --- | --- |
| SEC-01 | Critical | Tidak ada autentikasi/otorisasi admin | seluruh `admin/`, 0 `session_start` | Siapa pun dapat mengubah/menghapus data |
| SEC-02 | Critical | SQL injection pada login | `login.php:12` | Bypass login |
| SEC-03 | Critical | SQL injection pada pencarian | `search.php:87` | Ekstraksi data |
| SEC-04 | Critical | SQL injection pada delete/status | `hapus.php:5`, `ubah-status-*.php:6` | Manipulasi data via GET |
| SEC-05 | High | Password hash ditampilkan | `kelolauser.php:62` | Kebocoran kredensial |
| SEC-06 | High | XSS pada judul, nama, keyword, konten | output tanpa escape di banyak file | Eksekusi skrip |
| SEC-07 | High | Tidak ada CSRF token | semua form | Aksi atas nama korban |
| SEC-08 | High | Upload hanya validasi ekstensi | `functions.php:85` | Upload file berbahaya |
| SEC-09 | High | Kredensial DB hardcoded | 8 file, `root`/kosong | Salah konfigurasi, kebiasaan buruk |
| SEC-10 | High | Path upload keluar repositori | `admin/kel_tim/edittim.php:46` | File hilang/tidak terkontrol |
| SEC-11 | Medium | Session tanpa regenerasi setelah login | `login.php:20-21` | Session fixation |
| SEC-12 | Medium | Tidak ada validasi server-side pada registrasi | `functions.php:20-58` | Data tidak valid |
| SEC-13 | Medium | `mysqli_error` ditampilkan | beberapa file | Information disclosure |
| SEC-14 | Low | Tidak ada security header | seluruh halaman | Hardening kurang |

## 9. Kerusakan dan referensi rusak

- **89 referensi statis tidak ditemukan**, mayoritas menuju `../../PROGRES/...`, `../../Resepibu/...`, atau `http://localhost/webpro`.
- Parse error PHP 8.5:
  - `legacy/Login_Registrasi/registrasi.php:11` → `$_POST{"Daftar"}`
  - `legacy/admin/kel_kategori/inputan.php:3` → `$_POST{"upload"}`
- `bagi_Resep/bagiresep.php`:
  - Header memakai user hardcoded "Baharudin".
  - `INSERT INTO resep VALUE (...)` hanya 6 nilai, tidak menyertakan `id_user`, dan tidak cocok dengan skema.
  - Query aktif di baris 136; versi komentar di baris 203.
- `bagi_Resep/delete_resep.php` memakai `ID_Resep` (kapitalisasi berbeda).
- `admin/kel_tim/hapus.php` menjalankan `SELECT ... FROM resep` sebelum menghapus tim.
- `admin/kel_kontak/index.php` mengirim `?id=` tetapi handler membaca `id_k`.
- `tentangkami/tentangkami.php` memakai `$rowtim` yang tidak pernah didefinisikan.
- `tentangkami/tentangkami.php` menulis `<tr>` dan `<img>` di luar tabel.
- Gambar hilang: `rafi.png`, `rmt.png`, `favic.png`, `Group 36.png`, `bagi_Resep/default.jpg`.

## 10. Kualitas kode dan UI

| Aspek | Temuan |
| --- | --- |
| Duplikasi | Header/footer disalin di setiap halaman; `style.css` diduplikasi di `Search/` dan `ResepPopuler/` |
| Responsif | Tidak ada `@media` di CSS aplikasi |
| HTML | Tidak valid di beberapa halaman (tabel, tag tidak tertutup) |
| Error handling | Tidak ada; `die()`/`mysqli_error` |
| Validasi | Hanya di sisi klien dan sebagian server |
| Test | Tidak ada |
| Logging | Tidak ada |
| Aksesibilitas | Banyak `alt=""`, heading tidak hierarkis, kontras terracotta rendah |
| Performa | Gambar PNG 800×800 hingga 1,2 MB; total 38,5 MB |

## 11. Inventaris aset (ringkas)

| Kategori | Jumlah | Catatan |
| --- | --- | --- |
| Gambar total | 94 file | 45 unik, 49 duplikat, 38,5 MB |
| Logo | `Logo.png` 310×80, `Logobl.png` 154×40 | Layak dipertahankan |
| Ilustrasi | `Frame105.png` 1440×1024 | Motif auth/hero |
| Tile kategori | 7 PNG 200×200 | Minuman s/d Lainnya |
| Foto resep | 24 unik | Ukuran bervariasi, beberapa 1080×1920 |
| Avatar | 5 file | Termasuk 15 duplikat satu file 800×800 |
| Ikon | 3 SVG/PNG kecil | Belum konsisten |

Detail: `docs/audit/asset-inventory.md`.

## 12. Risiko

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Tidak ada dump DB | Data asli tidak bisa dimigrasikan | Minta dump sebelum Phase 2 |
| Lisensi foto UNKNOWN | Risiko hukum saat publikasi | Ganti/pastikan izin sebelum rilis publik |
| Scope admin mock meluas | Frontend terlambat | Batasi pada CRUD yang tercatat |
| Data mock dianggap nyata | Klaim palsu | Label demo, tanpa metrik fiktif |
| Legacy dijalankan | Kerentanan aktif | Arsip read-only, jangan deploy |
| 38,5 MB aset | Repo berat | Optimasi WebP di `M1-07` |

## 13. Rekomendasi

1. Arsipkan legacy apa adanya; jangan perbaiki.
2. Bangun frontend baru dengan data mock dan kontrak repository.
3. Hilangkan rating, komentar, viewer, lupa password, dan login Facebook.
4. Bangun halaman yang hilang sebagai **INFERRED**, dokumentasikan asumsinya.
5. Sebelum Phase 2, siapkan dump SQL dan keputusan lisensi aset.
