import type {
  AboutContent,
  AdminSummary,
  Category,
  ContactMessage,
  IngredientGroup,
  Paginated,
  Recipe,
  RecipeSort,
  RecipeStatus,
  Status,
  TeamMember,
  User,
} from './types'
export interface RecipeQuery {
  q?: string
  /** Slug atau ID kategori. */
  category?: string
  sort?: RecipeSort
  page?: number
  perPage?: number
  status?: RecipeStatus
}

export interface CreateRecipeInput {
  title: string
  excerpt: string
  story: string
  categoryId: string
  /** Bila kosong, memakai `/media/recipes/<slug>.webp`. */
  image?: string
  prepMinutes: number
  cookMinutes: number
  servings: number
  difficulty: Recipe['difficulty']
  ingredients: IngredientGroup[]
  steps: string[]
  status?: RecipeStatus
}

export interface CreateCategoryInput {
  name: string
  description: string
  image?: string
  status?: Status
}

export interface UpdateCategoryInput {
  name?: string
  description?: string
  image?: string
  status?: Status
}

export interface UpdateProfileInput {
  name?: string
  email?: string
  bio?: string
  avatar?: string
}

export interface CreateContactMessageInput {
  name: string
  email: string
  subject: string
  message: string
}

export interface TeamMemberInput {
  name: string
  role: string
  bio: string
  avatar?: string
  status?: Status
  order?: number
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface RecipeRepository {
  list(query?: RecipeQuery): Promise<Paginated<Recipe>>
  getBySlug(slug: string): Promise<Recipe | null>
  listByAuthor(authorId: string): Promise<Recipe[]>
  create(input: CreateRecipeInput, authorId: string): Promise<Recipe>
  updateStatus(id: string, status: RecipeStatus): Promise<Recipe>
  remove(id: string): Promise<void>
  listSaved(userId: string): Promise<Recipe[]>
  save(userId: string, recipeId: string): Promise<void>
  unsave(userId: string, recipeId: string): Promise<void>
}

export interface CategoryRepository {
  list(): Promise<Category[]>
  getBySlug(slug: string): Promise<Category | null>
  create(input: CreateCategoryInput): Promise<Category>
  update(id: string, input: UpdateCategoryInput): Promise<Category>
  remove(id: string): Promise<void>
}

export interface UserRepository {
  list(): Promise<User[]>
  getById(id: string): Promise<User | null>
  updateProfile(id: string, input: UpdateProfileInput): Promise<User>
  updateStatus(id: string, status: Status): Promise<User>
}

export interface ContactRepository {
  create(input: CreateContactMessageInput): Promise<ContactMessage>
  list(): Promise<ContactMessage[]>
  markRead(id: string, read?: boolean): Promise<ContactMessage>
  remove(id: string): Promise<void>
}

export interface ContentRepository {
  getAbout(): Promise<AboutContent>
  updateAbout(input: AboutContent): Promise<AboutContent>
  listTeam(): Promise<TeamMember[]>
  saveTeam(input: TeamMemberInput & { id?: string }): Promise<TeamMember>
  removeTeam(id: string): Promise<void>
}

export interface AdminRepository {
  getSummary(): Promise<AdminSummary>
}

export interface DemoRepository {
  reset(): Promise<void>
  isPersistent(): boolean
}

/**
 * Kontrak autentikasi disiapkan untuk M1-07.
 * Implementasi mock tidak dibuat pada M1-06 karena autentikasi di luar scope.
 */
export interface AuthRepository {
  login(email: string, password: string): Promise<User>
  register(input: RegisterInput): Promise<User>
  logout(): Promise<void>
  getSession(): Promise<User | null>
  updateProfile(input: UpdateProfileInput): Promise<User>
  changePassword(currentPassword: string, newPassword: string): Promise<void>
}

export interface Repositories {
  recipes: RecipeRepository
  categories: CategoryRepository
  users: UserRepository
  contact: ContactRepository
  content: ContentRepository
  admin: AdminRepository
  auth: AuthRepository
  demo: DemoRepository
}
