import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button, ToastProvider, useToast } from '@/components/ui'

function Trigger({ duration }: { duration?: number }) {
  const { toast } = useToast()

  return (
    <Button
      onClick={() =>
        toast({
          title: 'Resep tersimpan',
          description: 'Kamu bisa membukanya dari profil.',
          tone: 'success',
          duration,
        })
      }
    >
      Munculkan
    </Button>
  )
}

describe('Toast', () => {
  it('menampilkan toast di dalam live region dan bisa ditutup', async () => {
    const user = userEvent.setup()

    render(
      <ToastProvider>
        <Trigger duration={5000} />
      </ToastProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Munculkan' }))

    expect(screen.getByText('Resep tersimpan')).toBeInTheDocument()
    expect(screen.getByText('Kamu bisa membukanya dari profil.')).toBeInTheDocument()

    const liveRegion = document.querySelector('[aria-live="polite"]')
    expect(liveRegion).not.toBeNull()
    expect(liveRegion).toHaveTextContent('Resep tersimpan')

    await user.click(screen.getByRole('button', { name: 'Tutup notifikasi' }))
    expect(screen.queryByText('Resep tersimpan')).not.toBeInTheDocument()
  })

  it('menghilang otomatis setelah durasi habis', async () => {
    const user = userEvent.setup()

    render(
      <ToastProvider>
        <Trigger duration={40} />
      </ToastProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Munculkan' }))
    expect(screen.getByText('Resep tersimpan')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Resep tersimpan')).not.toBeInTheDocument()
    })
  })

  it('menjalankan aksi lalu menutup toast', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()

    function ActionTrigger() {
      const { toast } = useToast()
      return (
        <Button
          onClick={() =>
            toast({
              title: 'Resep dihapus',
              duration: 5000,
              action: { label: 'Urungkan', onClick: onAction },
            })
          }
        >
          Hapus
        </Button>
      )
    }

    render(
      <ToastProvider>
        <ActionTrigger />
      </ToastProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Hapus' }))
    await user.click(screen.getByRole('button', { name: 'Urungkan' }))

    expect(onAction).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Resep dihapus')).not.toBeInTheDocument()
  })

  it('melempar error bila hook dipakai di luar provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    function Orphan() {
      useToast()
      return null
    }

    expect(() => render(<Orphan />)).toThrow('useToast harus dipakai di dalam ToastProvider')
    consoleError.mockRestore()
  })
})
