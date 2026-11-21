import { Bookmark, BookmarkCheck, Link2 } from 'lucide-react'

import { Button } from '@/components/ui'

export interface SaveRecipeButtonProps {
  saved: boolean
  busy?: boolean
  disabled?: boolean
  onToggle: () => void
}

export function SaveRecipeButton({ saved, busy, disabled, onToggle }: SaveRecipeButtonProps) {
  return (
    <Button
      variant={saved ? 'primary' : 'secondary'}
      aria-pressed={saved}
      onClick={onToggle}
      loading={busy}
      disabled={disabled || busy}
      leadingIcon={
        saved ? (
          <BookmarkCheck aria-hidden="true" className="h-5 w-5" />
        ) : (
          <Bookmark aria-hidden="true" className="h-5 w-5" />
        )
      }
    >
      {saved ? 'Tersimpan' : 'Simpan resep'}
    </Button>
  )
}

export interface ShareRecipeButtonProps {
  onCopy: () => void
}

export function ShareRecipeButton({ onCopy }: ShareRecipeButtonProps) {
  return (
    <Button
      variant="secondary"
      onClick={onCopy}
      leadingIcon={<Link2 aria-hidden="true" className="h-5 w-5" />}
    >
      Salin tautan
    </Button>
  )
}
