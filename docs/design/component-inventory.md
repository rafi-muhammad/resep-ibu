# Inventaris Komponen — Resep Ibu Phase 1

Aturan: satu komponen = satu implementasi. Variasi memakai props, bukan file duplikat. Semua komponen memakai token dari `docs/design/design-system.md`.

## 1. Primitif (`src/components/ui`)

| Komponen | Tujuan | Varian / Props penting | State | Dipakai di | Issue |
| --- | --- | --- | --- | --- | --- |
| `Button` | Aksi utama | `variant: primary\|secondary\|ghost\|danger`, `size: sm\|md\|lg`, `loading`, `disabled`, `fullWidth` | hover, focus, active, loading, disabled | seluruh aplikasi | M1-03 |
| `IconButton` | Aksi ikon | `label` wajib, `icon`, `variant`, `size` | sama seperti Button | tabel, header, dialog | M1-03 |
| `LinkButton` | Navigasi bergaya tombol | `to`, `variant`, `size` | hover, focus | hero, empty state | M1-03 |
| `Input` | Input teks | `type`, `invalid`, `size` | focus, invalid, disabled | form | M1-03 |
| `Textarea` | Teks panjang | `rows`, `invalid`, `maxLength` | focus, invalid | kontak, bagikan, admin | M1-03 |
| `Select` | Pilihan tunggal | `options`, `placeholder`, `invalid` | focus, invalid | filter, form | M1-03 |
| `Checkbox` | Persetujuan | `label`, `description`, `invalid` | checked, focus | auth, kontak | M1-03 |
| `FileInput` | Pilih foto | `accept`, `maxSize`, `onFile` | drag-over, invalid | bagikan | M1-03 |
| `FormField` | Label + kontrol + pesan | `label`, `htmlFor`, `error`, `hint`, `required` | error | semua form | M1-03 |
| `SearchField` | Input pencarian | `value`, `onSubmit`, `placeholder` | focus, filled | header, `/resep`, admin | M1-03 |
| `Badge` | Label status/kategori | `tone: neutral\|accent\|success\|danger`, `size` | — | kartu, tabel | M1-03 |
| `FilterChip` | Filter kategori | `selected`, `onToggle` | selected, focus | `/resep` | M1-03 |
| `Avatar` | Foto pengguna | `src`, `name`, `size`, `fallback` | error fallback | header, profil, admin | M1-03 |
| `Alert` | Pesan inline | `tone: info\|success\|warning\|danger`, `title`, `children` | — | form, error lokal | M1-03 |
| `Toast` / `ToastProvider` | Notifikasi singkat | `tone`, `duration`, `action` | enter/exit | global | M1-03 |
| `Skeleton` | Placeholder loading | `width`, `height`, `rounded` | pulse | daftar, detail | M1-03 |
| `Spinner` | Indikator proses | `size`, `label` | spin | tombol, halaman | M1-03 |
| `EmptyState` | Kondisi kosong | `icon`, `title`, `description`, `action` | — | semua daftar | M1-03 |
| `Dialog` | Panel modal | `open`, `onClose`, `title`, `size` | open, focus trap | konfirmasi, form admin | M1-03 |
| `ConfirmDialog` | Konfirmasi destruktif | `title`, `description`, `confirmLabel`, `tone` | pending | hapus, ubah status | M1-03 |
| `Pagination` | Navigasi halaman | `page`, `totalPages`, `onChange` | disabled prev/next | `/resep`, kategori | M1-03 |
| `Breadcrumbs` | Jejak navigasi | `items: { label, to? }[]` | — | detail, kategori | M1-03 |
| `PageHeader` | Judul + deskripsi + aksi | `title`, `description`, `actions` | — | halaman publik | M1-03 |
| `SectionHeader` | Judul section + tautan | `title`, `action` | — | beranda | M1-03 |
| `Card` | Wadah dasar | `as`, `padding`, `interactive` | hover | seluruh aplikasi | M1-03 |

## 2. Layout (`src/components/layout`)

| Komponen | Tujuan | Catatan | Issue |
| --- | --- | --- | --- |
| `Container` | Lebar dan gutter konsisten | maks 1200 px | M1-05 |
| `SiteHeader` | Header publik | logo, nav, search, akun | M1-05 |
| `DesktopNav` | Navigasi ≥1024 | tautan aktif | M1-05 |
| `MobileNav` | Drawer <1024 | focus trap, Esc, scroll lock | M1-05 |
| `UserMenu` | Menu akun | profil, resep saya, admin jika role, logout | M1-05 |
| `SiteFooter` | Footer publik | logo, tautan, copyright | M1-05 |
| `AuthLayout` | Layout login/registrasi | split, motif mangkuk | M1-05 |
| `AccountLayout` | Sidebar akun | 4 tautan | M1-05 |
| `AdminShell` | Kerangka admin | sidebar + header + main | M1-05 |
| `AdminSidebar` | Navigasi admin | drawer di mobile | M1-05 |
| `SkipLink` | Aksesibilitas | target `#main` | M1-05 |
| `ScrollToTop` | Reset scroll | hormati `prefers-reduced-motion` | M1-05 |

## 3. Domain resep (`src/components/recipe`)

| Komponen | Tujuan | Props | Issue |
| --- | --- | --- | --- |
| `RecipeCard` | Kartu resep | `recipe`, `variant: grid\|compact` | M2-02 |
| `RecipeGrid` | Grid responsif | `recipes`, `loading`, `empty` | M2-02 |
| `RecipeMeta` | Waktu, porsi, kesulitan | `recipe` | M2-03 |
| `IngredientList` | Bahan terkelompok | `groups: IngredientGroup[]` | M2-03 |
| `StepList` | Langkah bernomor | `steps: string[]` | M2-03 |
| `SaveButton` | Simpan/lepas | `recipeId`, `saved`, `onToggle` | M2-03 |
| `ShareButton` | Salin tautan | `url`, `title` | M2-03 |
| `CategoryTile` | Tile kategori | `category`, `count` | M2-04 |
| `CategoryHero` | Header kategori | `category` | M2-04 |
| `RecipeFilters` | Toolbar filter | `value`, `onChange`, `onReset` | M2-02 |

## 4. Akun dan kontribusi (`src/features/*/components`)

| Komponen | Tujuan | Issue |
| --- | --- | --- |
| `PersonalDataForm` | Form profil | M3-02 |
| `PasswordForm` | Form ubah password | M3-02 |
| `AccountNav` | Navigasi sidebar akun | M3-02 |
| `RecipeForm` | Form bagikan resep | M3-03 |
| `IngredientRepeater` | Tambah/hapus bahan | M3-03 |
| `StepRepeater` | Tambah/hapus langkah | M3-03 |
| `ImagePreview` | Preview foto lokal | M3-03 |
| `MyRecipeList` | Daftar resep user | M3-04 |
| `SavedRecipeGrid` | Daftar resep disimpan | M3-04 |

## 5. Admin (`src/features/admin/components`)

| Komponen | Tujuan | Issue |
| --- | --- | --- |
| `StatCard` | Angka ringkasan | M4-01 |
| `DataTable` | Tabel responsif | M4-01 |
| `TableToolbar` | Search + filter | M4-01 |
| `StatusToggle` | Aktif/non-aktif | M4-02 |
| `RowActions` | Lihat/ubah/hapus | M4-01 |
| `UserDetailDrawer` | Detail pengguna | M4-01 |
| `CategoryFormDialog` | Tambah/edit kategori | M4-02 |
| `MessageList` | Daftar pesan | M4-03 |
| `MessageDetail` | Isi pesan | M4-03 |
| `AboutForm` | Edit konten tentang | M4-03 |
| `TeamEditor` | CRUD anggota tim | M4-03 |

## 6. Umpan balik dan status

| Komponen | Tujuan | Issue |
| --- | --- | --- |
| `PageSkeleton` | Skeleton layout halaman | M1-03 |
| `ErrorState` | Error dengan retry | M1-03 |
| `NotFoundPage` | Halaman 404 | M1-05 |
| `RouteErrorBoundary` | Penangkap error route | M1-05 |
| `ProtectedRoute` | Guard login/role | M1-06 |
| `DemoBadge` | Penanda data demo | M1-05 |

## 7. Aturan implementasi

1. Jangan membuat komponen baru bila varian props cukup.
2. Semua teks UI berbahasa Indonesia, tetapi nama props dan tipe berbahasa Inggris.
3. Semua komponen menerima `className` dan menggabungkannya lewat `cn()`.
4. Komponen tidak boleh mengimpor repository atau fixture; data diberikan lewat props atau hook fitur.
5. Setiap komponen interaktif wajib memiliki state fokus dan dapat dioperasikan keyboard.
6. Tidak ada komponen yang hanya ada untuk satu halaman tanpa alasan jelas.
