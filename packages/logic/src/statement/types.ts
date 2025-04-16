/**
 * Represents a statement
 */
export interface Statement {
  id: string
  text: string
  createdAt: number
  lastReviewed: number | null
  isActive: boolean
  isFavorite: boolean
  tags: string[]
}

/**
 * Statement creation parameters
 */
export interface CreateStatementParams {
  text: string
  tags?: string[]
}

/**
 * Statement update parameters
 */
export interface UpdateStatementParams {
  id: string
  text?: string
  isActive?: boolean
  isFavorite?: boolean
  tags?: string[]
}