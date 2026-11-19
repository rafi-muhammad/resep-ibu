import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Checkbox, FileInput, Input, SearchField, Select, Textarea } from '@/components/ui'

const options = [
  { value: 'minuman', label: 'Minuman' },
  { value: 'berkuah', label: 'Makanan Berkuah' },
]

describe('Input', () => {
  it('menerima input keyboard dan dapat difokus dengan Tab', async () => {
    const user = userEvent.setup()
    render(<Input aria-label="Nama" />)

    await user.tab()
    const input = screen.getByRole('textbox', { name: 'Nama' })
    expect(input).toHaveFocus()

    await user.keyboard('Resep Ibu')
    expect(input).toHaveValue('Resep Ibu')
  })

  it('menandai state invalid', () => {
    render(<Input aria-label="Email" invalid />)
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-invalid', 'true')
  })
})

describe('Textarea', () => {
  it('mendukung input multi-baris dan fokus keyboard', async () => {
    const user = userEvent.setup()
    render(<Textarea aria-label="Langkah" />)

    await user.tab()
    const textarea = screen.getByRole('textbox', { name: 'Langkah' })
    expect(textarea).toHaveFocus()

    await user.type(textarea, 'Panaskan minyak.{Enter}Goreng bawang.')
    expect(textarea).toHaveValue('Panaskan minyak.\nGoreng bawang.')
  })
})

describe('Select', () => {
  it('dapat dipilih dengan keyboard', async () => {
    const user = userEvent.setup()
    render(<Select aria-label="Kategori" options={options} defaultValue="minuman" />)

    await user.tab()
    const select = screen.getByRole('combobox', { name: 'Kategori' })
    expect(select).toHaveFocus()

    await user.selectOptions(select, 'berkuah')
    expect(select).toHaveValue('berkuah')
  })

  it('menampilkan placeholder dan state invalid', () => {
    render(<Select aria-label="Kategori" options={options} placeholder="Pilih kategori" invalid />)

    const select = screen.getByRole('combobox', { name: 'Kategori' })
    expect(select).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('option', { name: 'Pilih kategori' })).toBeDisabled()
  })
})

describe('Checkbox', () => {
  it('dapat dicentang dengan keyboard dan label dikaitkan', async () => {
    const user = userEvent.setup()
    render(<Checkbox id="setuju" label="Saya setuju" description="Data hanya untuk demo." />)

    await user.tab()
    const checkbox = screen.getByRole('checkbox', { name: /saya setuju/i })
    expect(checkbox).toHaveFocus()
    expect(checkbox).not.toBeChecked()

    await user.keyboard(' ')
    expect(checkbox).toBeChecked()
  })
})

describe('FileInput', () => {
  it('menerima file yang sesuai dan menampilkan namanya', async () => {
    const user = userEvent.setup()
    const onFile = vi.fn()
    const file = new File(['gambar'], 'resep.png', { type: 'image/png' })

    render(<FileInput id="foto" accept="image/png" onFile={onFile} />)

    const input = screen.getByLabelText(/pilih foto/i)
    await user.upload(input, file)

    expect(onFile).toHaveBeenCalledWith(file)
    expect(screen.getByText('resep.png')).toBeInTheDocument()
  })

  it('menolak file yang terlalu besar dan mengumumkan error', async () => {
    const user = userEvent.setup()
    const onFile = vi.fn()
    const maxSize = 1_048_577
    const file = new File([new Uint8Array(maxSize + 1)], 'besar.png', { type: 'image/png' })

    render(<FileInput id="foto" accept="image/png" maxSize={maxSize} onFile={onFile} />)

    await user.upload(screen.getByLabelText(/pilih foto/i), file)

    expect(onFile).toHaveBeenLastCalledWith(null)
    expect(screen.getByRole('alert')).toHaveTextContent('Ukuran file melebihi 1 MB.')
  })

  it('menolak format yang tidak didukung saat file diberikan langsung', () => {
    const onFile = vi.fn()
    const file = new File(['isi'], 'dokumen.pdf', { type: 'application/pdf' })

    render(<FileInput id="foto" accept="image/png,image/jpeg" onFile={onFile} />)

    fireEvent.change(screen.getByLabelText(/pilih foto/i), { target: { files: [file] } })

    expect(onFile).toHaveBeenLastCalledWith(null)
    expect(screen.getByRole('alert')).toHaveTextContent('Format file tidak didukung.')
  })
})

describe('SearchField', () => {
  it('mengirim nilai yang sudah di-trim saat Enter ditekan', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<SearchField onSubmit={onSubmit} />)

    const input = screen.getByRole('searchbox', { name: 'Cari resep' })
    await user.type(input, '  soto  ')
    await user.keyboard('{Enter}')

    expect(onSubmit).toHaveBeenCalledWith('soto')
  })

  it('mengirim lewat tombol cari dan mendukung mode controlled', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<SearchField value="rendang" onValueChange={() => {}} onSubmit={onSubmit} />)

    expect(screen.getByRole('searchbox', { name: 'Cari resep' })).toHaveValue('rendang')
    await user.click(screen.getByRole('button', { name: 'Cari' }))

    expect(onSubmit).toHaveBeenCalledWith('rendang')
  })
})
