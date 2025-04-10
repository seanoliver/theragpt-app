import { Thought } from '../thought/types'

/**
 * Represents a reframed thought
 */
export interface Reframe {
  id: string
  userId?: string
  originalThought: Thought
  reframe: string
  explanation: string // Explanation of why this reframe is more realistic/believable
  createdAt: number
  lastReviewed: number | null
  nextReviewDate: number | null
  reviewCount: number
  isFavorite: boolean
  tags: string[]
  category?: string
}

/**
 * Reframe creation parameters
 */
export interface CreateReframeParams {
  originalThought: Thought
  reframe: string
  explanation: string
  userId?: string
  tags?: string[]
  category?: string
}

/**
 * Reframe update parameters
 */
export interface UpdateReframeParams {
  id: string
  reframe?: string
  explanation?: string
  isFavorite?: boolean
  tags?: string[]
  category?: string
}

/**
 * Reframe filter options
 */
export interface ReframeFilterOptions {
  userId?: string
  isFavorite?: boolean
  tags?: string[]
  category?: string
  searchText?: string
  fromDate?: number
  toDate?: number
}

/**
 * Reframe sort options
 */
export enum ReframeSortOption {
  CREATED_DESC = 'created_desc',
  CREATED_ASC = 'created_asc',
  LAST_REVIEWED_DESC = 'last_reviewed_desc',
  LAST_REVIEWED_ASC = 'last_reviewed_asc',
  NEXT_REVIEW_DATE_ASC = 'next_review_date_asc',
  NEXT_REVIEW_DATE_DESC = 'next_review_date_desc',
}