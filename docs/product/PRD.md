# Product Requirements Document — Resep Ibu Phase 1

| Item | Nilai |
| --- | --- |
| Versi | 1.0 |
| Tanggal | 19 November 2026 |
| Fase | Phase 1 — Frontend First |
| Status | Disetujui untuk implementasi setelah issue dibuat |
| Pemilik produk | Rafi Muhammad |

## 1. Ringkasan

Resep Ibu adalah situs resep masakan rumahan Indonesia. Phase 1 membangun ulang seluruh pengalaman publik, akun, dan admin sebagai aplikasi React dengan data mock, tanpa backend. Tujuannya: menyelesaikan desain dan interaksi lebih dulu, mendapatkan persetujuan visual, lalu menghubungkannya ke Laravel di Phase 2 tanpa menulis ulang halaman.

## 2. Latar belakang

Situs legacy adalah kumpulan halaman PHP tanpa autentikasi admin, tanpa test, dan dengan empat halaman publik yang ditautkan tetapi tidak ada. Tidak ada dump database. Detail bukti ada di `docs/audit/codebase-audit.md`.

Karena itu Phase 1 tidak mencoba memperbaiki legacy. Legacy diarsipkan, dan produk dibangun ulang dengan struktur yang bisa diuji.

## 3. Tujuan

1. Pengguna menemukan resep yang relevan dalam kurang dari satu menit.
2. Resep terbaca jelas: bahan, langkah, porsi, waktu, penulis, kategori, foto.
3. Kontributor dapat membagikan resep lewat alur yang tidak membingungkan.
4. Admin dapat mengelola resep, kategori, pengguna, pesan, dan konten statis.
5. Identitas hangat dan "buatan rumah" tetap terasa.
6. Arsitektur siap diganti ke API Laravel tanpa mengubah halaman.

## 4. Non-goals Phase 1

- Backend, API, database, atau autentikasi nyata.
- Upload file ke server.
- Rating, komentar, penghitung viewer, dan analitik.
- Lupa password, verifikasi email, login pihak ketiga.
- Pembayaran, langganan, iklan.
- Multi-bahasa, dark mode, PWA, SSR.
- Moderasi dan workflow persetujuan.
- SEO server-side (hanya title/meta dasar per halaman).

## 5. Pengguna

| Persona | Kebutuhan | Konteks |
| --- | --- | --- |
| Pencari resep | Cari cepat, bahan jelas, nyaman di ponsel | Membuka saat akan memasak |
| Kontributor | Form sederhana, preview foto, tahu status resep | Ingin membagikan resep keluarga |
| Admin | Tabel konten, status, pesan yang mudah dikelola | Mengurus situs dari desktop |
| Pemula | Kategori jelas, resep tidak rumit | Baru mulai memasak |

## 6. User stories

| ID | Story |
| --- | --- |
| US-01 | Sebagai pencari resep, saya ingin mencari berdasarkan judul agar cepat menemukan masakan. |
| US-02 | Sebagai pencari resep, saya ingin memfilter kategori dan urutan agar hasil relevan. |
| US-03 | Sebagai pencari resep, saya ingin melihat bahan dan langkah dalam satu halaman. |
| US-04 | Sebagai pengguna, saya ingin menyimpan resep agar mudah ditemukan lagi. |
| US-05 | Sebagai kontributor, saya ingin membagikan resep dengan foto dan langkah yang rapi. |
| US-06 | Sebagai pengguna, saya ingin mengubah profil dan password saya. |
| US-07 | Sebagai admin, saya ingin melihat ringkasan konten dan pesan terbaru. |
| US-08 | Sebagai admin, saya ingin mengubah status dan menghapus konten dengan konfirmasi. |
| US-09 | Sebagai pengunjung, saya ingin menghubungi pengelola lewat form. |
| US-10 | Sebagai pengunjung, saya ingin tahu siapa di balik Resep Ibu. |

## 7. Sitemap

| Route | Halaman | Akses |
| --- | --- | --- |
| `/` | Beranda | Publik |
| `/resep` | Semua resep + search + filter | Publik |
| `/resep/populer` | Resep populer | Publik |
| `/resep/:slug` | Detail resep | Publik |
| `/kategori` | Indeks kategori | Publik |
| `/kategori/:slug` | Resep per kategori | Publik |
| `/tentang` | Tentang Kami | Publik |
| `/kontak` | Kontak | Publik |
| `/masuk` | Login | Publik |
| `/daftar` | Registrasi | Publik |
| `/profil` | Data pribadi | Login |
| `/profil/keamanan` | Ubah password | Login |
| `/profil/resep` | Resep yang dibagikan | Login |
| `/profil/disimpan` | Resep disimpan | Login |
| `/bagikan` | Berbagi resep | Login |
| `/admin` | Dashboard | Admin |
| `/admin/resep` | Kelola resep | Admin |
| `/admin/kategori` | Kelola kategori | Admin |
| `/admin/pengguna` | Kelola pengguna | Admin |
| `/admin/pesan` | Pesan kontak | Admin |
| `/admin/tentang` | Tentang dan tim | Admin |
| `*` | 404 | Publik |

Pencarian bukan halaman terpisah; ia adalah state dari `/resep?q=`.

## 8. Functional requirements

### 8.1 Publik

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-PUB-01 | Beranda menampilkan hero, pencarian, statistik dari data mock, 5 resep populer, 7 kategori, dan 6 resep terbaru | Angka statistik dihitung dari fixture; klik kartu membuka detail; tidak ada angka karangan |
| FR-PUB-02 | `/resep` mendukung `q`, `kategori`, `urutan`, `halaman` di URL | Reload dan back/forward mempertahankan state; hasil case-insensitive; empty state muncul |
| FR-PUB-03 | Detail resep menampilkan foto, judul, penulis, kategori, tanggal, ringkasan, waktu, porsi, kesulitan, bahan, dan langkah | Semua field berasal dari tipe `Recipe`; bahan dan langkah berupa array; tidak ada rating/viewer |
| FR-PUB-04 | `/resep/populer` menampilkan 10 resep dengan `popularity` tertinggi | Urutan stabil; hanya resep aktif |
| FR-PUB-05 | `/kategori` menampilkan 7 kategori dengan jumlah resep | Jumlah dihitung dari fixture; klik menuju detail |
| FR-PUB-06 | `/kategori/:slug` menampilkan header kategori dan grid resep terfilter | Slug tidak dikenal menampilkan 404 |
| FR-PUB-07 | `/tentang` menampilkan cerita, nilai, dan tim placeholder | Tidak ada nama orang atau klaim yang tidak dikonfirmasi |
| FR-PUB-08 | `/kontak` menampilkan form nama, email, subjek, pesan | Validasi inline; sukses masuk ke inbox mock; tidak ada pengiriman nyata |
| FR-PUB-09 | Halaman 404 dan error boundary tersedia | Navigasi kembali bekerja; tidak ada layar kosong |

### 8.2 Akun

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-ACC-01 | Login dengan email dan password demo | Kredensial salah menampilkan error; sukses menyimpan sesi dan kembali ke tujuan |
| FR-ACC-02 | Registrasi nama, email, password, konfirmasi | Email duplikat ditolak; password minimal 8 karakter; sukses login otomatis |
| FR-ACC-03 | Logout menghapus sesi demo | Route terproteksi langsung redirect ke `/masuk` |
| FR-ACC-04 | Profil menampilkan dan mengubah nama, bio, email | Perubahan bertahan setelah reload |
| FR-ACC-05 | Ubah password memverifikasi password lama | Password lama salah ditolak; sukses menampilkan toast |
| FR-ACC-06 | Route `/profil/*` dan `/admin/*` dijaga role | User biasa tidak bisa membuka admin; admin bisa membuka keduanya |

### 8.3 Kontribusi

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-CON-01 | Form berbagi resep: judul, kategori, ringkasan, bahan, langkah, waktu, porsi, foto | Validasi lengkap; preview foto lokal; submit menambah resep ke store |
| FR-CON-02 | `/profil/resep` menampilkan resep milik user | Resep baru muncul; status terlihat |
| FR-CON-03 | `/profil/disimpan` menampilkan resep yang disimpan | Tombol simpan/lepas bekerja dan bertahan |
| FR-CON-04 | User dapat menghapus resep miliknya dengan konfirmasi | Dialog muncul; data terhapus dari store |

### 8.4 Admin

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-ADM-01 | Dashboard menampilkan jumlah resep, kategori, pengguna, pesan, dan 5 pesan terbaru | Angka dari store; tidak ada grafik palsu |
| FR-ADM-02 | Kelola resep: tabel, cari, filter status, ubah status, hapus, lihat | Aksi memakai dialog konfirmasi; perubahan langsung terlihat |
| FR-ADM-03 | Kelola kategori: tabel, tambah, edit, ubah status, hapus | Kategori yang masih dipakai tidak bisa dihapus |
| FR-ADM-04 | Kelola pengguna: tabel, cari, ubah status, lihat detail | Tidak ada kolom password/hash |
| FR-ADM-05 | Kelola pesan: tabel, baca, tandai sudah dibaca, hapus | Status baca bertahan |
| FR-ADM-06 | Kelola tentang dan tim: edit teks, tambah/ubah/hapus anggota | Perubahan tampil di `/tentang` |

### 8.5 Sistem

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-SYS-01 | Semua data melalui repository dengan adapter mock | Tidak ada komponen yang mengimpor fixture langsung |
| FR-SYS-02 | Perubahan demo bertahan di `localStorage` | Reload tidak menghilangkan resep/pesan/profil |
| FR-SYS-03 | Toast untuk sukses dan gagal | Muncul sekali, bisa ditutup, auto-dismiss |
| FR-SYS-04 | Loading, empty, dan error state untuk setiap daftar | Skeleton saat memuat; pesan jelas saat kosong/gagal |
| FR-SYS-05 | Layout responsif 390/768/1024/1440 | Tidak ada overflow horizontal; navigasi mobile berfungsi |

## 9. Non-functional requirements

| Area | Requirement |
| --- | --- |
| Performa | LCP < 2,5 s pada koneksi cepat; bundle awal < 250 KB gzip; gambar WebP |
| Aksesibilitas | WCAG 2.1 AA; fokus terlihat; label eksplisit; kontras minimal 4,5:1 |
| Responsif | 390, 768, 1024, 1440 px |
| Browser | Dua versi terakhir Chrome, Edge, Firefox, Safari |
| Type safety | TypeScript strict, tanpa `any` yang tidak beralasan |
| Kualitas | `typecheck`, `lint`, `test`, `build` lulus tanpa error |
| Keandalan | Tidak ada error console; tidak ada link mati |
| Privasi | Tanpa PII nyata; data demo diberi label |
| Maintainability | Satu komponen satu tanggung jawab; tidak ada duplikasi |

## 10. Alur pengguna

1. **Temukan resep:** Beranda → cari/kategori → daftar → detail → bahan/langkah.
2. **Telusuri kategori:** Beranda → kategori → detail kategori → detail resep.
3. **Daftar:** `/daftar` → validasi → akun demo → sesi → profil.
4. **Masuk:** `/masuk` → kredensial → kembali ke halaman tujuan.
5. **Bagikan resep:** login → `/bagikan` → isi form → preview → submit → `/profil/resep`.
6. **Simpan resep:** detail → tombol simpan → `/profil/disimpan`.
7. **Kelola profil:** `/profil` → ubah data → simpan; `/profil/keamanan` → ganti password.
8. **Admin:** login admin → dashboard → aksi tabel → konfirmasi → perubahan tercermin di publik.
9. **Kontak:** `/kontak` → validasi → sukses → pesan muncul di admin.

## 11. Model konten

```ts
type Recipe = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  story: string;
  categoryId: string;
  authorId: string;
  image: string;          // path aset
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  difficulty: "mudah" | "sedang" | "sulit";
  ingredients: IngredientGroup[];
  steps: string[];
  status: "active" | "inactive" | "draft";
  popularity: number;
  publishedAt: string;    // ISO date
};

type IngredientGroup = {
  title?: string;
  items: string[];
};
```

Keputusan: bahan dan langkah berupa array terstruktur, bukan HTML. Ini memudahkan pencarian, aksesibilitas, dan migrasi ke Laravel.

## 12. Data mock

| Entitas | Jumlah | Catatan |
| --- | --- | --- |
| Resep | 24 | Tersebar di 7 kategori, cukup untuk menguji pagination |
| Kategori | 7 | Minuman, Makanan Penutup, Makanan Berkuah, Makanan Pedas, Makanan Sehat, Olahan Buah, Lainnya |
| Pengguna | 4 | 1 admin, 1 kontributor, 2 pembaca |
| Pesan kontak | 6 | Status baca bervariasi |
| Anggota tim | 3 | Placeholder netral |

Akun demo:

| Peran | Email | Password |
| --- | --- | --- |
| Admin | `admin@resepibu.test` | `resepibu123` |
| User | `dapur@resepibu.test` | `resepibu123` |

Data demo ditandai di UI (mis. catatan di halaman login) dan tidak boleh diklaim sebagai data nyata.

## 13. Kriteria keberhasilan

- Pengguna dapat menyelesaikan pencarian → detail tanpa bantuan.
- Semua alur di bagian 10 berfungsi dengan data mock.
- Tidak ada halaman atau tombol yang mengarah ke fitur tidak ada.
- Review visual disetujui pemilik produk.
- Tidak ada temuan aksesibilitas kritis.
- Build dan test lulus.

## 14. Risiko

| Risiko | Mitigasi |
| --- | --- |
| Data mock dianggap nyata | Label demo, tanpa metrik fiktif |
| Scope admin meluas | Batasi pada FR-ADM-01..06 |
| Aset besar | Optimasi WebP, ukuran target |
| Lisensi foto | Demo internal, keputusan publikasi terpisah |
| Integrasi Laravel berbeda | Kontrak repository dan tipe domain |

## 15. Definisi rilis Phase 1

Phase 1 dinyatakan selesai jika:

1. Seluruh issue M0–M5 berstatus selesai.
2. Semua acceptance criteria terpenuhi.
3. `npm run build`, `typecheck`, `lint`, dan `test` lulus.
4. E2E alur kritis lulus.
5. Review responsif dan aksesibilitas selesai.
6. Pemilik produk menyetujui hasil visual.
7. `docs/project/issue-traceability.md` memperbarui status.
