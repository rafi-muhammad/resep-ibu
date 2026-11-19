import { seedCategories } from '@/mocks/categories'
import { seedRecipes } from '@/mocks/recipes'
import { seedUsers } from '@/mocks/users'

import { ApiError } from '../errors'
import type { CreateRecipeInput, RecipeQuery, RecipeRepository } from '../repositories'
import type { Recipe, RecipeStatus } from '../types'
import { simulateLatency } from './latency'
import type { DemoStore } from './store'
import { createId, nowIso, uniqueSlug } from './utils'

function matchesSearch(recipe: Recipe, query: string) {
  const haystack = [
    recipe.title,
    recipe.excerpt,
    recipe.story,
    ...recipe.ingredients.flatMap((group) => [group.title ?? '', ...group.items]),
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(query)
}

export function createRecipeRepository(store: DemoStore): RecipeRepository {
  function readRecipes() {
    return store.read('recipes', seedRecipes)
  }

  function writeRecipes(recipes: Recipe[]) {
    store.write('recipes', recipes)
  }

  return {
    async list(query: RecipeQuery = {}) {
      await simulateLatency()

      const recipes = readRecipes()
      const categories = store.read('categories', seedCategories)
      const search = query.q?.trim().toLowerCase() ?? ''

      let items = [...recipes]

      if (query.status) {
        items = items.filter((recipe) => recipe.status === query.status)
      }

      if (query.category) {
        const category = categories.find(
          (candidate) => candidate.slug === query.category || candidate.id === query.category,
        )
        items = category ? items.filter((recipe) => recipe.categoryId === category.id) : []
      }

      if (search) {
        items = items.filter((recipe) => matchesSearch(recipe, search))
      }

      switch (query.sort ?? 'terbaru') {
        case 'populer':
          items.sort((a, b) => b.popularity - a.popularity || a.title.localeCompare(b.title, 'id'))
          break
        case 'az':
          items.sort((a, b) => a.title.localeCompare(b.title, 'id'))
          break
        default:
          items.sort(
            (a, b) =>
              b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title, 'id'),
          )
      }

      const perPage = Math.max(1, Math.floor(query.perPage ?? 12))
      const total = items.length
      const totalPages = Math.ceil(total / perPage)
      const page = Math.min(Math.max(1, Math.floor(query.page ?? 1)), Math.max(1, totalPages))
      const start = (page - 1) * perPage

      return {
        items: items.slice(start, start + perPage),
        page,
        perPage,
        total,
        totalPages,
      }
    },

    async getBySlug(slug: string) {
      await simulateLatency()
      return readRecipes().find((recipe) => recipe.slug === slug) ?? null
    },

    async listByAuthor(authorId: string) {
      await simulateLatency()
      return readRecipes()
        .filter((recipe) => recipe.authorId === authorId)
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    },

    async create(input: CreateRecipeInput, authorId: string) {
      await simulateLatency()

      const recipes = readRecipes()
      const categories = store.read('categories', seedCategories)
      const users = store.read('users', seedUsers)

      if (!input.title.trim()) {
        throw new ApiError('VALIDATION', 'Judul resep wajib diisi.', {
          title: 'Judul resep wajib diisi.',
        })
      }

      if (!categories.some((category) => category.id === input.categoryId)) {
        throw new ApiError('VALIDATION', 'Kategori tidak ditemukan.', {
          categoryId: 'Pilih kategori yang tersedia.',
        })
      }

      if (!users.some((user) => user.id === authorId)) {
        throw new ApiError('VALIDATION', 'Penulis tidak ditemukan.', {
          authorId: 'Penulis tidak ditemukan.',
        })
      }

      const slug = uniqueSlug(
        input.title,
        recipes.map((recipe) => recipe.slug),
      )

      const recipe: Recipe = {
        id: createId('recipe'),
        slug,
        title: input.title.trim(),
        excerpt: input.excerpt.trim(),
        story: input.story.trim(),
        categoryId: input.categoryId,
        authorId,
        image: input.image ?? `/media/recipes/${slug}.webp`,
        prepMinutes: Math.max(0, input.prepMinutes),
        cookMinutes: Math.max(0, input.cookMinutes),
        servings: Math.max(1, input.servings),
        difficulty: input.difficulty,
        ingredients: input.ingredients,
        steps: input.steps,
        status: input.status ?? 'draft',
        popularity: 0,
        publishedAt: nowIso(),
      }

      writeRecipes([...recipes, recipe])
      return recipe
    },

    async updateStatus(id: string, status: RecipeStatus) {
      await simulateLatency()

      const recipes = readRecipes()
      const index = recipes.findIndex((recipe) => recipe.id === id)

      if (index === -1) throw new ApiError('NOT_FOUND', 'Resep tidak ditemukan.')

      const current = recipes[index]
      if (!current) throw new ApiError('NOT_FOUND', 'Resep tidak ditemukan.')

      const updated: Recipe = { ...current, status }
      const next = [...recipes]
      next[index] = updated
      writeRecipes(next)
      return updated
    },

    async remove(id: string) {
      await simulateLatency()

      const recipes = readRecipes()
      if (!recipes.some((recipe) => recipe.id === id)) {
        throw new ApiError('NOT_FOUND', 'Resep tidak ditemukan.')
      }

      writeRecipes(recipes.filter((recipe) => recipe.id !== id))

      const saved = store.read('saved', {})
      const cleaned = Object.fromEntries(
        Object.entries(saved).map(([userId, recipeIds]) => [
          userId,
          recipeIds.filter((recipeId) => recipeId !== id),
        ]),
      )
      store.write('saved', cleaned)
    },

    async listSaved(userId: string) {
      await simulateLatency()

      const saved = store.read('saved', {})
      const ids = saved[userId] ?? []
      const recipes = readRecipes()
      return ids
        .map((id) => recipes.find((recipe) => recipe.id === id))
        .filter((recipe): recipe is Recipe => Boolean(recipe))
    },

    async save(userId: string, recipeId: string) {
      await simulateLatency()

      const users = store.read('users', seedUsers)
      if (!users.some((user) => user.id === userId)) {
        throw new ApiError('NOT_FOUND', 'Pengguna tidak ditemukan.')
      }

      if (!readRecipes().some((recipe) => recipe.id === recipeId)) {
        throw new ApiError('NOT_FOUND', 'Resep tidak ditemukan.')
      }

      const saved = store.read('saved', {})
      const current = saved[userId] ?? []
      if (current.includes(recipeId)) return

      store.write('saved', { ...saved, [userId]: [...current, recipeId] })
    },

    async unsave(userId: string, recipeId: string) {
      await simulateLatency()

      const saved = store.read('saved', {})
      const current = saved[userId] ?? []
      if (!current.includes(recipeId)) return

      store.write('saved', {
        ...saved,
        [userId]: current.filter((id) => id !== recipeId),
      })
    },
  }
}
