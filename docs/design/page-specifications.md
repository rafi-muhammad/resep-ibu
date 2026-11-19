# Spesifikasi Halaman — Resep Ibu Phase 1

Dokumen ini menjadi acuan implementasi setiap route. Semua halaman memakai `SiteHeader` dan `SiteFooter`, kecuali area admin (memakai `AdminShell`) dan halaman auth (layout split tanpa footer panjang).

## Ketentuan global

| Aspek | Aturan |
| --- | --- |
| Judul dokumen | `${Judul Halaman} · Resep Ibu` |
| Landmark | Satu `<main>`, header dan footer semantik, skip link ke konten |
| Fokus | Setelah navigasi, fokus pindah ke `h1` atau awal `<main>` |
| Scroll | Kembali ke atas saat route berubah, kecuali navigasi dengan state |
| Loading | Skeleton untuk daftar; spinner pada tombol submit |
| Error | Pesan manusiawi + tombol coba lagi; tidak menampilkan stack trace |
| Empty | Ilustrasi/ikon ringan + penjelasan + aksi keluar dari kondisi kosong |
| Responsif | 390, 768, 1024, 1440 px tanpa overflow horizontal |
| Bahasa | Indonesia, nada hangat dan langsung |
| Data | Hanya lewat repository; tidak ada fixture di komponen |

---

## 1. Beranda — `/`

**Tujuan:** memperkenalkan Resep Ibu dan mengantar ke pencarian atau kategori.

**Section**
1. Hero dua kolom: teks (eyebrow, H1, lead, search) + foto besar. Di mobile foto di atas atau di belakang teks dengan scrim.
2. Statistik ringkas: jumlah resep dan kategori dari data.
3. Resep populer: 5 kartu + tautan "Lihat semua".
4. Kategori: 7 tile + jumlah resep.
5. Resep terbaru: 6 kartu + tautan "Semua resep".
6. CTA berbagi resep dengan latar brown.

**Data:** `getHomeData()` → `{ stats, popular, categories, latest }`.

**Interaksi:** submit pencarian menuju `/resep?q=...`; klik kartu ke detail; klik tile ke kategori.

**State:** skeleton untuk tiga daftar; jika salah satu gagal, tampilkan blok error lokal, bukan seluruh halaman.

**A11y:** H1 tunggal; foto hero punya alt deskriptif; form pencarian memiliki label visual tersembunyi.

**AC:** angka statistik sama dengan jumlah fixture; tidak ada teks "5.000 resep" atau klaim lain tanpa data.

---

## 2. Semua resep — `/resep`

**Tujuan:** menelusuri, mencari, dan memfilter seluruh resep.

**Layout**
- Page header: H1 "Semua resep", jumlah hasil.
- Toolbar: search (debounce 300 ms), select kategori, select urutan (Terbaru, Populer, A–Z), tombol reset.
- Grid 12 kartu per halaman.
- Pagination: prev, nomor, next; maksimal 5 nomor dengan elipsis.

**URL state:** `q`, `kategori`, `urutan`, `halaman`. Semua perubahan memakai `replace`/`push` yang konsisten agar back/forward bekerja.

**Data:** `listRecipes({ q, category, sort, page, perPage: 12 })` → `{ items, total, page, totalPages }`.

**State:** skeleton 6 kartu saat memuat; empty state "Belum ada resep yang cocok" + reset; error dengan retry.

**Edge case:** `q` kosong atau spasi diabaikan; kategori tidak dikenal → anggap semua; halaman di luar rentang → arahkan ke halaman terakhir.

**AC:** reload mempertahankan filter; pencarian case-insensitive; hasil hanya resep aktif.

---

## 3. Resep populer — `/resep/populer`

**Tujuan:** menampilkan resep dengan `popularity` tertinggi.

**Isi:** H1, lead singkat, grid 10 kartu, tautan ke semua resep.

**Data:** `listRecipes({ sort: "populer", perPage: 10 })`.

**Catatan:** tidak menampilkan angka viewer atau label "paling banyak dilihat" karena tidak ada data kunjungan nyata. Gunakan "Pilihan populer" sebagai judul.

**AC:** urutan stabil; tidak ada duplikat; kartu sama dengan komponen `RecipeCard`.

---

## 4. Detail resep — `/resep/:slug`

**Tujuan:** menyajikan resep lengkap dan mendorong pengguna menyimpan atau membagikan.

**Layout**
1. Breadcrumb: Beranda / Kategori / Judul.
2. Header: badge kategori, H1, penulis + tanggal, aksi simpan dan salin tautan.
3. Foto utama 4:3.
4. Ringkasan dan cerita singkat.
5. Meta: waktu persiapan, waktu masak, total, porsi, kesulitan.
6. Bahan: grup (mis. "Bumbu halus") dengan daftar.
7. Langkah: `<ol>` bernomor, satu langkah per item.
8. Resep terkait: 3 kartu dari kategori sama.

**Interaksi**
- Simpan: jika belum login → `/masuk?returnTo=/resep/:slug`; jika sudah → toggle dan toast.
- Salin tautan: `navigator.clipboard` dengan fallback dan toast.
- Kategori membuka `/kategori/:slug`.

**State:** skeleton header + foto; slug tidak ditemukan → halaman 404.

**A11y:** bahan dan langkah memakai list semantik; tombol simpan punya `aria-pressed`; foto utama alt deskriptif.

**AC:** tidak ada rating, komentar, atau jumlah viewer; semua field dirender dari tipe `Recipe`.

---

## 5. Indeks kategori — `/kategori`

**Tujuan:** membantu pengguna memilih jenis masakan.

**Isi:** H1 "Kategori", lead, grid 7 tile (foto, nama, jumlah resep), tautan ke detail.

**Data:** `listCategories()` dengan `recipeCount` terhitung.

**State:** skeleton 7 tile; error retry.

**AC:** jumlah pada tile sama dengan jumlah resep aktif kategori tersebut.

---

## 6. Detail kategori — `/kategori/:slug`

**Tujuan:** menampilkan semua resep dalam satu kategori.

**Isi:** hero ringkas (foto kategori + nama + deskripsi + jumlah), grid resep, pagination 12, tautan kembali ke indeks.

**Edge case:** slug tidak dikenal → 404; kategori kosong → empty state + tautan ke semua resep.

**AC:** filter kategori konsisten dengan `/resep?kategori=`.

---

## 7. Tentang Kami — `/tentang`

**Tujuan:** menjelaskan misi dan orang di balik Resep Ibu.

**Section**
1. H1 + paragraf pembuka.
2. Cerita proyek (2–3 paragraf, tanpa klaim yang tidak terbukti).
3. Nilai: 3 kartu (mis. "Resep yang bisa diikuti", "Bahan sehari-hari", "Ditulis dengan jujur").
4. Tim: 3 kartu placeholder netral (foto inisial/ilustrasi, nama peran, deskripsi singkat).
5. CTA ke `/kontak`.

**Catatan:** tidak ada alamat, nomor telepon, atau nama orang yang belum dikonfirmasi. Data tim berasal dari mock dan ditandai placeholder di admin.

**AC:** tidak ada gambar rusak; tautan kontak bekerja.

---

## 8. Kontak — `/kontak`

**Tujuan:** memberi kanal pesan tanpa memublikasikan PII yang tidak terverifikasi.

**Layout:** dua kolom. Kiri form; kanan penjelasan singkat ("Pesan masuk ke kotak masuk pengelola") dan tautan ke Tentang.

**Field:** nama (2–80), email (format valid), subjek (4–120), pesan (20–2000), checkbox persetujuan.

**Validasi:** inline saat blur dan submit; ringkasan error di atas form; fokus ke field pertama yang salah.

**Submit:** simpan ke repository mock, tampilkan sukses menggantikan form, sertakan tombol "Kirim pesan lain".

**Catatan:** tidak mengklaim pengiriman email nyata. Tidak ada peta, alamat, atau nomor telepon.

**AC:** pesan muncul di `/admin/pesan`; submit ganda dicegah; data bertahan setelah reload.

---

## 9. Login — `/masuk`

**Tujuan:** masuk ke akun demo.

**Layout:** split. Kiri panel brand dengan logo, kalimat singkat, dan motif mangkuk; kanan kartu form (maks 440 px).

**Field:** email, password dengan tombol tampil/sembunyikan.

**Aksi:** masuk, tautan ke `/daftar`. Tidak ada "lupa password" atau login pihak ketiga.

**Demo:** kotak informasi berisi akun admin dan user, dengan tombol "Isi otomatis" per akun.

**State:** error kredensial sebagai alert; tombol loading; `returnTo` dihormati.

**AC:** kredensial salah tidak membocorkan apakah email terdaftar; sukses mengarah ke tujuan atau `/profil`.

---

## 10. Registrasi — `/daftar`

**Tujuan:** membuat akun demo.

**Field:** nama, email, password, konfirmasi password, checkbox setuju.

**Validasi:** nama 2–80; email valid dan belum dipakai; password minimal 8 karakter; konfirmasi sama.

**State:** error per field; loading; sukses otomatis login dan menuju `/profil`.

**AC:** email duplikat ditolak dengan pesan jelas; setelah registrasi, user muncul di admin.

---

## 11. Profil — data pribadi — `/profil`

**Layout:** sidebar akun (Data pribadi, Keamanan, Resep saya, Disimpan) + panel form.

**Field:** nama, email (read-only atau dapat diubah dengan validasi), bio (maks 300), avatar (pilihan preset, bukan upload nyata).

**Aksi:** simpan; reset ke nilai awal; toast sukses.

**AC:** perubahan bertahan setelah reload; email tetap unik; tidak ada hash password di UI.

---

## 12. Profil — keamanan — `/profil/keamanan`

**Field:** password saat ini, password baru, konfirmasi.

**Validasi:** password saat ini harus cocok; password baru minimal 8 karakter dan berbeda; konfirmasi sama.

**State:** error inline; sukses menampilkan toast dan mengosongkan form.

**AC:** password lama salah ditolak; sesi tetap aktif setelah perubahan.

---

## 13. Profil — resep saya — `/profil/resep`

**Isi:** daftar resep milik user (kartu ringkas atau tabel), status (Aktif/Non-aktif), tanggal, aksi lihat dan hapus.

**State:** empty state dengan CTA `/bagikan`; dialog konfirmasi hapus.

**AC:** resep baru dari form muncul di sini; hapus menghilangkan dari daftar publik dan tersimpan.

---

## 14. Profil — resep disimpan — `/profil/disimpan`

**Isi:** grid `RecipeCard` dengan tombol lepas simpan.

**State:** empty state + tautan ke `/resep`.

**AC:** simpan/lepas konsisten dengan tombol di detail; data bertahan setelah reload.

---

## 15. Berbagi resep — `/bagikan`

**Tujuan:** mengumpulkan resep dari pengguna.

**Section form**
1. Informasi dasar: judul, kategori, ringkasan.
2. Detail: waktu persiapan, waktu masak, porsi, kesulitan.
3. Bahan: repeater baris teks + tombol tambah/hapus; minimal 3.
4. Langkah: repeater textarea + nomor urut; minimal 2.
5. Foto: input file dengan preview lokal, validasi tipe dan ukuran; tanpa upload server.
6. Cerita (opsional).
7. Tombol simpan dan batal.

**Validasi:** wajib pada judul, kategori, ringkasan, minimal bahan/langkah; pesan per field.

**Submit:** membuat resep dengan status aktif, penulis user saat ini; redirect ke `/profil/resep` + toast.

**Catatan:** tidak ada editor HTML. Bahan dan langkah disimpan sebagai array.

**AC:** resep muncul di publik setelah submit; tidak ada data hilang saat validasi gagal.

---

## 16. Admin — dashboard — `/admin`

**Isi:** 4 kartu statistik (resep, kategori, pengguna, pesan belum dibaca), 5 pesan terbaru, 5 resep terbaru, pintasan aksi.

**Data:** `getAdminSummary()`.

**AC:** angka sesuai store; klik kartu menuju daftar terkait; tidak ada grafik dekoratif tanpa data.

---

## 17. Admin — resep — `/admin/resep`

**Isi:** toolbar (search, filter status, kategori), tabel: judul, kategori, penulis, status, tanggal, aksi (lihat, ubah status, hapus).

**Interaksi:** konfirmasi untuk hapus dan ubah status; hasil langsung tercermin di publik.

**Mobile:** daftar kartu, bukan tabel sempit.

**AC:** pencarian dan filter bekerja; tidak ada aksi tanpa umpan balik.

---

## 18. Admin — kategori — `/admin/kategori`

**Isi:** tabel kategori (nama, slug, jumlah resep, status, aksi), tombol tambah.

**Form:** dialog/panel dengan nama, deskripsi, gambar (pilih dari aset), status.

**Aturan:** kategori dengan resep tidak dapat dihapus; slug unik.

**AC:** perubahan nama tampil di navigasi dan halaman kategori.

---

## 19. Admin — pengguna — `/admin/pengguna`

**Isi:** tabel pengguna (nama, email, peran, status, tanggal bergabung), pencarian, filter status, aksi ubah status dan lihat detail.

**Larangan:** jangan pernah menampilkan password atau hash.

**AC:** admin tidak dapat menonaktifkan akunnya sendiri; status non-aktif mencegah login.

---

## 20. Admin — pesan — `/admin/pesan`

**Isi:** daftar pesan (pengirim, subjek, tanggal, status baca) + panel detail.

**Aksi:** tandai dibaca/belum, hapus dengan konfirmasi, tautan mailto opsional (jika email valid).

**AC:** status baca bertahan; pesan baru dari `/kontak` muncul paling atas.

---

## 21. Admin — tentang dan tim — `/admin/tentang`

**Isi:** form teks tentang (judul, cerita, nilai) + daftar anggota tim (nama peran, deskripsi, urutan, status).

**Aksi:** simpan, tambah anggota, edit, hapus dengan konfirmasi.

**AC:** perubahan tampil di `/tentang`; validasi mencegah daftar kosong pada bagian wajib.

---

## 22. Halaman 404 dan error

**404:** kode besar, pesan "Halaman yang kamu cari tidak ada", tautan ke beranda dan pencarian.

**Error boundary:** pesan tenang, tombol "Muat ulang" dan "Kembali ke beranda"; detail error hanya di console saat development.

**AC:** tidak ada layar putih; fokus berada pada heading saat halaman dirender.
