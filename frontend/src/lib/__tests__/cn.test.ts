import { describe, expect, it } from 'vitest'

import { cn } from '@/lib/cn'

describe('cn', () => {
  it('menggabungkan kelas dan menghapus nilai kondisional yang false', () => {
    const hidden = false
    expect(cn('flex', hidden && 'hidden', 'gap-2')).toBe('flex gap-2')
  })

  it('menyelesaikan konflik utility Tailwind dengan nilai terakhir menang', () => {
    expect(cn('p-4', 'p-6')).toBe('p-6')
    expect(cn('text-body', 'text-small')).toBe('text-small')
  })

  it('mempertahankan kelas ukuran font kustom dan warna teks sekaligus', () => {
    expect(cn('text-body text-muted')).toBe('text-body text-muted')
    expect(cn('bg-surface text-ink', 'text-label')).toBe('bg-surface text-ink text-label')
    expect(cn('text-h2 text-brown', 'text-small')).toBe('text-brown text-small')
  })
})
