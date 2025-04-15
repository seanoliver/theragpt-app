/**
 * Represents an affirmation
 */
export interface Affirmation {
  id: string
  text: string
  createdAt: number
  lastReviewed: number | null
  isActive: boolean
  isFavorite: boolean
  tags: string[]
}

/**
 * Affirmation creation parameters
 */
export interface CreateAffirmationParams {
  text: string
  tags?: string[]
}

/**
 * Affirmation update parameters
 */
export interface UpdateAffirmationParams {
  id: string
  text?: string
  isActive?: boolean
  isFavorite?: boolean
  tags?: string[]
}