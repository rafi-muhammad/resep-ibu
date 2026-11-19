import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Alert, Skeleton, Spinner } from '@/components/ui'

describe('Alert', () => {
  it('mengumumkan tone danger sebagai alert', () => {
    render(
      <Alert tone="danger" title="Gagal menyimpan">
        Coba lagi beberapa saat lagi.
      </Alert>,
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Gagal menyimpan')
    expect(alert).toHaveTextContent('Coba lagi beberapa saat lagi.')
  })

  it('memakai status untuk tone info', () => {
    render(
      <Alert tone="info" title="Data demo">
        Semua data hanya tersimpan di perangkat ini.
      </Alert>,
    )

    expect(screen.getByRole('status')).toHaveTextContent('Data demo')
  })
})

describe('Spinner', () => {
  it('menyediakan label untuk pembaca layar', () => {
    render(<Spinner label="Memuat resep" />)

    expect(screen.getByRole('status')).toHaveTextContent('Memuat resep')
  })
})

describe('Skeleton', () => {
  it('tersembunyi dari pembaca layar dan memakai dimensi yang diberikan', () => {
    const { container } = render(<Skeleton width={120} height="1rem" rounded="full" />)
    const skeleton = container.firstElementChild

    expect(skeleton).toHaveAttribute('aria-hidden', 'true')
    expect(skeleton).toHaveStyle({ width: '120px', height: '1rem' })
    expect(skeleton).toHaveClass('rounded-full')
    expect(skeleton).toHaveClass('animate-pulse')
  })
})
