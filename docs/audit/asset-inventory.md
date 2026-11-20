# Inventaris Aset — Resep Ibu

| Item | Nilai |
| --- | --- |
| Tanggal | 18 November 2026 |
| Lokasi | `legacy/` |
| Total file gambar | 94 |
| Gambar unik (SHA-256) | 45 |
| File duplikat berlebih | 49 |
| Total ukuran gambar | 38,5 MB |
| Total repositori legacy | 38,7 MB |

## 1. Ringkasan per kategori

| Kategori | File unik | Catatan |
| --- | --- | --- |
| Logo dan wordmark | 4 | `Logo.png`, `Logobl.png`, `logobk.png` |
| Ilustrasi | 2 | `Frame105.png`, `profil.jpg` |
| Tile kategori | 7 | PNG 200×200 |
| Foto resep | 22 | Resolusi dan rasio tidak seragam |
| Avatar pengguna | 5 | Termasuk `default.jpg` |
| Ikon/UI | 5 | SVG dan PNG kecil |
| **Total** | **45** | |

## 2. Logo dan identitas

| File | Dimensi | Ukuran | Duplikat | Catatan |
| --- | --- | --- | --- | --- |
| `legacy/WebAset/Logo.png` | 310×80 | 4 KB | ×5 | Logo utama, latar transparan |
| `legacy/WebAset/Logobl.png` | 154×40 | 2 KB | ×2 | Varian kecil untuk header |
| `legacy/admin/kel_kategori/logobk.png` | 308×80 | 4 KB | ×1 | Varian admin |
| `legacy/WebAset/Frame105.png` | 1440×1024 | 30 KB | ×1 | Ilustrasi mangkuk, latar auth |

Logo menampilkan ikon topi koki dan wordmark "ResepIbu". **Pertahankan** sebagai identitas.

## 3. Tile kategori

Semua 200×200 PNG, disimpan di `legacy/Homepage/img/`.

| File | Ukuran | Kategori |
| --- | --- | --- |
| `1. Minuman.png` | 77 KB | Minuman |
| `2. Makanan penutup.png` | 40 KB | Makanan Penutup |
| `3. Makanan berkuah.png` | 88 KB | Makanan Berkuah |
| `4. Makanan Pedas.png` | 107 KB | Makanan Pedas |
| `5. Makanan Sehat.png` | 101 KB | Makanan Sehat |
| `6. Olohan Buah.png` | 42 KB | Olahan Buah (nama file salah eja) |
| `7. Lainnya.png` | 1 KB (74×74) | Lainnya |

Tujuh tile ini menjadi dasar struktur kategori Phase 1.

## 4. Foto resep dan kategori

Foto tersebar di `legacy/admin/kel_resep/img/`, `legacy/admin/kel_kategori/gambar/`, dan `legacy/bagi_Resep/img/`. Banyak yang identik.

| File (representatif) | Dimensi | Ukuran | Duplikat |
| --- | --- | --- | --- |
| `kel_kategori/gambar/63bc324e5b66c.png` | 800×800 | 945 KB | ×5 |
| `kel_kategori/gambar/63bc36e46b9b6.png` | 800×800 | 1200 KB | ×2 |
| `kel_kategori/gambar/63bc37126b700.png` | 800×800 | 1112 KB | ×2 |
| `kel_kategori/gambar/63bc3751e3d3a.png` | 800×800 | 1250 KB | ×1 |
| `kel_kategori/gambar/63bc377d3ab8e.png` | 800×800 | 425 KB | ×1 |
| `kel_kategori/gambar/63bc37980b3a6.png` | 800×800 | 473 KB | ×1 |
| `kel_kategori/gambar/63bc37b94a70e.png` | 800×800 | 1018 KB | ×3 |
| `kel_kategori/gambar/63bdb0ac93b10.jpg` | 750×500 | 61 KB | ×2 |
| `kel_kategori/gambar/63c1aa0c66f46.jpg` | 673×373 | 45 KB | ×10 |
| `kel_kategori/gambar/63c2b1a7dae85.jpeg` | 550×320 | 82 KB | ×2 |
| `kel_resep/img/63a5d18a1ad4c.jpeg` | 281×179 | 11 KB | ×2 |
| `kel_resep/img/63a9c6b523ccc.jpeg` | 200×100 | 6 KB | ×3 |
| `kel_resep/img/63aa9026d0788.jpeg` | 259×194 | 13 KB | ×4 |
| `kel_resep/img/63b546a3a8685.jpeg` | 700×525 | 100 KB | ×2 |
| `kel_resep/img/63b548353db73.jpg` | 680×482 | 50 KB | ×1 |
| `kel_resep/img/63b5c702b60cb.png` | 1080×1920 | 423 KB | ×2 |
| `kel_resep/img/63bd5f5c0f471.jpg` | 620×620 | 44 KB | ×1 |
| `kel_resep/img/63bd67259cbac.jpg` | 780×440 | 61 KB | ×1 |
| `kel_resep/img/63bd6cdb62bb6.jpg` | 639×395 | 26 KB | ×2 |
| `kel_resep/img/63bd8815b1b3a.jpeg` | 700×525 | 132 KB | ×1 |
| `kel_resep/img/63be384946884.jpg` | 1080×1350 | 180 KB | ×1 |
| `kel_resep/img/63be39005599a.jpeg` | 225×225 | 6 KB | ×1 |
| `kel_resep/img/63be3997f27b0.jpg` | 656×432 | 55 KB | ×1 |
| `bagi_Resep/img/63ba837a98a7f.jpg` | 3000×2000 | 1139 KB | ×1 |

Foto ini tidak memiliki metadata judul, penulis, atau lisensi. Tidak dapat dipastikan mana yang cocok untuk resep tertentu tanpa data database asli.

## 5. Avatar

| File | Dimensi | Ukuran | Duplikat |
| --- | --- | --- | --- |
| `legacy/UserProfil/63bcc56c47f24.png` | 800×800 | 1124 KB | ×15 |
| `legacy/UserProfil/63be6e8185349.jpeg` | 898×1600 | 174 KB | ×1 |
| `legacy/UserProfil/63be6e949de38.png` | 301×323 | 55 KB | ×1 |
| `legacy/UserProfil/default.jpg` | 380×380 | 20 KB | ×1 |
| `legacy/Homepage/asset/profil.jpg` | 2139×2139 | 1026 KB | ×3 |

## 6. Ikon dan gambar UI

| File | Dimensi | Catatan |
| --- | --- | --- |
| `legacy/Homepage/img/Bintang.png` | 24×24 | Ikon bintang, tidak dipakai untuk rating |
| `legacy/Homepage/img/fotoResep.png` | 216×174 | Placeholder foto |
| `legacy/Homepage/img/Makanan.png` | 718×359 | Foto contoh |
| `legacy/Homepage/img/search-loupe.svg` | SVG | Ikon pencarian |
| `legacy/Homepage/img/Star.svg` | SVG | Ikon bintang |

## 7. Aset yang hilang

| Referensi | Dipakai di | Status |
| --- | --- | --- |
| `rafi.png` | `tentangkami.php` | Tidak ada |
| `rmt.png` | `tentangkami.php` | Tidak ada |
| `favic.png` | `tentangkami.php` | Tidak ada |
| `Group 36.png` | `bagi_Resep/bagiresep.php` | Tidak ada |
| `bagi_Resep/default.jpg` | form upload | Tidak ada |
| `tentangkami/Logo.png`, `logobk.png` | halaman tentang | Tidak ada di folder |

## 8. Lisensi

**Status: UNKNOWN.**

- Tidak ada file LICENSE, keterangan sumber, atau atribusi.
- Foto tampak seperti unggahan pengguna dan tersebar dalam struktur folder admin.
- Sebagian foto beresolusi rendah atau hasil kompresi ulang.

**Keputusan (19 November 2026):** Phase 1 memakai foto legacy saja, dioptimasi ke WebP, untuk demo lokal. Publikasi publik menunggu konfirmasi hak pakai.

## 9. Pipeline aset (M1-08, issue #9)

Status: **DOCUMENTED** — implementasi selesai 20 November 2026.

```text
legacy/…                      →  frontend/public/media/
  WebAset/Logo.png             →  brand/logo.png
  WebAset/Logobl.png           →  brand/logo-small.png
  WebAset/Frame105.png         →  brand/bowl-motif.webp
  Homepage/img/1..7            →  categories/<slug>.webp (400×400)
  foto legacy terpilih         →  recipes/<slug>.webp (1200×900)
  UserProfil/default.jpg       →  avatars/default.webp (256×256)
```

Skrip: `frontend/scripts/optimize-assets.py` (Pillow). Idempoten, tidak menyentuh
`legacy/`, menurunkan kualitas WebP otomatis sampai batas ukuran terpenuhi.

**Total hasil:** 38 berkas, 2,4 MB (legacy 38,5 MB).

### 9.1 Brand

| Aset | Sumber | Ukuran | Alt |
| --- | --- | --- | --- |
| `/media/brand/logo.png` | `WebAset/Logo.png` | 4,7 KB | Logo Resep Ibu |
| `/media/brand/logo-small.png` | `WebAset/Logobl.png` | 2,5 KB | Logo Resep Ibu versi kecil |
| `/media/brand/bowl-motif.webp` | `WebAset/Frame105.png` | 17,9 KB | Dekoratif; pakai `alt=""` |

### 9.2 Kategori (400×400)

| Aset | Sumber | Ukuran | Alt |
| --- | --- | --- | --- |
| `/media/categories/minuman.webp` | `Homepage/img/1. Minuman.png` | 22,2 KB | Ilustrasi kategori Minuman |
| `/media/categories/makanan-penutup.webp` | `Homepage/img/2. Makanan penutup.png` | 12,1 KB | Ilustrasi kategori Makanan Penutup |
| `/media/categories/makanan-berkuah.webp` | `Homepage/img/3. Makanan berkuah.png` | 27,2 KB | Ilustrasi kategori Makanan Berkuah |
| `/media/categories/makanan-pedas.webp` | `Homepage/img/4. Makanan Pedas.png` | 37,7 KB | Ilustrasi kategori Makanan Pedas |
| `/media/categories/makanan-sehat.webp` | `Homepage/img/5. Makanan Sehat.png` | 32,0 KB | Ilustrasi kategori Makanan Sehat |
| `/media/categories/olahan-buah.webp` | `Homepage/img/6. Olohan Buah.png` | 13,5 KB | Ilustrasi kategori Olahan Buah |
| `/media/categories/lainnya.webp` | `Homepage/img/7. Lainnya.png` | 2,6 KB | Ilustrasi kategori Lainnya |

### 9.3 Resep (1200×900)

Penempatan foto adalah **INFERRED** untuk demo: tidak ada metadata yang
memastikan foto cocok dengan resep tertentu. Alt ditulis netral agar tidak
mengklaim isi foto.

| Aset | Sumber | Ukuran | Alt |
| --- | --- | --- | --- |
| `recipes/es-jeruk-peras.webp` | `kel_kategori/gambar/63bc324e5b66c.png` | 118,5 KB | Foto demo untuk resep Es Jeruk Peras |
| `recipes/wedang-jahe-serai.webp` | `kel_resep/img/63be384946884.jpg` | 111,2 KB | Foto demo untuk resep Wedang Jahe Serai |
| `recipes/teh-lemon-madu.webp` | `Homepage/img/1. Minuman.png` | 60,0 KB | Foto demo untuk resep Teh Lemon Madu |
| `recipes/pisang-goreng-crispy.webp` | `kel_resep/img/63b546a3a8685.jpeg` | 114,7 KB | Foto demo untuk resep Pisang Goreng Crispy |
| `recipes/puding-roti-tawar.webp` | `kel_kategori/gambar/63bc377d3ab8e.png` | 51,9 KB | Foto demo untuk resep Puding Roti Tawar |
| `recipes/klepon-gula-merah.webp` | `kel_resep/img/63be39005599a.jpeg` | 48,8 KB | Foto demo untuk resep Klepon Gula Merah |
| `recipes/bolu-kukus-pandan.webp` | `kel_resep/img/63bd8815b1b3a.jpeg` | 112,5 KB | Foto demo untuk resep Bolu Kukus Pandan |
| `recipes/soto-ayam-kampung.webp` | `kel_resep/img/63bd5f5c0f471.jpg` | 85,0 KB | Foto demo untuk resep Soto Ayam Kampung |
| `recipes/sayur-lodeh.webp` | `kel_resep/img/63bd6cdb62bb6.jpg` | 51,5 KB | Foto demo untuk resep Sayur Lodeh |
| `recipes/sup-bakso-sapi.webp` | `kel_kategori/gambar/63bc37126b700.png` | 106,5 KB | Foto demo untuk resep Sup Bakso Sapi |
| `recipes/rawon-daging.webp` | `kel_resep/img/63bd67259cbac.jpg` | 87,8 KB | Foto demo untuk resep Rawon Daging |
| `recipes/ayam-geprek-sambal-bawang.webp` | `kel_resep/img/63a5d18a1ad4c.jpeg` | 99,6 KB | Foto demo untuk resep Ayam Geprek Sambal Bawang |
| `recipes/sambal-goreng-kentang.webp` | `kel_kategori/gambar/63bdb0ac93b10.jpg` | 97,1 KB | Foto demo untuk resep Sambal Goreng Kentang |
| `recipes/rendang-daging-sapi.webp` | `kel_kategori/gambar/63bc37e4b0b30.png` | 117,5 KB | Foto demo untuk resep Rendang Daging Sapi |
| `recipes/ikan-tongkol-balado.webp` | `kel_kategori/gambar/63c2b1a7dae85.jpeg` | 118,0 KB | Foto demo untuk resep Ikan Tongkol Balado |
| `recipes/gado-gado-sayur.webp` | `kel_kategori/gambar/63bc36e46b9b6.png` | 108,2 KB | Foto demo untuk resep Gado-Gado Sayur |
| `recipes/tumis-kangkung-tempe.webp` | `kel_resep/img/63b548353db73.jpg` | 99,5 KB | Foto demo untuk resep Tumis Kangkung Tempe |
| `recipes/salad-buah-yogurt.webp` | `kel_kategori/gambar/63bc37980b3a6.png` | 67,2 KB | Foto demo untuk resep Salad Buah Yogurt |
| `recipes/sup-ayam-jagung.webp` | `kel_kategori/gambar/63bc37b94a70e.png` | 106,3 KB | Foto demo untuk resep Sup Ayam Jagung |
| `recipes/es-buah-campur.webp` | `kel_resep/img/63be3997f27b0.jpg` | 59,4 KB | Foto demo untuk resep Es Buah Campur |
| `recipes/mangga-saus-santan.webp` | `Homepage/img/6. Olohan Buah.png` | 44,8 KB | Foto demo untuk resep Mangga Saus Santan |
| `recipes/rujak-pepaya-muda.webp` | `kel_kategori/gambar/63bc3751e3d3a.png` | 107,3 KB | Foto demo untuk resep Rujak Pepaya Muda |
| `recipes/nasi-goreng-kampung.webp` | `bagi_Resep/img/63ba837a98a7f.jpg` | 110,1 KB | Foto demo untuk resep Nasi Goreng Kampung |
| `recipes/telur-dadar-padang.webp` | `Homepage/img/Makanan.png` | 109,4 KB | Foto demo untuk resep Telur Dadar Padang |

### 9.4 Avatar (256×256)

| Aset | Sumber | Ukuran | Alt |
| --- | --- | --- | --- |
| `/media/avatars/default.webp` | `UserProfil/default.jpg` | 1,6 KB | Avatar default |
| `/media/avatars/preset-1.webp` | `UserProfil/63bcc56c47f24.png` | 25,4 KB | Avatar preset 1 |
| `/media/avatars/preset-2.webp` | `UserProfil/63be6e8185349.jpeg` | 13,7 KB | Avatar preset 2 |
| `/media/avatars/preset-3.webp` | `UserProfil/63be6e949de38.png` | 3,6 KB | Avatar preset 3 |

### 9.5 Aturan

1. File asli tetap di `legacy/`; checksum tidak berubah.
2. Turunan WebP diberi nama deskriptif berbasis slug, bukan hash.
3. Setiap gambar punya `alt` yang dicatat pada tabel di atas.
4. Tidak menambah foto stok atau hasil generate.
5. Ukuran target: tile ≤ 40 KB, kartu resep ≤ 120 KB, hero ≤ 250 KB.
6. Aset yang tidak terpakai tidak disalin ke `frontend/`.
7. Lisensi foto tetap **UNKNOWN**; publikasi menunggu konfirmasi hak pakai.

## 10. Verifikasi

| Pemeriksaan | Hasil |
| --- | --- |
| Berkas media | 38 (3 brand, 7 kategori, 24 resep, 4 avatar) |
| Total ukuran media | 2,4 MB (legacy 38,5 MB) |
| Batas ukuran | Semua kategori ≤ 40 KB, resep ≤ 120 KB, hero ≤ 250 KB |
| Dimensi | Kategori 400×400, resep 1200×900, avatar 256×256 |
| Duplikat berkas | 0 (setiap nama unik; sumber boleh sama dengan crop berbeda) |
| Idempotensi | Hash seluruh berkas identik setelah skrip dijalankan ulang |
| Referensi fixture | 24 resep, 7 kategori, avatar pengguna/tim tersedia |
