# Arsitektur Frontend — Resep Ibu Phase 1

| Item | Nilai |
| --- | --- |
| Versi | 1.0 |
| Tanggal | 19 November 2026 |
| Stack | React + TypeScript + Vite + Tailwind CSS + React Router + Lucide React |
| Testing | Vitest + React Testing Library + Playwright |
| Backend | Tidak ada di Phase 1; kontrak disiapkan untuk Laravel |

## 1. Prinsip

1. **Frontend-first, bukan frontend palsu.** Semua interaksi berfungsi dengan data mock; tidak ada tombol mati.
2. **Satu kontrak data.** Halaman hanya berbicara dengan repository, bukan `fetch` langsung atau fixture.
3. **Mudah diganti.** Adapter mock dapat ditukar dengan adapter HTTP tanpa mengubah komponen.
4. **URL adalah state.** Filter, pencarian, dan pagination dapat dibagikan dan di-bookmark.
5. **Sedikit dependency.** Tidak ada state manager, UI kit, atau form library di luar yang disetujui.
6. **Aksesibel sejak awal.** Bukan perbaikan di akhir.

## 2. Stack

| Lapisan | Pilihan | Catatan |
| --- | --- | --- |
| Build | Vite | Versi stabil saat scaffold, dicatat di `package.json` |
| UI | React + TypeScript strict | Satu versi React untuk seluruh aplikasi |
| Styling | Tailwind CSS | Token via `@theme`, tanpa CSS-in-JS |
| Routing | React Router | Data router, route lazy |
| Ikon | Lucide React | Ukuran 16/20/24 |
| Test unit | Vitest + RTL | `jsdom` |
| Test E2E | Playwright | Alur kritis saja |
| Format/lint | Prettier + oxlint | Konfigurasi tunggal; oxlint sesuai template Vite dan lebih cepat dari ESLint (lihat D-17) |

Tidak dipakai: Redux/Zustand, React Query, Axios, Formik/RHF, komponen UI eksternal, CKEditor, jQuery.

## 3. Struktur folder

```text
frontend/
  public/
    media/
      brand/
      categories/
      recipes/
      avatars/
  src/
    app/
      router.tsx
      providers.tsx
      error-boundary.tsx
    components/
      ui/
      layout/
      recipe/
    features/
      auth/
      recipes/
      categories/
      profile/
      contact/
      admin/
    lib/
      api/
        types.ts
        repositories.ts
        http/
        mock/
      auth/
      validation/
      format/
      storage/
    mocks/
      recipes.ts
      categories.ts
      users.ts
      messages.ts
      content.ts
    pages/
    styles/
      theme.css
      base.css
    types/
    test/
  e2e/
```

## 4. Routing

| Path | Komponen | Guard |
| --- | --- | --- |
| `/` | `HomePage` | — |
| `/resep` | `RecipeListPage` | — |
| `/resep/populer` | `PopularRecipesPage` | — |
| `/resep/:slug` | `RecipeDetailPage` | — |
| `/kategori` | `CategoryIndexPage` | — |
| `/kategori/:slug` | `CategoryDetailPage` | — |
| `/tentang` | `AboutPage` | — |
| `/kontak` | `ContactPage` | — |
| `/masuk` | `LoginPage` | hanya tamu |
| `/daftar` | `RegisterPage` | hanya tamu |
| `/profil` | `ProfilePage` | login |
| `/profil/keamanan` | `SecurityPage` | login |
| `/profil/resep` | `MyRecipesPage` | login |
| `/profil/disimpan` | `SavedRecipesPage` | login |
| `/bagikan` | `ShareRecipePage` | login |
| `/admin` | `AdminDashboardPage` | admin |
| `/admin/resep` | `AdminRecipesPage` | admin |
| `/admin/kategori` | `AdminCategoriesPage` | admin |
| `/admin/pengguna` | `AdminUsersPage` | admin |
| `/admin/pesan` | `AdminMessagesPage` | admin |
| `/admin/tentang` | `AdminAboutPage` | admin |
| `*` | `NotFoundPage` | — |

Route admin dan profil memakai `lazy()` dan hanya dimuat setelah guard lolos.

## 5. Tipe domain (`src/lib/api/types.ts`)

```ts
export type Role = "user" | "admin";
export type Status = "active" | "inactive";
export type RecipeStatus = Status | "draft";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  bio: string;
  avatar: string;
  status: Status;
  joinedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: Status;
  recipeCount: number;
}

export interface IngredientGroup {
  title?: string;
  items: string[];
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  story: string;
  categoryId: string;
  authorId: string;
  image: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  difficulty: "mudah" | "sedang" | "sulit";
  ingredients: IngredientGroup[];
  steps: string[];
  status: RecipeStatus;
  popularity: number;
  publishedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  status: Status;
  order: number;
}

export interface AboutContent {
  title: string;
  intro: string;
  story: string[];
  values: { title: string; description: string }[];
}

export interface Paginated<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
```

## 6. Repository

```ts
export interface RecipeQuery {
  q?: string;
  category?: string;
  sort?: "terbaru" | "populer" | "az";
  page?: number;
  perPage?: number;
  status?: RecipeStatus;
}

export interface RecipeRepository {
  list(query: RecipeQuery): Promise<Paginated<Recipe>>;
  getBySlug(slug: string): Promise<Recipe | null>;
  listByAuthor(authorId: string): Promise<Recipe[]>;
  create(input: CreateRecipeInput, authorId: string): Promise<Recipe>;
  updateStatus(id: string, status: RecipeStatus): Promise<Recipe>;
  remove(id: string): Promise<void>;
  listSaved(userId: string): Promise<Recipe[]>;
  save(userId: string, recipeId: string): Promise<void>;
  unsave(userId: string, recipeId: string): Promise<void>;
}

export interface AuthRepository {
  login(email: string, password: string): Promise<User>;
  register(input: RegisterInput): Promise<User>;
  logout(): Promise<void>;
  getSession(): Promise<User | null>;
}

export interface CategoryRepository { /* list, getBySlug, create, update, remove */ }
export interface UserRepository { /* list, getById, updateProfile, updatePassword, updateStatus */ }
export interface ContactRepository { /* create, list, markRead, remove */ }
export interface ContentRepository { /* getAbout, updateAbout, listTeam, saveTeam, removeTeam */ }
export interface AdminRepository { /* getSummary */ }
```

Aturan:

- Komponen tidak mengimpor `src/mocks/*` secara langsung.
- Hook fitur (`useRecipes`, `useRecipe`, `useAuth`) memanggil repository.
- Repository mengembalikan tipe domain, bukan bentuk response mentah.

## 7. Adapter mock

- Data awal: `src/mocks/*` (24 resep, 7 kategori, 4 pengguna, 6 pesan, 3 tim).
- Salinan kerja disimpan di `localStorage` dengan namespace `resep-ibu:v1:`.
- Kunci: `session`, `recipes`, `categories`, `users`, `messages`, `content`, `saved`.
- Latensi simulasi 150–300 ms; dapat dimatikan lewat `VITE_MOCK_LATENCY=0` untuk test.
- Operasi tulis memperbarui store dan mengembalikan objek terbaru.
- ID baru memakai `crypto.randomUUID()`.
- Reset demo tersedia di halaman login (tombol "Reset data demo").
- Jika `localStorage` tidak tersedia, gunakan fallback in-memory dan tampilkan peringatan.

## 8. Autentikasi demo

- `AuthProvider` memuat sesi dari `resep-ibu:v1:session`.
- Login memvalidasi kredensial terhadap store pengguna dan status aktif.
- Password demo disimpan sebagai hash sederhana **hanya** untuk simulasi; tidak pernah ditampilkan.
- `ProtectedRoute` menerima `requireRole?: Role`.
- `returnTo` disimpan di query string, bukan state global.
- Logout menghapus sesi dan data sensitif di memori.

**Peringatan:** ini bukan keamanan nyata dan tidak boleh dipakai di produksi.

## 9. State

| Jenis state | Tempat |
| --- | --- |
| Filter, search, pagination | URL search params |
| Sesi pengguna | `AuthProvider` (Context) |
| Toast | `ToastProvider` (Context) |
| Dialog/form lokal | `useState` komponen |
| Data server/mock | hook per fitur + cache in-memory sederhana |

Tidak ada global store. Bila cache diperlukan, gunakan modul kecil dengan invalidasi eksplisit setelah mutasi.

## 10. Validasi

- Fungsi murni di `src/lib/validation`, dapat diuji tanpa React.
- Mengembalikan `Record<string, string>` berisi pesan error.
- Aturan: required, min/max length, email, password strength, konfirmasi, jumlah bahan/langkah, tipe file, ukuran file.
- Validasi klien bukan pengganti validasi server di Phase 2.

## 11. Error handling

- `RouteErrorBoundary` menangkap error render.
- Repository melempar `ApiError` dengan `code`, `message`, dan `fields`.
- Form memetakan `fields` ke error inline.
- Daftar menampilkan `ErrorState` dengan retry.
- Tidak ada `console.error` di production kecuali logging terpusat.

## 12. Styling

- Tailwind dengan token di `src/styles/theme.css`.
- Helper `cn()` = `clsx` + `tailwind-merge`.
- Tidak ada hex langsung di komponen.
- Kelas responsif mobile-first.
- Animasi menghormati `prefers-reduced-motion`.

## 13. Aset

- Sumber: `legacy/`; turunan WebP di `frontend/public/media`.
- Nama file deskriptif berbasis slug, bukan hash.
- `ImageWithFallback` menangani gambar gagal.
- Tidak ada hotlink ke domain eksternal.

## 14. Performa

- Route lazy untuk admin dan halaman berat.
- `<img loading="lazy">` kecuali hero.
- Ukuran gambar sesuai target di design system.
- Bundle awal < 250 KB gzip.
- Tidak memuat font weight yang tidak dipakai.
- Hindari dependency baru tanpa pengukuran.

## 15. Testing

| Level | Cakupan | Alat |
| --- | --- | --- |
| Unit | validator, formatter, filter/sort, mock repository | Vitest |
| Komponen | Button, FormField, RecipeCard, Pagination, EmptyState | RTL |
| Integrasi | halaman dengan mock repository | RTL + MemoryRouter |
| E2E | cari → detail; kategori → detail; login → profil; bagikan; admin hapus; kontak | Playwright |
| A11y | axe pada halaman utama + keyboard manual | `@axe-core/playwright` bila disetujui |
| Visual | screenshot 390/768/1024/1440 | Playwright |

Quality gate: `npm run typecheck && npm run lint && npm run format:check && npm run test && npm run build`.

## 16. Kontrak Laravel Phase 2

| Aksi | Endpoint |
| --- | --- |
| Daftar resep | `GET /api/v1/recipes?q=&category=&sort=&page=` |
| Detail resep | `GET /api/v1/recipes/{slug}` |
| Kategori | `GET /api/v1/categories` |
| Login | `POST /api/v1/auth/login` |
| Registrasi | `POST /api/v1/auth/register` |
| Logout | `POST /api/v1/auth/logout` |
| Sesi | `GET /api/v1/auth/me` |
| Profil | `PATCH /api/v1/profile` |
| Password | `PATCH /api/v1/profile/password` |
| Buat resep | `POST /api/v1/recipes` |
| Resep saya | `GET /api/v1/me/recipes` |
| Simpan | `POST/DELETE /api/v1/me/saved/{recipe}` |
| Kontak | `POST /api/v1/contact` |
| Admin | `/api/v1/admin/*` |

Bentuk sukses:

```json
{ "data": {}, "meta": { "page": 1, "perPage": 12, "total": 24, "totalPages": 2 } }
```

Bentuk error:

```json
{ "message": "Data tidak valid", "errors": { "email": ["Email sudah dipakai."] } }
```

- Autentikasi: Sanctum cookie-based SPA.
- Adapter HTTP memetakan response ke tipe domain; halaman tidak berubah.
- Upload foto di Phase 2 memakai multipart; Phase 1 hanya preview.
- Ganti adapter lewat `VITE_USE_MOCK=false` dan `VITE_API_BASE_URL`.

## 17. Keputusan arsitektur (ADR)

| ID | Keputusan | Alasan | Konsekuensi |
| --- | --- | --- | --- |
| ADR-01 | Tanpa state manager | Skala aplikasi kecil; URL + Context cukup | Perlu disiplin invalidasi cache |
| ADR-02 | Repository + adapter | Memisahkan UI dari sumber data | Sedikit boilerplate |
| ADR-03 | Mock di `localStorage` | Demo bertahan tanpa backend | Bukan keamanan nyata |
| ADR-04 | Bahan/langkah array | Aksesibel dan mudah dimigrasikan | Tidak mendukung HTML kaya |
| ADR-05 | Tanpa form library | Form masih sederhana; dependency minimal | Validasi ditulis sendiri |
| ADR-06 | Commit per issue ke `main` | Sesuai keputusan pemilik | Perlu quality gate disiplin |
| ADR-07 | Tailwind token | Konsistensi visual | Perlu disiplin menghindari nilai acak |

## 18. Risiko teknis

| Risiko | Mitigasi |
| --- | --- |
| Mock store tidak sinkron antar tab | Dengarkan event `storage` atau batasi demo satu tab |
| Data demo tumbuh tak terkontrol | Reset demo + fixture berversi |
| Perbedaan bentuk API Laravel | Kontrak di bagian 16 diuji dengan adapter palsu |
| Aset berat | Optimasi di M1-07 dan audit ukuran |
| Scope admin besar | Implementasi per issue, tanpa fitur tambahan |
