import { seedCategories } from '@/mocks/categories'
import { seedRecipes } from '@/mocks/recipes'

import { ApiError } from '../errors'
import type { CategoryRepository, CreateCategoryInput, UpdateCategoryInput } from '../repositories'
import type { Category, Recipe } from '../types'
import { simulateLatency } from './latency'
import type { DemoStore } from './store'
import { createId, uniqueSlug } from './utils'

function withRecipeCount(category: Category, recipes: Recipe[]): Category {
  return {
    ...category,
    recipeCount: recipes.filter(
      (recipe) => recipe.categoryId === category.id && recipe.status === 'active',
    ).length,
  }
}

export function createCategoryRepository(store: DemoStore): CategoryRepository {
  function readCategories() {
    return store.read('categories', seedCategories)
  }

  function readRecipes() {
    return store.read('recipes', seedRecipes)
  }

  function writeCategories(categories: Category[]) {
    store.write('categories', categories)
  }

  return {
    async list() {
      await simulateLatency()
      const recipes = readRecipes()
      return readCategories().map((category) => withRecipeCount(category, recipes))
    },

    async getBySlug(slug: string) {
      await simulateLatency()
      const recipes = readRecipes()
      const category = readCategories().find((candidate) => candidate.slug === slug)
      return category ? withRecipeCount(category, recipes) : null
    },

    async create(input: CreateCategoryInput) {
      await simulateLatency()

      const categories = readCategories()
      const name = input.name.trim()

      if (!name) {
        throw new ApiError('VALIDATION', 'Nama kategori wajib diisi.', {
          name: 'Nama kategori wajib diisi.',
        })
      }

      if (categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
        throw new ApiError('CONFLICT', 'Nama kategori sudah dipakai.', {
          name: 'Nama kategori sudah dipakai.',
        })
      }

      const slug = uniqueSlug(
        name,
        categories.map((category) => category.slug),
      )

      const category: Category = {
        id: createId('category'),
        name,
        slug,
        description: input.description.trim(),
        image: input.image ?? `/media/categories/${slug}.webp`,
        status: input.status ?? 'active',
        recipeCount: 0,
      }

      writeCategories([...categories, category])
      return category
    },

    async update(id: string, input: UpdateCategoryInput) {
      await simulateLatency()

      const categories = readCategories()
      const index = categories.findIndex((category) => category.id === id)
      const current = categories[index]

      if (!current) throw new ApiError('NOT_FOUND', 'Kategori tidak ditemukan.')

      const name = input.name?.trim()

      if (
        name &&
        categories.some(
          (category) => category.id !== id && category.name.toLowerCase() === name.toLowerCase(),
        )
      ) {
        throw new ApiError('CONFLICT', 'Nama kategori sudah dipakai.', {
          name: 'Nama kategori sudah dipakai.',
        })
      }

      const updated: Category = {
        ...current,
        name: name || current.name,
        description: input.description?.trim() ?? current.description,
        image: input.image ?? current.image,
        status: input.status ?? current.status,
      }

      const next = [...categories]
      next[index] = updated
      writeCategories(next)

      return withRecipeCount(updated, readRecipes())
    },

    async remove(id: string) {
      await simulateLatency()

      const categories = readCategories()
      if (!categories.some((category) => category.id === id)) {
        throw new ApiError('NOT_FOUND', 'Kategori tidak ditemukan.')
      }

      const used = readRecipes().some((recipe) => recipe.categoryId === id)
      if (used) {
        throw new ApiError('CONFLICT', 'Kategori masih dipakai resep dan tidak dapat dihapus.')
      }

      writeCategories(categories.filter((category) => category.id !== id))
    },
  }
}
