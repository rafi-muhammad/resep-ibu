import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { seedRecipes } from '@/mocks/recipes'
import { ApiError } from '@/lib/api/errors'
import { createMockRepositories } from '@/lib/api/mock'
import { createDemoStore, STORAGE_NAMESPACE, type StorageLike } from '@/lib/api/mock/store'
import type { CreateRecipeInput } from '@/lib/api/repositories'

class FakeStorage implements StorageLike {
  readonly data = new Map<string, string>()

  getItem(key: string) {
    return this.data.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.data.set(key, value)
  }

  removeItem(key: string) {
    this.data.delete(key)
  }
}

function setup() {
  const store = createDemoStore(null)
  return { store, repositories: createMockRepositories(store) }
}

function createInput(overrides: Partial<CreateRecipeInput> = {}): CreateRecipeInput {
  return {
    title: 'Resep Uji Coba',
    excerpt: 'Ringkasan resep uji.',
    story: 'Cerita resep uji.',
    categoryId: 'category-lainnya',
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 2,
    difficulty: 'mudah',
    ingredients: [{ title: 'Bahan', items: ['200 ml air', '1 sdt garam'] }],
    steps: ['Siapkan bahan.', 'Masak hingga matang.'],
    ...overrides,
  }
}

beforeAll(() => {
  vi.stubEnv('VITE_MOCK_LATENCY', '0')
})

afterAll(() => {
  vi.unstubAllEnvs()
})

describe('fixture', () => {
  it('menyediakan 24 resep, 7 kategori, 4 pengguna, 6 pesan, dan 3 anggota tim', async () => {
    const { repositories } = setup()

    const recipes = await repositories.recipes.list({ perPage: 100 })
    const categories = await repositories.categories.list()
    const users = await repositories.users.list()
    const messages = await repositories.contact.list()
    const team = await repositories.content.listTeam()

    expect(recipes.total).toBe(24)
    expect(categories).toHaveLength(7)
    expect(users).toHaveLength(4)
    expect(messages).toHaveLength(6)
    expect(team).toHaveLength(3)
  })

  it('memakai referensi kategori dan penulis yang valid serta bahan dan langkah terstruktur', async () => {
    const { repositories } = setup()

    const { items: recipes } = await repositories.recipes.list({ perPage: 100 })
    const categories = await repositories.categories.list()
    const users = await repositories.users.list()

    const categoryIds = new Set(categories.map((category) => category.id))
    const userIds = new Set(users.map((user) => user.id))

    for (const recipe of recipes) {
      expect(categoryIds.has(recipe.categoryId)).toBe(true)
      expect(userIds.has(recipe.authorId)).toBe(true)
      expect(recipe.ingredients.length).toBeGreaterThan(0)
      expect(recipe.ingredients.every((group) => group.items.length > 0)).toBe(true)
      expect(recipe.steps.length).toBeGreaterThan(0)
      expect(recipe.status).toBe('active')
    }
  })

  it('tidak memiliki slug, email, atau id ganda', async () => {
    const { repositories } = setup()

    const { items: recipes } = await repositories.recipes.list({ perPage: 100 })
    const categories = await repositories.categories.list()
    const users = await repositories.users.list()

    expect(new Set(recipes.map((recipe) => recipe.slug)).size).toBe(recipes.length)
    expect(new Set(recipes.map((recipe) => recipe.id)).size).toBe(recipes.length)
    expect(new Set(categories.map((category) => category.slug)).size).toBe(categories.length)
    expect(new Set(users.map((user) => user.email)).size).toBe(users.length)
  })

  it('menghitung jumlah resep per kategori dari data, bukan angka statis', async () => {
    const { repositories } = setup()
    const categories = await repositories.categories.list()

    const expected: Record<string, number> = {
      minuman: 3,
      'makanan-penutup': 4,
      'makanan-berkuah': 4,
      'makanan-pedas': 4,
      'makanan-sehat': 4,
      'olahan-buah': 3,
      lainnya: 2,
    }

    for (const category of categories) {
      expect(category.recipeCount).toBe(expected[category.slug])
    }

    expect(categories.reduce((total, category) => total + category.recipeCount, 0)).toBe(24)
  })
})

describe('recipe list', () => {
  it('mengembalikan halaman pertama berisi 12 resep terbaru', async () => {
    const { repositories } = setup()
    const result = await repositories.recipes.list()

    expect(result.items).toHaveLength(12)
    expect(result).toMatchObject({ page: 1, perPage: 12, total: 24, totalPages: 2 })
    expect(result.items[0]?.slug).toBe('ayam-geprek-sambal-bawang')
  })

  it('mengembalikan halaman kedua tanpa duplikasi', async () => {
    const { repositories } = setup()

    const first = await repositories.recipes.list()
    const second = await repositories.recipes.list({ page: 2 })
    const firstIds = new Set(first.items.map((recipe) => recipe.id))

    expect(second.page).toBe(2)
    expect(second.items).toHaveLength(12)
    expect(second.items.every((recipe) => !firstIds.has(recipe.id))).toBe(true)
  })

  it('mendukung perPage dan membatasi halaman di luar rentang', async () => {
    const { repositories } = setup()

    const result = await repositories.recipes.list({ page: 3, perPage: 5 })
    expect(result.items).toHaveLength(5)
    expect(result.page).toBe(3)
    expect(result.totalPages).toBe(5)

    const clamped = await repositories.recipes.list({ page: 99, perPage: 5 })
    expect(clamped.page).toBe(5)
    expect(clamped.items).toHaveLength(4)
  })

  it('mencari judul dan bahan tanpa membedakan huruf besar-kecil', async () => {
    const { repositories } = setup()

    const byTitle = await repositories.recipes.list({ q: 'SOTO' })
    expect(byTitle.total).toBe(1)
    expect(byTitle.items[0]?.slug).toBe('soto-ayam-kampung')

    const byIngredient = await repositories.recipes.list({ q: 'santan' })
    expect(byIngredient.total).toBeGreaterThan(1)
  })

  it('memfilter berdasarkan slug kategori', async () => {
    const { repositories } = setup()
    const result = await repositories.recipes.list({ category: 'makanan-berkuah' })

    expect(result.total).toBe(4)
    expect(result.items.every((recipe) => recipe.categoryId === 'category-makanan-berkuah')).toBe(
      true,
    )
  })

  it('mengembalikan hasil kosong untuk kategori tidak dikenal', async () => {
    const { repositories } = setup()
    const result = await repositories.recipes.list({ category: 'tidak-ada' })

    expect(result).toMatchObject({ items: [], total: 0, totalPages: 0, page: 1 })
  })

  it('mengurutkan A-Z dan berdasarkan popularitas', async () => {
    const { repositories } = setup()

    const az = await repositories.recipes.list({ sort: 'az', perPage: 3 })
    expect(az.items.map((recipe) => recipe.title)).toEqual([
      'Ayam Geprek Sambal Bawang',
      'Bolu Kukus Pandan',
      'Es Buah Campur',
    ])

    const popular = await repositories.recipes.list({ sort: 'populer', perPage: 3 })
    expect(popular.items.map((recipe) => recipe.popularity)).toEqual([96, 94, 91])
  })

  it('memfilter status dan mengembalikan semua status bila tidak diminta', async () => {
    const { repositories } = setup()

    await repositories.recipes.create(createInput(), 'user-dapur')

    const all = await repositories.recipes.list({ perPage: 100 })
    const drafts = await repositories.recipes.list({ status: 'draft' })
    const active = await repositories.recipes.list({ status: 'active' })

    expect(all.total).toBe(25)
    expect(drafts.total).toBe(1)
    expect(active.total).toBe(24)
  })
})

describe('recipe CRUD dan simpan', () => {
  it('membuat resep draft dengan slug dan path gambar turunan', async () => {
    const { repositories } = setup()

    const recipe = await repositories.recipes.create(
      createInput({ title: 'Sambal Uji Spesial' }),
      'user-dapur',
    )

    expect(recipe).toMatchObject({
      slug: 'sambal-uji-spesial',
      status: 'draft',
      popularity: 0,
      image: '/media/recipes/sambal-uji-spesial.webp',
      authorId: 'user-dapur',
    })
    expect(recipe.publishedAt).not.toBe('')

    const found = await repositories.recipes.getBySlug('sambal-uji-spesial')
    expect(found?.id).toBe(recipe.id)
  })

  it('membuat slug unik saat judul sama dipakai dua kali', async () => {
    const { repositories } = setup()

    const first = await repositories.recipes.create(createInput(), 'user-dapur')
    const second = await repositories.recipes.create(createInput(), 'user-dapur')

    expect(first.slug).toBe('resep-uji-coba')
    expect(second.slug).toBe('resep-uji-coba-2')
  })

  it('menolak kategori yang tidak ada', async () => {
    const { repositories } = setup()

    await expect(
      repositories.recipes.create(createInput({ categoryId: 'category-hantu' }), 'user-dapur'),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('mengubah status resep dan menghapusnya', async () => {
    const { repositories } = setup()
    const created = await repositories.recipes.create(createInput(), 'user-dapur')

    const published = await repositories.recipes.updateStatus(created.id, 'active')
    expect(published.status).toBe('active')

    await repositories.recipes.remove(created.id)

    expect(await repositories.recipes.getBySlug(created.slug)).toBeNull()
    expect((await repositories.recipes.list({ perPage: 100 })).total).toBe(24)
  })

  it('menolak update status dan hapus untuk id yang tidak ada', async () => {
    const { repositories } = setup()

    await expect(
      repositories.recipes.updateStatus('recipe-hantu', 'active'),
    ).rejects.toBeInstanceOf(ApiError)
    await expect(repositories.recipes.remove('recipe-hantu')).rejects.toMatchObject({
      code: 'NOT_FOUND',
    })
  })

  it('mengembalikan resep milik penulis', async () => {
    const { repositories } = setup()

    expect(await repositories.recipes.listByAuthor('user-dapur')).toHaveLength(24)
    expect(await repositories.recipes.listByAuthor('user-admin')).toHaveLength(0)
  })

  it('menyimpan dan melepas resep secara idempoten', async () => {
    const { repositories } = setup()
    const recipe = await repositories.recipes.getBySlug('soto-ayam-kampung')

    expect(recipe).not.toBeNull()
    if (!recipe) return

    await repositories.recipes.save('user-pembaca-1', recipe.id)
    await repositories.recipes.save('user-pembaca-1', recipe.id)

    expect(await repositories.recipes.listSaved('user-pembaca-1')).toHaveLength(1)

    await repositories.recipes.unsave('user-pembaca-1', recipe.id)
    await repositories.recipes.unsave('user-pembaca-1', recipe.id)

    expect(await repositories.recipes.listSaved('user-pembaca-1')).toHaveLength(0)
  })

  it('membersihkan resep tersimpan ketika resep dihapus', async () => {
    const { repositories } = setup()
    const created = await repositories.recipes.create(createInput(), 'user-dapur')

    await repositories.recipes.save('user-pembaca-1', created.id)
    await repositories.recipes.remove(created.id)

    expect(await repositories.recipes.listSaved('user-pembaca-1')).toHaveLength(0)
  })

  it('menolak simpan untuk resep atau pengguna yang tidak ada', async () => {
    const { repositories } = setup()

    await expect(repositories.recipes.save('user-pembaca-1', 'recipe-hantu')).rejects.toMatchObject(
      { code: 'NOT_FOUND' },
    )
    await expect(
      repositories.recipes.save('user-hantu', 'recipe-soto-ayam-kampung'),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })
})

describe('category repository', () => {
  it('mengambil kategori berdasarkan slug', async () => {
    const { repositories } = setup()

    const category = await repositories.categories.getBySlug('makanan-pedas')
    expect(category?.name).toBe('Makanan Pedas')
    expect(category?.recipeCount).toBe(4)

    expect(await repositories.categories.getBySlug('tidak-ada')).toBeNull()
  })

  it('membuat, mengubah, dan menghapus kategori yang belum dipakai', async () => {
    const { repositories } = setup()

    const created = await repositories.categories.create({
      name: 'Masakan Kukus',
      description: 'Resep yang dimasak dengan uap.',
    })

    expect(created).toMatchObject({
      slug: 'masakan-kukus',
      status: 'active',
      recipeCount: 0,
      image: '/media/categories/masakan-kukus.webp',
    })

    const updated = await repositories.categories.update(created.id, {
      description: 'Hidangan kukus rumahan.',
      status: 'inactive',
    })
    expect(updated).toMatchObject({
      description: 'Hidangan kukus rumahan.',
      status: 'inactive',
    })

    await repositories.categories.remove(created.id)
    expect(await repositories.categories.getBySlug('masakan-kukus')).toBeNull()
    expect(await repositories.categories.list()).toHaveLength(7)
  })

  it('menolak nama kategori duplikat', async () => {
    const { repositories } = setup()

    await expect(
      repositories.categories.create({ name: 'minuman', description: 'Duplikat.' }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
  })

  it('menolak hapus kategori yang masih dipakai resep', async () => {
    const { repositories } = setup()

    await expect(repositories.categories.remove('category-minuman')).rejects.toMatchObject({
      code: 'CONFLICT',
    })
  })
})

describe('user repository', () => {
  it('memperbarui profil dan mempertahankannya di store', async () => {
    const { repositories } = setup()

    const updated = await repositories.users.updateProfile('user-pembaca-1', {
      name: 'Pembaca Diperbarui',
      bio: 'Bio baru.',
    })

    expect(updated).toMatchObject({ name: 'Pembaca Diperbarui', bio: 'Bio baru.' })
    expect((await repositories.users.getById('user-pembaca-1'))?.name).toBe('Pembaca Diperbarui')
  })

  it('menolak email yang sudah dipakai akun lain', async () => {
    const { repositories } = setup()

    await expect(
      repositories.users.updateProfile('user-pembaca-1', { email: 'admin@resepibu.test' }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
  })

  it('mengubah status pengguna dan mengembalikan null untuk id tidak dikenal', async () => {
    const { repositories } = setup()

    const updated = await repositories.users.updateStatus('user-pembaca-1', 'inactive')
    expect(updated.status).toBe('inactive')
    expect(await repositories.users.getById('user-hantu')).toBeNull()
  })
})

describe('contact repository', () => {
  it('menambahkan pesan baru paling atas dan menormalkan email', async () => {
    const { repositories } = setup()

    const created = await repositories.contact.create({
      name: 'Pengirim Demo',
      email: '  Pengirim@Example.Test ',
      subject: 'Halo',
      message: 'Pesan uji.',
    })

    expect(created).toMatchObject({ email: 'pengirim@example.test', read: false })

    const messages = await repositories.contact.list()
    expect(messages[0]?.id).toBe(created.id)
    expect(messages).toHaveLength(7)
  })

  it('menandai pesan dibaca dan menghapusnya', async () => {
    const { repositories } = setup()

    const read = await repositories.contact.markRead('message-1')
    expect(read.read).toBe(true)

    const unread = await repositories.contact.markRead('message-1', false)
    expect(unread.read).toBe(false)

    await repositories.contact.remove('message-1')
    expect((await repositories.contact.list()).some((message) => message.id === 'message-1')).toBe(
      false,
    )
  })

  it('menolak operasi pada pesan yang tidak ada', async () => {
    const { repositories } = setup()

    await expect(repositories.contact.markRead('message-hantu')).rejects.toMatchObject({
      code: 'NOT_FOUND',
    })
    await expect(repositories.contact.remove('message-hantu')).rejects.toMatchObject({
      code: 'NOT_FOUND',
    })
  })
})

describe('content repository', () => {
  it('mengubah konten tentang', async () => {
    const { repositories } = setup()

    const about = await repositories.content.getAbout()
    expect(about.title).toBe('Tentang Resep Ibu')

    const updated = await repositories.content.updateAbout({
      ...about,
      intro: 'Intro yang diperbarui.',
    })
    expect(updated.intro).toBe('Intro yang diperbarui.')
    expect((await repositories.content.getAbout()).intro).toBe('Intro yang diperbarui.')
  })

  it('menambah, mengubah, dan menghapus anggota tim', async () => {
    const { repositories } = setup()

    const created = await repositories.content.saveTeam({
      name: 'Anggota Uji',
      role: 'Penguji',
      bio: 'Bio uji.',
    })
    expect(created.order).toBe(4)
    expect(created.status).toBe('active')

    const updated = await repositories.content.saveTeam({
      id: created.id,
      name: 'Anggota Uji Diperbarui',
      role: 'Penguji',
      bio: 'Bio uji baru.',
      status: 'inactive',
    })
    expect(updated).toMatchObject({ name: 'Anggota Uji Diperbarui', status: 'inactive' })

    await repositories.content.removeTeam(created.id)
    expect(await repositories.content.listTeam()).toHaveLength(3)
  })

  it('menolak anggota tim yang tidak ada', async () => {
    const { repositories } = setup()

    await expect(
      repositories.content.saveTeam({
        id: 'team-hantu',
        name: 'Tidak Ada',
        role: 'Tidak Ada',
        bio: '',
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })

    await expect(repositories.content.removeTeam('team-hantu')).rejects.toMatchObject({
      code: 'NOT_FOUND',
    })
  })
})

describe('admin summary', () => {
  it('menghitung seluruh angka dari store', async () => {
    const { repositories } = setup()
    const summary = await repositories.admin.getSummary()

    expect(summary).toEqual({
      recipes: 24,
      activeRecipes: 24,
      draftRecipes: 0,
      categories: 7,
      users: 4,
      activeUsers: 3,
      messages: 6,
      unreadMessages: 3,
      teamMembers: 3,
      savedRecipes: 0,
    })
  })

  it('memperbarui angka setelah ada resep draft dan resep tersimpan', async () => {
    const { repositories } = setup()
    const created = await repositories.recipes.create(createInput(), 'user-dapur')
    await repositories.recipes.save('user-pembaca-1', created.id)

    const summary = await repositories.admin.getSummary()
    expect(summary.recipes).toBe(25)
    expect(summary.draftRecipes).toBe(1)
    expect(summary.savedRecipes).toBe(1)
  })
})

describe('persistensi dan reset', () => {
  it('memakai namespace resep-ibu:v1 dan membaca data yang sama dari store baru', async () => {
    const storage = new FakeStorage()
    const first = createMockRepositories(createDemoStore(storage))

    await first.recipes.create(createInput({ title: 'Resep Persisten' }), 'user-dapur')

    const keys = [...storage.data.keys()]
    expect(keys.every((key) => key.startsWith(STORAGE_NAMESPACE))).toBe(true)
    expect(keys).toContain(`${STORAGE_NAMESPACE}recipes`)

    const second = createMockRepositories(createDemoStore(storage))
    const listed = await second.recipes.list({ perPage: 100 })

    expect(listed.total).toBe(25)
    expect(listed.items.some((recipe) => recipe.slug === 'resep-persisten')).toBe(true)
  })

  it('mengembalikan seluruh data ke kondisi awal setelah reset', async () => {
    const storage = new FakeStorage()
    const repositories = createMockRepositories(createDemoStore(storage))

    const created = await repositories.recipes.create(createInput(), 'user-dapur')
    await repositories.recipes.save('user-pembaca-1', created.id)
    await repositories.users.updateProfile('user-pembaca-1', { name: 'Berubah' })
    await repositories.contact.markRead('message-1')

    await repositories.demo.reset()

    expect((await repositories.recipes.list({ perPage: 100 })).total).toBe(24)
    expect(await repositories.recipes.listSaved('user-pembaca-1')).toHaveLength(0)
    expect((await repositories.users.getById('user-pembaca-1'))?.name).toBe('Pembaca Satu')
    expect(
      (await repositories.contact.list()).find((message) => message.id === 'message-1')?.read,
    ).toBe(false)
  })

  it('melaporkan store tidak persisten saat localStorage tidak tersedia', async () => {
    const { repositories } = setup()

    expect(repositories.demo.isPersistent()).toBe(false)

    await repositories.recipes.create(createInput(), 'user-dapur')
    expect((await repositories.recipes.list({ perPage: 100 })).total).toBe(25)
  })

  it('beralih ke memori bila penulisan storage gagal', () => {
    const failing: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
      removeItem: () => {},
    }
    const store = createDemoStore(failing)

    expect(store.persistent).toBe(true)
    const recipes = store.read('recipes', seedRecipes)

    expect(recipes).toHaveLength(24)
    expect(store.persistent).toBe(false)
  })
})
