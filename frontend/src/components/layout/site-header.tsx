import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { IconButton, SearchField } from '@/components/ui'

import { Container } from './container'
import { DesktopNav } from './desktop-nav'
import { MobileNav } from './mobile-nav'
import { UserMenu } from './user-menu'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur">
      <Container className="flex h-16 items-center gap-4">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 rounded-sm text-h3 font-extrabold text-brown"
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-full bg-accent text-label text-ink"
          >
            RI
          </span>
          <span>Resep Ibu</span>
        </Link>

        <div className="hidden flex-1 justify-center lg:flex">
          <DesktopNav />
        </div>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <SearchField
            className="w-44 xl:w-56"
            placeholder="Cari resep…"
            onSubmit={(value) =>
              navigate(value ? `/resep?q=${encodeURIComponent(value)}` : '/resep')
            }
          />
          <UserMenu />
        </div>

        <IconButton
          label="Buka menu navigasi"
          icon={<Menu aria-hidden="true" className="h-5 w-5" />}
          onClick={() => setMenuOpen(true)}
          className="ml-auto lg:hidden"
        />
      </Container>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
