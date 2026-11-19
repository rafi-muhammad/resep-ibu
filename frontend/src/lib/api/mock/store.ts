import type {
  AboutContent,
  Category,
  ContactMessage,
  Recipe,
  TeamMember,
  User,
} from '@/lib/api/types'

export const STORAGE_NAMESPACE = 'resep-ibu:v1:'

export interface ContentState {
  about: AboutContent
  team: TeamMember[]
}

/** Sesi demo: hanya id pengguna dan waktu mulai, tanpa token. */
export interface SessionState {
  userId: string
  startedAt: string
}

/** Salinan kerja demo yang disimpan di localStorage. */
export interface DemoState {
  recipes: Recipe[]
  categories: Category[]
  users: User[]
  messages: ContactMessage[]
  content: ContentState
  saved: Record<string, string[]>
  /** Peta `userId` → hash demo kata sandi. */
  credentials: Record<string, string>
  session: SessionState | null
}

export type DemoKey = keyof DemoState

export const demoKeys: DemoKey[] = [
  'recipes',
  'categories',
  'users',
  'messages',
  'content',
  'saved',
  'credentials',
  'session',
]

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface DemoStore {
  readonly persistent: boolean
  read<K extends DemoKey>(key: K, seed: DemoState[K]): DemoState[K]
  write<K extends DemoKey>(key: K, value: DemoState[K]): void
  remove<K extends DemoKey>(key: K): void
  reset(): void
}

function clone<T>(value: T): T {
  if (typeof structuredClone === 'function') return structuredClone(value)
  return JSON.parse(JSON.stringify(value)) as T
}

function detectStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null

  try {
    const storage = window.localStorage
    const probe = `${STORAGE_NAMESPACE}__probe`
    storage.setItem(probe, '1')
    storage.removeItem(probe)
    return storage
  } catch {
    return null
  }
}

function createMemoryBackend(): StorageLike {
  const memory = new Map<string, string>()

  return {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => {
      memory.set(key, value)
    },
    removeItem: (key) => {
      memory.delete(key)
    },
  }
}

/**
 * Store demo dengan namespace `resep-ibu:v1:`.
 * Bila localStorage tidak tersedia (atau gagal ditulis), data dialihkan
 * ke memori dan `persistent` menjadi false.
 */
export function createDemoStore(storage?: StorageLike | null): DemoStore {
  const detected = storage === undefined ? detectStorage() : storage
  const memoryBackend = createMemoryBackend()
  let backend: StorageLike = detected ?? memoryBackend
  let persistent = detected !== null

  function keyOf(name: DemoKey) {
    return `${STORAGE_NAMESPACE}${name}`
  }

  function fallbackToMemory() {
    if (!persistent) return
    persistent = false
    backend = memoryBackend
  }

  function readRaw(name: DemoKey): string | null {
    try {
      return backend.getItem(keyOf(name))
    } catch {
      fallbackToMemory()
      return backend.getItem(keyOf(name))
    }
  }

  function write<K extends DemoKey>(name: K, value: DemoState[K]): void {
    try {
      backend.setItem(keyOf(name), JSON.stringify(value))
    } catch {
      fallbackToMemory()
      backend.setItem(keyOf(name), JSON.stringify(value))
    }
  }

  function read<K extends DemoKey>(name: K, seed: DemoState[K]): DemoState[K] {
    const raw = readRaw(name)

    if (raw === null) {
      const initial = clone(seed)
      write(name, initial)
      return initial
    }

    try {
      return JSON.parse(raw) as DemoState[K]
    } catch {
      const initial = clone(seed)
      write(name, initial)
      return initial
    }
  }

  function remove<K extends DemoKey>(name: K): void {
    try {
      backend.removeItem(keyOf(name))
    } catch {
      fallbackToMemory()
      backend.removeItem(keyOf(name))
    }
  }

  function reset(): void {
    for (const name of demoKeys) {
      remove(name)
    }
  }

  return {
    get persistent() {
      return persistent
    },
    read,
    write,
    remove,
    reset,
  }
}

let sharedStore: DemoStore | null = null

export function getDemoStore(): DemoStore {
  sharedStore ??= createDemoStore()
  return sharedStore
}
