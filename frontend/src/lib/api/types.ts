export type Role = 'user' | 'admin'
export type Status = 'active' | 'inactive'
export type RecipeStatus = Status | 'draft'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  bio: string
  avatar: string
  status: Status
  joinedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  status: Status
  recipeCount: number
}

export interface IngredientGroup {
  title?: string
  items: string[]
}

export interface Recipe {
  id: string
  slug: string
  title: string
  excerpt: string
  story: string
  categoryId: string
  authorId: string
  image: string
  prepMinutes: number
  cookMinutes: number
  servings: number
  difficulty: 'mudah' | 'sedang' | 'sulit'
  ingredients: IngredientGroup[]
  steps: string[]
  status: RecipeStatus
  popularity: number
  publishedAt: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  status: Status
  order: number
}

export interface AboutContent {
  title: string
  intro: string
  story: string[]
  values: { title: string; description: string }[]
}

export interface Paginated<T> {
  items: T[]
  page: number
  perPage: number
  total: number
  totalPages: number
}

export type RecipeSort = 'terbaru' | 'populer' | 'az'

/** Angka ringkasan admin; seluruhnya dihitung dari store. */
export interface AdminSummary {
  recipes: number
  activeRecipes: number
  draftRecipes: number
  categories: number
  users: number
  activeUsers: number
  messages: number
  unreadMessages: number
  teamMembers: number
  savedRecipes: number
}
