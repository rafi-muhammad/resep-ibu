import { RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button, SearchField, Select } from '@/components/ui'
import type { Category, RecipeSort } from '@/lib/api/types'
import { RECIPE_SORT_OPTIONS } from '@/lib/recipe-sort'

export interface RecipeFiltersProps {
  q: string
  category: string
  sort: RecipeSort
  categories: Category[]
  onQueryChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSortChange: (value: RecipeSort) => void
  onReset: () => void
}

/** Toolbar daftar resep. Input pencarian di-debounce 300 ms sebelum masuk URL. */
export function RecipeFilters({
  q,
  category,
  sort,
  categories,
  onQueryChange,
  onCategoryChange,
  onSortChange,
  onReset,
}: RecipeFiltersProps) {
  const [input, setInput] = useState(q)

  useEffect(() => {
    // Sinkronkan input saat URL berubah lewat back/forward.
    // oxlint-disable-next-line react/set-state-in-effect
    setInput(q)
  }, [q])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (input.trim() !== q) onQueryChange(input.trim())
    }, 300)

    return () => {
      window.clearTimeout(timer)
    }
  }, [input, q, onQueryChange])

  const hasFilters = q !== '' || category !== '' || sort !== 'terbaru'

  return (
    <section
      aria-label="Filter resep"
      className="grid gap-3 rounded-lg border border-border bg-white p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_220px_180px_auto] lg:items-end"
    >
      <div className="flex flex-col gap-1.5">
        <SearchField
          id="recipe-search"
          value={input}
          onValueChange={setInput}
          onSubmit={(value) => {
            setInput(value)
            onQueryChange(value)
          }}
          placeholder="Cari judul atau bahan…"
          buttonLabel="Cari resep"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="recipe-category" className="text-small font-bold text-brown">
          Kategori
        </label>
        <Select
          id="recipe-category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          options={[
            { value: '', label: 'Semua kategori' },
            ...categories.map((item) => ({ value: item.slug, label: item.name })),
          ]}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="recipe-sort" className="text-small font-bold text-brown">
          Urutan
        </label>
        <Select
          id="recipe-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as RecipeSort)}
          options={RECIPE_SORT_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
        />
      </div>

      <Button
        variant="secondary"
        onClick={onReset}
        disabled={!hasFilters}
        leadingIcon={<RotateCcw aria-hidden="true" className="h-4 w-4" />}
        className="w-full lg:w-auto"
      >
        Atur ulang
      </Button>
    </section>
  )
}
