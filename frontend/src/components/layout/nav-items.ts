export interface NavItem {
  label: string
  to: string
  isActive: (pathname: string) => boolean
}

function matchesPrefix(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`)
}

export const publicNavItems: NavItem[] = [
  { label: 'Beranda', to: '/', isActive: (pathname) => pathname === '/' },
  {
    label: 'Resep',
    to: '/resep',
    isActive: (pathname) =>
      matchesPrefix(pathname, '/resep') && !matchesPrefix(pathname, '/resep/populer'),
  },
  {
    label: 'Populer',
    to: '/resep/populer',
    isActive: (pathname) => matchesPrefix(pathname, '/resep/populer'),
  },
  {
    label: 'Kategori',
    to: '/kategori',
    isActive: (pathname) => matchesPrefix(pathname, '/kategori'),
  },
  { label: 'Tentang', to: '/tentang', isActive: (pathname) => pathname === '/tentang' },
  { label: 'Kontak', to: '/kontak', isActive: (pathname) => pathname === '/kontak' },
]

export const accountNavItems: NavItem[] = [
  { label: 'Profil', to: '/profil', isActive: (pathname) => pathname === '/profil' },
  {
    label: 'Keamanan',
    to: '/profil/keamanan',
    isActive: (pathname) => pathname === '/profil/keamanan',
  },
  {
    label: 'Resep saya',
    to: '/profil/resep',
    isActive: (pathname) => pathname === '/profil/resep',
  },
  {
    label: 'Resep disimpan',
    to: '/profil/disimpan',
    isActive: (pathname) => pathname === '/profil/disimpan',
  },
]
