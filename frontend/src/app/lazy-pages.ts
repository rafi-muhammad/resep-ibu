import { lazy } from 'react'

/*
 * Route admin dimuat terpisah agar bundle awal tetap ringan.
 * Semua komponen berasal dari satu chunk `admin-pages`.
 */
export const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/admin-pages').then((module) => ({ default: module.AdminDashboardPage })),
)
export const AdminRecipesPage = lazy(() =>
  import('@/pages/admin/admin-pages').then((module) => ({ default: module.AdminRecipesPage })),
)
export const AdminCategoriesPage = lazy(() =>
  import('@/pages/admin/admin-pages').then((module) => ({ default: module.AdminCategoriesPage })),
)
export const AdminUsersPage = lazy(() =>
  import('@/pages/admin/admin-pages').then((module) => ({ default: module.AdminUsersPage })),
)
export const AdminMessagesPage = lazy(() =>
  import('@/pages/admin/admin-pages').then((module) => ({ default: module.AdminMessagesPage })),
)
export const AdminAboutPage = lazy(() =>
  import('@/pages/admin/admin-pages').then((module) => ({ default: module.AdminAboutPage })),
)
