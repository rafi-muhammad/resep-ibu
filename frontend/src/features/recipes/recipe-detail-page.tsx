import { Clock, Flame, Gauge, Timer, Users } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { IngredientList, RecipeGrid, StepList } from '@/components/recipe'
import {
  Badge,
  Breadcrumbs,
  Card,
  ErrorState,
  LinkButton,
  SectionHeader,
  Skeleton,
  useToast,
} from '@/components/ui'
import { buildLoginPath, useAuth } from '@/features/auth'
import type { Recipe } from '@/lib/api/types'
import { NotFoundPage } from '@/pages/not-found-page'

import { SaveRecipeButton, ShareRecipeButton } from './recipe-actions'
import { useRecipeDetail } from './use-recipe-detail'
import { useSavedRecipe } from './use-saved-recipe'

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const difficultyLabels: Record<Recipe['difficulty'], string> = {
  mudah: 'Mudah',
  sedang: 'Sedang',
  sulit: 'Sulit',
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Lanjut ke fallback bila izin clipboard ditolak.
  }

  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const copied = document.execCommand('copy')
    document.body.removeChild(area)
    return copied
  } catch {
    return false
  }
}

function DetailSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <span role="status" className="sr-only">
        Memuat resep…
      </span>
      <Skeleton width={260} height={16} />
      <div className="flex flex-col gap-3">
        <Skeleton width={140} height={24} rounded="full" />
        <Skeleton width="70%" height={44} />
        <Skeleton width="90%" height={20} />
      </div>
      <Skeleton rounded="md" className="aspect-[4/3] w-full" />
    </div>
  )
}

export function RecipeDetailPage() {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, status } = useAuth()
  const { data, loading, notFound, error, retry } = useRecipeDetail(slug)
  const savedRecipe = useSavedRecipe(data?.recipe.id, user?.id)

  async function handleSave() {
    if (!data || status === 'loading') return

    if (!user) {
      toast({
        title: 'Masuk untuk menyimpan resep',
        description: 'Kamu akan kembali ke resep ini setelah masuk.',
        tone: 'info',
      })
      navigate(buildLoginPath(location.pathname))
      return
    }

    try {
      const saved = await savedRecipe.toggle()
      if (saved === null) return

      toast({
        title: saved ? 'Resep disimpan.' : 'Resep dihapus dari simpanan.',
        tone: 'success',
      })
    } catch {
      toast({
        title: 'Resep gagal disimpan',
        description: 'Coba lagi sebentar.',
        tone: 'danger',
      })
    }
  }

  async function handleShare() {
    const copied = await copyText(window.location.href)
    toast(
      copied
        ? { title: 'Tautan disalin.', tone: 'success' }
        : {
            title: 'Tautan tidak bisa disalin otomatis',
            description: 'Salin alamat halaman dari bilah alamat browser.',
            tone: 'danger',
          },
    )
  }

  if (loading) return <DetailSkeleton />

  if (error) {
    return (
      <ErrorState
        title="Resep gagal dimuat"
        description="Halaman resep belum bisa ditampilkan. Coba lagi sebentar."
        onRetry={retry}
      />
    )
  }

  if (notFound || !data) return <NotFoundPage />

  const { recipe, category, author, related } = data
  const totalMinutes = recipe.prepMinutes + recipe.cookMinutes
  const published = dateFormatter.format(new Date(recipe.publishedAt))

  const meta = [
    { label: 'Persiapan', value: `${recipe.prepMinutes} menit`, Icon: Clock },
    { label: 'Memasak', value: `${recipe.cookMinutes} menit`, Icon: Flame },
    { label: 'Total', value: `${totalMinutes} menit`, Icon: Timer },
    { label: 'Porsi', value: `${recipe.servings} porsi`, Icon: Users },
    { label: 'Tingkat', value: difficultyLabels[recipe.difficulty], Icon: Gauge },
  ]

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        items={[
          { label: 'Beranda', to: '/' },
          ...(category ? [{ label: category.name, to: `/kategori/${category.slug}` }] : []),
          { label: recipe.title },
        ]}
      />

      <header className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          {category ? (
            <Link
              to={`/kategori/${category.slug}`}
              className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <Badge tone="accent">{category.name}</Badge>
            </Link>
          ) : (
            <Badge tone="accent">Resep</Badge>
          )}
          <span className="text-small text-muted">Diterbitkan {published}</span>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-3">
            <h1 className="text-h1 text-brown">{recipe.title}</h1>
            <p className="text-lg text-muted">{recipe.excerpt}</p>

            {author ? (
              <div className="mt-1 flex items-center gap-3">
                <img
                  src={author.avatar}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-small font-bold text-brown">{author.name}</span>
                  <span className="text-small text-muted">Kontributor resep</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <SaveRecipeButton
              saved={savedRecipe.saved}
              busy={savedRecipe.busy}
              disabled={savedRecipe.checking || status === 'loading'}
              onToggle={() => void handleSave()}
            />
            <ShareRecipeButton onCopy={() => void handleShare()} />
          </div>
        </div>
      </header>

      <img
        src={recipe.image}
        alt={`Foto hidangan untuk resep ${recipe.title}`}
        width={1200}
        height={900}
        className="aspect-[4/3] max-h-[560px] w-full rounded-lg object-cover"
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="flex flex-col gap-8">
          <section aria-label="Tentang resep" className="flex flex-col gap-3">
            <h2 className="text-h2 text-brown">Tentang resep ini</h2>
            <p className="text-body text-ink">{recipe.story}</p>
          </section>

          <section aria-label="Bahan-bahan" className="flex flex-col gap-4">
            <h2 className="text-h2 text-brown">Bahan-bahan</h2>
            <IngredientList groups={recipe.ingredients} />
          </section>

          <section aria-label="Langkah memasak" className="flex flex-col gap-4">
            <h2 className="text-h2 text-brown">Langkah memasak</h2>
            <StepList steps={recipe.steps} />
          </section>
        </div>

        <aside
          aria-label="Ringkasan resep"
          className="order-first lg:sticky lg:top-24 lg:order-none"
        >
          <Card className="flex flex-col gap-3">
            <h2 className="text-h3 text-brown">Ringkasan</h2>
            <dl className="flex flex-col divide-y divide-border">
              {meta.map(({ label, value, Icon }) => (
                <div key={label} className="flex items-center justify-between gap-3 py-2.5">
                  <dt className="flex items-center gap-2 text-small text-muted">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    {label}
                  </dt>
                  <dd className="text-small font-bold text-brown">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </aside>
      </div>

      {related.length > 0 ? (
        <section aria-label="Resep terkait" className="flex flex-col gap-5">
          <SectionHeader
            title="Resep terkait"
            description="Masakan lain dari kategori yang sama."
            action={
              category ? (
                <LinkButton to={`/kategori/${category.slug}`} variant="secondary" size="sm">
                  Lihat kategori
                </LinkButton>
              ) : null
            }
          />
          <RecipeGrid recipes={related} categories={category ? [category] : []} />
        </section>
      ) : null}
    </div>
  )
}
