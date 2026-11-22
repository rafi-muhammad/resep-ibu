import { BookOpen, HeartHandshake, Sparkles, Users } from 'lucide-react'

import {
  Card,
  EmptyState,
  ErrorState,
  LinkButton,
  PageHeader,
  SectionHeader,
  Skeleton,
} from '@/components/ui'

import { useAbout } from './use-about'

const valueIcons = [BookOpen, Users, Sparkles]

function AboutSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-8">
      <span role="status" className="sr-only">
        Memuat halaman tentang…
      </span>
      <div className="flex flex-col gap-3">
        <Skeleton width={90} height={14} />
        <Skeleton width="55%" height={44} />
        <Skeleton width="80%" height={20} />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton height={18} />
        <Skeleton height={18} />
        <Skeleton width="70%" height={18} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={`value-skeleton-${index}`} rounded="md" className="h-36 w-full" />
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={`team-skeleton-${index}`} rounded="md" className="h-52 w-full" />
        ))}
      </div>
    </div>
  )
}

/** Halaman Tentang Kami: cerita, nilai, tim placeholder, dan CTA kontak. */
export function AboutPage() {
  const { data, loading, error, retry } = useAbout()

  if (loading) return <AboutSkeleton />

  if (error) {
    return (
      <ErrorState
        title="Halaman tentang gagal dimuat"
        description="Cerita dan tim belum bisa ditampilkan. Coba lagi sebentar."
        onRetry={retry}
      />
    )
  }

  if (!data) return null

  const { about, team } = data

  return (
    <div className="flex flex-col gap-10">
      <PageHeader eyebrow="Tentang" title={about.title} description={about.intro} />

      <section aria-label="Cerita Resep Ibu" className="flex max-w-3xl flex-col gap-4">
        <h2 className="text-h2 text-brown">Cerita kami</h2>
        {about.story.map((paragraph, index) => (
          <p key={`story-${index}`} className="text-body text-ink">
            {paragraph}
          </p>
        ))}
      </section>

      <section aria-label="Nilai yang kami pegang" className="flex flex-col gap-5">
        <SectionHeader
          title="Nilai yang kami pegang"
          description="Prinsip sederhana yang membentuk setiap halaman resep."
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {about.values.map((value, index) => {
            const Icon = valueIcons[index % valueIcons.length] ?? BookOpen
            return (
              <li key={value.title} className="h-full">
                <Card as="article" className="flex h-full flex-col gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-brown"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-h3 text-brown">{value.title}</h3>
                  <p className="text-body text-muted">{value.description}</p>
                </Card>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-label="Tim Resep Ibu" className="flex flex-col gap-5">
        <SectionHeader
          title="Tim di balik layar"
          description="Nama dan peran di bawah ini adalah placeholder demo, bukan orang nyata."
        />
        {team.length === 0 ? (
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="Belum ada anggota tim"
            description="Informasi tim akan tampil di sini setelah tersedia."
          />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <li key={member.id} className="h-full">
                <Card as="article" className="flex h-full flex-col gap-4">
                  <img
                    src={member.avatar}
                    alt=""
                    width={64}
                    height={64}
                    loading="lazy"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-h3 text-brown">{member.name}</h3>
                    <p className="text-small font-bold text-action">{member.role}</p>
                  </div>
                  <p className="text-body text-muted">{member.bio}</p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        aria-label="Ajakan menghubungi"
        className="flex flex-col items-start justify-between gap-4 rounded-lg bg-surface p-6 sm:flex-row sm:items-center"
      >
        <div className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2 text-h3 text-brown">
            <HeartHandshake aria-hidden="true" className="h-5 w-5" />
            Punya pertanyaan atau masukan?
          </h2>
          <p className="text-body text-muted">
            Kirim pesan lewat formulir kontak. Pesan masuk ke kotak masuk demo pengelola situs.
          </p>
        </div>
        <LinkButton to="/kontak">Hubungi kami</LinkButton>
      </section>
    </div>
  )
}
