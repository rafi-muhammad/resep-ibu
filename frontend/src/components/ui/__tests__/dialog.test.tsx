import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Button, ConfirmDialog, Dialog } from '@/components/ui'

function ConfirmHarness() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Hapus resep</Button>
      <ConfirmDialog
        open={open}
        title="Hapus resep?"
        description="Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        tone="danger"
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}

describe('Dialog', () => {
  it('membuka dialog dengan role, aria-modal, dan fokus awal', async () => {
    const user = userEvent.setup()
    render(<ConfirmHarness />)

    await user.click(screen.getByRole('button', { name: 'Hapus resep' }))

    const dialog = screen.getByRole('dialog', { name: 'Hapus resep?' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveFocus()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('menutup dengan Escape dan mengembalikan fokus ke pemicu', async () => {
    const user = userEvent.setup()
    render(<ConfirmHarness />)

    const opener = screen.getByRole('button', { name: 'Hapus resep' })
    await user.click(opener)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('menahan fokus di dalam panel saat Tab dan Shift+Tab', async () => {
    const user = userEvent.setup()
    render(<ConfirmHarness />)

    await user.click(screen.getByRole('button', { name: 'Hapus resep' }))

    const close = screen.getByRole('button', { name: 'Tutup dialog' })
    const cancel = screen.getByRole('button', { name: 'Batal' })
    const confirm = screen.getByRole('button', { name: 'Hapus' })

    confirm.focus()
    await user.tab()
    expect(close).toHaveFocus()

    await user.tab({ shift: true })
    expect(confirm).toHaveFocus()

    await user.tab()
    expect(close).toHaveFocus()

    cancel.focus()
    await user.tab()
    expect(confirm).toHaveFocus()
  })

  it('menjalankan aksi konfirmasi dan batal', async () => {
    const user = userEvent.setup()
    render(<ConfirmHarness />)

    await user.click(screen.getByRole('button', { name: 'Hapus resep' }))
    await user.click(screen.getByRole('button', { name: 'Batal' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Hapus resep' }))
    await user.click(screen.getByRole('button', { name: 'Hapus' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('menutup lewat backdrop hanya jika diizinkan', async () => {
    const user = userEvent.setup()

    function BackdropHarness() {
      const [open, setOpen] = useState(true)
      return (
        <Dialog open={open} onClose={() => setOpen(false)} title="Panel uji" closeOnBackdrop>
          Isi panel
        </Dialog>
      )
    }

    render(<BackdropHarness />)

    const dialog = screen.getByRole('dialog')
    const backdrop = dialog.parentElement
    expect(backdrop).not.toBeNull()

    await user.click(backdrop as HTMLElement)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('tidak merender apa pun saat tertutup', () => {
    render(
      <Dialog open={false} onClose={() => {}} title="Tertutup">
        Isi
      </Dialog>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
