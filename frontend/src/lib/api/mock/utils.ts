let idCounter = 0

export function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }

  idCounter += 1
  return `${prefix}-${Date.now()}-${idCounter}`
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Menambahkan sufiks angka bila slug sudah dipakai. */
export function uniqueSlug(base: string, taken: string[]): string {
  const normalized = slugify(base) || 'item'
  if (!taken.includes(normalized)) return normalized

  let index = 2
  while (taken.includes(`${normalized}-${index}`)) index += 1
  return `${normalized}-${index}`
}

export function nowIso(): string {
  return new Date().toISOString()
}
