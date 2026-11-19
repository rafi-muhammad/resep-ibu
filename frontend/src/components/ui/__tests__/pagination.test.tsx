import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Pagination, getPageItems } from '@/components/ui'

describe('getPageItems', () => {
  it('menampilkan semua halaman bila tujuh atau kurang', () => {
    expect(getPageItems(2, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('membatasi nomor halaman menjadi lima dengan elipsis', () => {
    const items = getPageItems(4, 12)
    expect(items.filter((item) => typeof item === 'number')).toHaveLength(5)
    expect(items).toContain('ellipsis-start')
    expect(items).toContain('ellipsis-end')
    expect(items).toEqual([1, 'ellipsis-start', 3, 4, 5, 'ellipsis-end', 12])
  })

  it('tetap menyertakan halaman pertama dan terakhir', () => {
    expect(getPageItems(1, 12)).toEqual([1, 2, 'ellipsis-end', 12])
    expect(getPageItems(12, 12)).toEqual([1, 'ellipsis-start', 11, 12])
  })
})

describe('Pagination', () => {
  it('memakai nav berlabel dan mengumumkan halaman aktif', () => {
    render(<Pagination page={4} totalPages={12} onChange={() => {}} />)

    expect(screen.getByRole('navigation', { name: 'Navigasi halaman' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Halaman 4' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByText('Halaman 4 dari 12')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Halaman \d+$/ })).toHaveLength(5)
  })

  it('memanggil onChange untuk halaman lain dan tombol berikutnya', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Pagination page={4} totalPages={12} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Halaman 5' }))
    expect(onChange).toHaveBeenCalledWith(5)

    await user.click(screen.getByRole('button', { name: 'Halaman berikutnya' }))
    expect(onChange).toHaveBeenCalledWith(5)

    await user.click(screen.getByRole('button', { name: 'Halaman sebelumnya' }))
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('tidak memanggil onChange saat halaman aktif diklik', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Pagination page={4} totalPages={12} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Halaman 4' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('menonaktifkan tombol sebelumnya dan berikutnya di batas', () => {
    const { rerender } = render(<Pagination page={1} totalPages={3} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Halaman sebelumnya' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Halaman berikutnya' })).toBeEnabled()

    rerender(<Pagination page={3} totalPages={3} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Halaman berikutnya' })).toBeDisabled()
  })

  it('tidak merender apa pun bila hanya satu halaman', () => {
    render(<Pagination page={1} totalPages={1} onChange={() => {}} />)
    expect(screen.queryByRole('navigation', { name: 'Navigasi halaman' })).not.toBeInTheDocument()
  })
})
