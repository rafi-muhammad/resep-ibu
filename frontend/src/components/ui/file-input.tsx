import { Upload } from 'lucide-react'
import { useId, useState, type ChangeEvent, type DragEvent } from 'react'

import { cn } from '@/lib/cn'

export interface FileInputProps {
  id?: string
  accept?: string
  /** Ukuran maksimum dalam byte. Default 5 MB. */
  maxSize?: number
  onFile: (file: File | null) => void
  invalid?: boolean
  disabled?: boolean
  className?: string
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true

  return accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith('.')) return file.name.toLowerCase().endsWith(token)
      if (token.endsWith('/*')) return file.type.toLowerCase().startsWith(token.slice(0, -1))
      return file.type.toLowerCase() === token
    })
}

export function FileInput({
  id,
  accept,
  maxSize = 5 * 1024 * 1024,
  onFile,
  invalid = false,
  disabled = false,
  className,
}: FileInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleFile(file: File | null) {
    if (!file) return

    if (!matchesAccept(file, accept)) {
      setFileName(null)
      setError('Format file tidak didukung.')
      onFile(null)
      return
    }

    if (file.size > maxSize) {
      setFileName(null)
      setError(`Ukuran file melebihi ${Math.round(maxSize / (1024 * 1024))} MB.`)
      onFile(null)
      return
    }

    setError(null)
    setFileName(file.name)
    onFile(file)
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    if (file) handleFile(file)
    else {
      setFileName(null)
      setError(null)
      onFile(null)
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    if (disabled) return
    handleFile(event.dataTransfer.files?.[0] ?? null)
  }

  return (
    <div className={className}>
      <div
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'rounded-md border border-dashed bg-white p-4 transition-colors duration-fast focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus',
          dragging ? 'border-action bg-surface' : 'border-field-border',
          (invalid || error) && 'border-danger',
          disabled && 'cursor-not-allowed opacity-[0.55]',
        )}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          disabled={disabled}
          aria-invalid={invalid || Boolean(error) || undefined}
          onChange={handleChange}
          className="sr-only"
        />
        <label
          htmlFor={inputId}
          className={cn(
            'flex flex-col items-center gap-2 text-center',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          <Upload aria-hidden="true" className="h-6 w-6 text-brown" />
          <span className="font-bold text-brown">Pilih foto</span>
          <span className="text-small text-muted">atau seret file ke sini</span>
          {fileName ? <span className="text-small text-ink">{fileName}</span> : null}
        </label>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-small text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
