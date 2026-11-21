import { createBrowserRouter, type RouteObject } from 'react-router-dom'

import {
  AccountLayout,
  AdminShell,
  AuthLayout,
  PublicLayout,
  RootLayout,
} from '@/components/layout'
import { NotFoundPage } from '@/pages/not-found-page'
import { PlaceholderPage } from '@/pages/placeholder-page'
import { ProtectedRoute } from '@/features/auth'
import { HomePage } from '@/features/home'
import { PopularRecipesPage, RecipeDetailPage, RecipeListPage } from '@/features/recipes'

import { AdminRoute } from './admin-route'
import { RouteErrorBoundary } from './error-boundary'
import {
  AdminAboutPage,
  AdminCategoriesPage,
  AdminDashboardPage,
  AdminMessagesPage,
  AdminRecipesPage,
  AdminUsersPage,
} from './lazy-pages'

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'resep',
            element: <RecipeListPage />,
          },
          {
            path: 'resep/populer',
            element: <PopularRecipesPage />,
          },
          {
            path: 'resep/:slug',
            element: <RecipeDetailPage />,
          },
          {
            path: 'kategori',
            element: (
              <PlaceholderPage
                eyebrow="Kategori"
                title="Semua kategori"
                description="Pilih kategori masakan yang ingin dijelajahi."
              />
            ),
          },
          {
            path: 'kategori/:slug',
            element: (
              <PlaceholderPage
                eyebrow="Kategori"
                title="Resep per kategori"
                description="Kumpulan resep dalam kategori ini."
              />
            ),
          },
          {
            path: 'tentang',
            element: (
              <PlaceholderPage
                eyebrow="Tentang"
                title="Tentang Resep Ibu"
                description="Cerita dan nilai di balik situs resep ini."
              />
            ),
          },
          {
            path: 'kontak',
            element: (
              <PlaceholderPage
                eyebrow="Kontak"
                title="Hubungi kami"
                description="Kirim pertanyaan atau masukan lewat formulir kontak."
              />
            ),
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'masuk',
            element: (
              <PlaceholderPage
                eyebrow="Akun"
                title="Masuk"
                description="Formulir masuk akan tersedia pada issue autentikasi."
              />
            ),
          },
          {
            path: 'daftar',
            element: (
              <PlaceholderPage
                eyebrow="Akun"
                title="Daftar akun"
                description="Formulir pendaftaran akan tersedia pada issue autentikasi."
              />
            ),
          },
        ],
      },
      {
        element: (
          <ProtectedRoute>
            <AccountLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'profil',
            element: (
              <PlaceholderPage
                eyebrow="Akun"
                title="Profil saya"
                description="Data akun dan ringkasan aktivitas."
              />
            ),
          },
          {
            path: 'profil/keamanan',
            element: (
              <PlaceholderPage
                eyebrow="Akun"
                title="Keamanan akun"
                description="Ubah kata sandi akun demo."
              />
            ),
          },
          {
            path: 'profil/resep',
            element: (
              <PlaceholderPage
                eyebrow="Akun"
                title="Resep saya"
                description="Daftar resep yang kamu bagikan."
              />
            ),
          },
          {
            path: 'profil/disimpan',
            element: (
              <PlaceholderPage
                eyebrow="Akun"
                title="Resep disimpan"
                description="Resep yang kamu simpan untuk dimasak nanti."
              />
            ),
          },
          {
            path: 'bagikan',
            element: (
              <PlaceholderPage
                eyebrow="Kontribusi"
                title="Bagikan resep"
                description="Formulir berbagi resep akan tersedia pada issue kontribusi."
              />
            ),
          },
        ],
      },
      {
        element: (
          <ProtectedRoute requireRole="admin">
            <AdminShell />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'admin',
            element: (
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            ),
          },
          {
            path: 'admin/resep',
            element: (
              <AdminRoute>
                <AdminRecipesPage />
              </AdminRoute>
            ),
          },
          {
            path: 'admin/kategori',
            element: (
              <AdminRoute>
                <AdminCategoriesPage />
              </AdminRoute>
            ),
          },
          {
            path: 'admin/pengguna',
            element: (
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            ),
          },
          {
            path: 'admin/pesan',
            element: (
              <AdminRoute>
                <AdminMessagesPage />
              </AdminRoute>
            ),
          },
          {
            path: 'admin/tentang',
            element: (
              <AdminRoute>
                <AdminAboutPage />
              </AdminRoute>
            ),
          },
        ],
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
