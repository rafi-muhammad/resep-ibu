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

## 9. Rencana pipeline aset (`M1-07`)

```text
legacy/…                      →  frontend/public/media/
  WebAset/Logo.png             →  brand/logo.png, brand/logo.webp
  WebAset/Logobl.png           →  brand/logo-small.png
  WebAset/Frame105.png         →  brand/bowl-motif.webp
  Homepage/img/1..7            →  categories/<slug>.webp (400×400)
  kel_resep/img/*              →  recipes/<slug>.webp (1200×900, cover)
  UserProfil/default.jpg       →  avatars/default.webp
```

Aturan:

1. File asli tetap di `legacy/`; tidak dihapus.
2. Turunan WebP diberi nama deskriptif, bukan hash.
3. Setiap gambar punya `alt` yang ditulis manusia.
4. Tidak menambah foto stok atau hasil generate tanpa persetujuan.
5. Ukuran target: tile ≤ 40 KB, kartu resep ≤ 120 KB, hero ≤ 250 KB.
6. Aset yang tidak terpakai tidak disalin ke `frontend/`.
