import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

import { IconButton } from '@/components/ui'

import { AdminSidebar } from './admin-sidebar'

export function AdminShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-bg/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <IconButton
            label="Buka menu admin"
            icon={<Menu aria-hidden="true" className="h-5 w-5" />}
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          />
          <p className="text-small font-bold text-brown">Admin</p>
          <Link
            to="/"
            className="ml-auto inline-flex min-h-11 items-center rounded-sm px-2 text-small font-bold text-brown hover:underline"
          >
            Lihat situs
          </Link>
        </header>

        <main id="main" tabIndex={-1} className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
