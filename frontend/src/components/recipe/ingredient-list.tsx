import type { IngredientGroup } from '@/lib/api/types'

export interface IngredientListProps {
  groups: IngredientGroup[]
}

/** Bahan terkelompok dengan list semantik; judul grup opsional. */
export function IngredientList({ groups }: IngredientListProps) {
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group, groupIndex) => (
        <section
          key={`${group.title ?? 'bahan'}-${groupIndex}`}
          aria-label={group.title ?? `Bahan ${groupIndex + 1}`}
          className="flex flex-col gap-2"
        >
          {group.title ? <h3 className="text-h3 text-brown">{group.title}</h3> : null}
          <ul className="flex flex-col divide-y divide-border">
            {group.items.map((item, itemIndex) => (
              <li
                key={`${item}-${itemIndex}`}
                className="flex items-start gap-3 py-2.5 text-body text-ink"
              >
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
