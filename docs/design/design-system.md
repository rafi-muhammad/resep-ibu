# Design System — Resep Ibu "Dapur Hangat"

| Item | Nilai |
| --- | --- |
| Versi | 1.0 |
| Tanggal | 19 November 2026 |
| Arah | Modern Refresh, photo-led editorial |
| Font | Nunito |
| Palet inti | Cream `#FFF7E5`, Brown `#583217`, Terracotta `#DE876B`, Beige `#FBE8D5` |

## 1. Prinsip

1. **Foto yang bercerita.** Foto makanan adalah fokus; UI tidak boleh bersaing dengannya.
2. **Hangat, bukan ramai.** Cream dan cokelat menjadi kanvas; terracotta hanya aksen.
3. **Satu section, satu tujuan.** Tidak ada carousel bertumpuk, tabs berlebihan, atau efek dekoratif.
4. **Jelas sebelum cantik.** Hierarki, label, dan kontras mendahului ornamen.
5. **Tenang.** Gerakan halus, bayangan tipis, tanpa glassmorphism atau gradient dekoratif.

## 2. Identitas visual

- Nama UI: **Resep Ibu**. Wordmark logo: **ResepIbu**.
- Logo: `Logo.png` (310×80) untuk header/footer; `Logobl.png` untuk header ringkas.
- Ilustrasi mangkuk (`Frame105.png`) boleh dipakai sebagai motif di area auth atau hero, bukan sebagai latar penuh yang mengganggu teks.
- Tidak menambahkan font serif, maskot baru, atau ilustrasi stok.

## 3. Design tokens

```css
:root {
  /* Permukaan */
  --color-bg: #FFF7E5;            /* cream */
  --color-surface: #FBE8D5;       /* beige */
  --color-surface-strong: #F3D9BF;
  --color-inverse: #583217;       /* brown */

  /* Teks */
  --color-ink: #2B1B10;
  --color-brown: #583217;
  --color-muted: #6F5B4B;
  --color-ink-inverse: #FFF7E5;

  /* Aksi dan aksen */
  --color-accent: #DE876B;        /* terracotta, dekoratif */
  --color-action: #A34E2E;
  --color-action-hover: #8E3F24;
  --color-focus: #583217;

  /* Garis dan status */
  --color-border: #E3CFB8;        /* dekoratif */
  --color-field-border: #96775C;  /* ≥3:1 */
  --color-success: #2F6B4F;
  --color-danger: #A3271C;

  /* Tipografi */
  --font-sans: "Nunito", system-ui, -apple-system, "Segoe UI", sans-serif;
  --text-display: clamp(2.5rem, 5vw, 4rem);
  --text-h1: clamp(2rem, 4vw, 3rem);
  --text-h2: clamp(1.5rem, 3vw, 2.25rem);
  --text-h3: 1.25rem;
  --text-body: 1rem;
  --text-lg: 1.125rem;
  --text-small: 0.875rem;
  --text-label: 0.75rem;

  /* Spasi */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 24px; --space-6: 32px;
  --space-7: 48px; --space-8: 64px; --space-9: 80px;
  --space-10: 96px;

  /* Bentuk */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 999px;

  --shadow-sm: 0 1px 2px rgba(88, 50, 23, 0.06);
  --shadow-md: 0 8px 24px rgba(88, 50, 23, 0.08);

  /* Layout */
  --container: 1200px;
  --gutter: 24px;

  /* Gerak */
  --motion-fast: 180ms;
  --motion-base: 240ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Komponen **wajib** memakai token, bukan nilai hex langsung.

## 4. Kontras (terukur)

| Teks | Latar | Rasio | Status |
| --- | --- | --- | --- |
| `#2B1B10` | `#FFF7E5` | 15,54:1 | AAA |
| `#583217` | `#FFF7E5` | 10,45:1 | AAA |
| `#6F5B4B` | `#FFF7E5` | 6,01:1 | AA |
| `#A34E2E` | `#FFF7E5` | 5,34:1 | AA |
| `#FFFFFF` | `#A34E2E` | 5,70:1 | AA |
| `#FFF7E5` | `#A34E2E` | 5,34:1 | AA |
| `#2B1B10` | `#FBE8D5` | 13,90:1 | AAA |
| `#6F5B4B` | `#FBE8D5` | 5,38:1 | AA |
| `#A34E2E` | `#FBE8D5` | 4,78:1 | AA |
| `#2B1B10` | `#DE876B` | 6,14:1 | AA |
| `#DE876B` | `#FFF7E5` | 2,53:1 | **Gagal — jangan untuk teks** |
| `#583217` | `#DE876B` | 4,13:1 | **Gagal untuk teks normal** |
| `#FFF7E5` | `#583217` | 10,45:1 | AAA |
| `#FBE8D5` | `#583217` | 9,35:1 | AAA |

Aturan:

- Terracotta hanya untuk bidang dekoratif, badge, garis, atau ikon besar dengan teks `#2B1B10`.
- Tautan memakai `--color-action` dan bergaris bawah saat inline.
- Jangan menaruh teks kecil putih di atas terracotta.

## 5. Tipografi

Font tunggal **Nunito** (Google Fonts, variable weight 400–800).

| Peran | Ukuran | Weight | Line-height | Tracking |
| --- | --- | --- | --- | --- |
| Display | `--text-display` | 800 | 1,05 | -0,02em |
| H1 | `--text-h1` | 800 | 1,1 | -0,02em |
| H2 | `--text-h2` | 800 | 1,15 | -0,01em |
| H3 | `--text-h3` | 700 | 1,3 | 0 |
| Body besar | `--text-lg` | 400 | 1,65 | 0 |
| Body | `--text-body` | 400 | 1,65 | 0 |
| Small | `--text-small` | 400/600 | 1,5 | 0 |
| Label/eyebrow | `--text-label` | 800 | 1,2 | 0,12em, uppercase |

Batas panjang baris: 65–72 karakter. Jangan memakai weight di bawah 400 untuk paragraf.

## 6. Layout

- Container maksimum 1200 px, gutter 24 px (20 px di mobile).
- Grid 12 kolom; jarak antar kartu 24 px desktop, 16 px mobile.
- Section padding: 80–96 px desktop, 48–56 px mobile.
- Grid resep: 3 kolom ≥1024, 2 kolom 640–1023, 1 kolom <640.
- Grid kategori: 4 kolom desktop, 2 kolom mobile.
- Lebar form maksimum 560 px; form auth dalam kartu 420–460 px.
- Header tinggi 72 px desktop, 64 px mobile; sticky dengan latar cream dan border bawah.

Breakpoint:

```text
sm  640px
md  768px
lg  1024px
xl  1280px
2xl 1440px
```

## 7. Bentuk, garis, bayangan

- Radius: input dan tombol `8px`, kartu `12px`, panel besar `16px`, avatar/badge `999px`.
- Border default 1 px `--color-border`; border input 1 px `--color-field-border`.
- Bayangan hanya `--shadow-sm` untuk kartu diam dan `--shadow-md` saat hover/fokus.
- Tidak ada border + shadow tebal bersamaan.

## 8. Gerak

- Durasi 180 ms untuk hover/fokus, 240 ms untuk panel/dialog.
- Easing `--ease-out`.
- Hover kartu: naik 2 px, gambar zoom 1,02, bayangan `--shadow-md`.
- Dialog: fade + scale 0,98 → 1.
- Hormati `prefers-reduced-motion: reduce`: hilangkan transform dan transisi.

## 9. Ikon

- Gunakan **Lucide React**; ukuran 16, 20, atau 24 px; stroke 2.
- Ikon dekoratif `aria-hidden="true"`; ikon berdiri sendiri wajib punya label.
- Jangan mencampur Material Icons atau emoji sebagai ikon UI.

## 10. Fotografi

| Pemakaian | Rasio | Ukuran target |
| --- | --- | --- |
| Kartu resep | 4:3 | 800×600 WebP ≤ 120 KB |
| Hero/detail | 4:3 atau 16:10 | 1200×900 WebP ≤ 250 KB |
| Tile kategori | 1:1 | 400×400 WebP ≤ 40 KB |
| Avatar | 1:1 | 200×200 WebP ≤ 20 KB |

- `object-fit: cover`, radius mengikuti wadah.
- Tidak memakai overlay gelap penuh; bila perlu teks di atas foto, gunakan scrim `rgba(43,27,16,0.55)` dan teks cream.
- Alt text menjelaskan isi foto, bukan mengulang judul.
- Foto tanpa lisensi jelas hanya untuk demo internal.

## 11. Komponen inti

### Button

| Varian | Latar | Teks | Border |
| --- | --- | --- | --- |
| Primary | `--color-action` | `#FFF7E5` | tidak ada |
| Secondary | transparan | `--color-brown` | 1 px `--color-field-border` |
| Ghost | transparan | `--color-brown` | tidak ada |
| Danger | `--color-danger` | putih | tidak ada |

Tinggi minimal 44 px; padding 12×20 px; radius 8 px; weight 700. State: hover, active, focus-visible, disabled (opacity 0,55), loading (spinner + teks tetap).

### Input dan form

- Label di atas, weight 700, ukuran 14 px.
- Input tinggi 44 px, radius 8 px, border `--color-field-border`, latar putih.
- Pesan error di bawah, warna `--color-danger`, ikon 16 px.
- Fokus: outline 2 px `--color-focus`, offset 2 px.
- Helper text memakai `--color-muted`.

### Kartu resep

- Latar putih, border 1 px, radius 12 px, overflow hidden.
- Gambar 4:3, judul 2 baris maksimum, metadata kategori + waktu.
- Seluruh kartu dapat diklik; tautan utama tetap fokusabel.
- Tanpa rating, jumlah viewer, atau badge palsu.

### Navigasi

- Header cream, logo kiri, tautan tengah, aksi kanan.
- Mobile: tombol menu 44×44, panel full-height, fokus terperangkap, Esc menutup.
- Tautan aktif memakai `aria-current="page"` dan garis bawah brown 2 px.

### Tabel admin

- Header beige, teks brown 700, baris 48 px, border bawah tipis.
- Aksi berupa tombol ikon + label tooltip; tidak hanya ikon.
- Di mobile, tabel berubah menjadi daftar kartu, bukan scroll horizontal tanpa petunjuk.

## 12. Tema admin

- Sidebar brown `#583217` dengan teks cream (10,45:1).
- Konten cream; kartu statistik putih dengan border.
- Item aktif: latar `#6B3F21` + indikator cream 3 px.
- Fokus pada permukaan gelap memakai outline cream 2 px.
- Lebar sidebar 240 px; di <1024 menjadi drawer.

## 13. Aksesibilitas

- Setiap input punya `<label>`; placeholder bukan pengganti label.
- Urutan heading logis: satu `h1` per halaman.
- Fokus tidak boleh hilang; jangan `outline: none` tanpa pengganti.
- Target sentuh minimal 44×44 px.
- Error form diumumkan lewat `aria-live` dan terhubung `aria-describedby`.
- Dialog memakai `role="dialog"`, `aria-modal`, fokus awal, dan mengembalikan fokus saat ditutup.
- Gambar dekoratif `alt=""`; gambar konten punya alt deskriptif.
- Uji dengan keyboard dan pembaca layar pada alur login, pencarian, dan form.

## 14. Suara dan nada

Hangat, langsung, tidak berlebihan. Seperti tuan rumah yang membantu, bukan brand yang berteriak.

| Kebutuhan | Contoh |
| --- | --- |
| Judul hero | "Resep rumahan, dari dapur kami ke dapur kamu" |
| Empty state | "Belum ada resep yang cocok. Coba kata kunci lain." |
| Error | "Email atau password belum cocok. Coba lagi." |
| Sukses | "Resep tersimpan." |
| CTA | "Cari resep", "Bagikan resep", "Simpan resep" |

Hindari: "Solusi kuliner terbaik", "Ribuan resep terverifikasi" tanpa data, tanda seru berlebihan, dan istilah teknis di UI.

## 15. Do / Don't

| Do | Don't |
| --- | --- |
| Gunakan foto asli dan alt yang jelas | Memakai ilustrasi AI atau stok tanpa izin |
| Satu CTA utama per section | Menumpuk tiga tombol bersaing |
| Kontras terukur | Terracotta untuk teks kecil |
| Grid dan spacing konsisten | Nilai acak per halaman |
| Empty state yang membantu | Halaman kosong tanpa penjelasan |
| Animasi halus | Efek parallax/shader berlebihan |

## 16. Integrasi Tailwind

- Token didefinisikan sekali di `src/styles/theme.css` melalui `@theme`.
- Utility yang dipakai: `bg-bg`, `bg-surface`, `text-ink`, `text-muted`, `bg-action`, `border-border`, `rounded-md`, `shadow-sm`.
- Dilarang menulis hex langsung di komponen; pengecualian hanya token dan scrim.
- Kelas dinamis disusun dengan `clsx` + `tailwind-merge` (satu helper `cn()`).
- Dark mode tidak diaktifkan di Phase 1.
