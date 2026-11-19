import { Card, PageHeader } from '@/components/ui'

export interface PlaceholderPageProps {
  eyebrow?: string
  title: string
  description?: string
}

/**
 * Kerangka halaman sementara untuk route Phase 1.
 * Konten final diisi pada issue fitur masing-masing.
 */
export function PlaceholderPage({ eyebrow, title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description ?? 'Halaman ini sedang disiapkan.'}
      />

      <Card className="flex max-w-2xl flex-col gap-2">
        <p className="font-bold text-brown">Konten menyusul</p>
        <p className="text-body text-muted">
          Struktur, navigasi, dan layout halaman ini sudah siap. Isi dan interaksi akan ditambahkan
          pada issue berikutnya.
        </p>
      </Card>
    </div>
  )
}
