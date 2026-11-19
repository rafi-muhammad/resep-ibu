import type { Repositories } from '../repositories'
import { createAdminRepository } from './admin-repository'
import { createAuthRepository } from './auth-repository'
import { createCategoryRepository } from './category-repository'
import { createContactRepository } from './contact-repository'
import { createContentRepository } from './content-repository'
import { createDemoRepository } from './demo-repository'
import { createRecipeRepository } from './recipe-repository'
import { getDemoStore, type DemoStore } from './store'
import { createUserRepository } from './user-repository'

export { createDemoStore, STORAGE_NAMESPACE, type DemoStore } from './store'
export { DEMO_PASSWORD } from './auth-repository'

/** Merakit seluruh adapter mock di atas satu store. */
export function createMockRepositories(store: DemoStore = getDemoStore()): Repositories {
  return {
    recipes: createRecipeRepository(store),
    categories: createCategoryRepository(store),
    users: createUserRepository(store),
    contact: createContactRepository(store),
    content: createContentRepository(store),
    admin: createAdminRepository(store),
    auth: createAuthRepository(store),
    demo: createDemoRepository(store),
  }
}

/** Instance tunggal untuk aplikasi; UI hanya mengimpor dari `@/lib/api`. */
export const repositories = createMockRepositories()
