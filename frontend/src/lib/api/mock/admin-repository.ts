import { seedCategories } from '@/mocks/categories'
import { seedAbout, seedTeam } from '@/mocks/content'
import { seedMessages } from '@/mocks/messages'
import { seedRecipes } from '@/mocks/recipes'
import { seedUsers } from '@/mocks/users'

import type { AdminRepository } from '../repositories'
import { simulateLatency } from './latency'
import type { DemoStore } from './store'

export function createAdminRepository(store: DemoStore): AdminRepository {
  return {
    async getSummary() {
      await simulateLatency()

      const recipes = store.read('recipes', seedRecipes)
      const categories = store.read('categories', seedCategories)
      const users = store.read('users', seedUsers)
      const messages = store.read('messages', seedMessages)
      const saved = store.read('saved', {})
      const team = store.read('content', { about: seedAbout, team: seedTeam }).team

      return {
        recipes: recipes.length,
        activeRecipes: recipes.filter((recipe) => recipe.status === 'active').length,
        draftRecipes: recipes.filter((recipe) => recipe.status === 'draft').length,
        categories: categories.length,
        users: users.length,
        activeUsers: users.filter((user) => user.status === 'active').length,
        messages: messages.length,
        unreadMessages: messages.filter((message) => !message.read).length,
        teamMembers: team.length,
        savedRecipes: Object.values(saved).reduce((total, ids) => total + ids.length, 0),
      }
    },
  }
}
