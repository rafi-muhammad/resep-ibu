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
import { LoginPage, ProtectedRoute, RegisterPage } from '@/features/auth'
import { PasswordPage, ProfilePage } from '@/features/account'
import { CategoriesIndexPage, CategoryDetailPage } from '@/features/categories'
import { AboutPage, ContactPage } from '@/features/content'
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
            element: <CategoriesIndexPage />,
          },
          {
            path: 'kategori/:slug',
            element: <CategoryDetailPage />,
          },
          {
            path: 'tentang',
            element: <AboutPage />,
          },
          {
            path: 'kontak',
            element: <ContactPage />,
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'masuk',
            element: <LoginPage />,
          },
          {
            path: 'daftar',
            element: <RegisterPage />,
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
            element: <ProfilePage />,
          },
          {
            path: 'profil/keamanan',
            element: <PasswordPage />,
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
