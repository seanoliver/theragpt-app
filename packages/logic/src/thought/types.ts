// Thought-related types

/**
 * Represents a user's thought for analysis
 */
export interface Thought {
  id: string
  content: string
  context?: string
  userId?: string
  createdAt: number // Timestamp
}

/**
 * Represents a cognitive distortion identified in a thought
 */
export interface CognitiveDistortion {
  id: string
  name: string
  explanation: string // Why this distortion might be present in the thought
  confidence?: number // 0-1 value representing confidence level
  reframeIds: string[] // IDs of reframes associated with this distortion
}

/**
 * Represents a complete thought entry with its distortions
 */
export interface ThoughtEntry {
  id: string
  thought: Thought
  distortions: CognitiveDistortion[]
  createdAt: number
  updatedAt: number
  tags: string[]
  category?: string
}

/**
 * Represents the result of thought analysis from the LLM
 */
export interface ThoughtAnalysis {
  originalThought: Thought
  distortions: CognitiveDistortion[]
  explanation: string
}

/**
 * Validation result for a thought
 */
export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Parameters for creating a new thought
 */
export interface CreateThoughtParams {
  content: string
  context?: string
  userId?: string
  tags?: string[]
  category?: string
}

/**
 * Parameters for updating a thought
 */
export interface UpdateThoughtParams {
  id: string
  content?: string
  context?: string
  tags?: string[]
  category?: string
}

/**
 * Parameters for adding a distortion to a thought
 */
export interface AddDistortionParams {
  thoughtId: string
  name: string
  explanation: string
  confidence: number
}

/**
 * Parameters for associating a reframe with a distortion
 */
export interface AssociateReframeParams {
  distortionId: string
  reframeId: string
}

/**
 * Filter options for retrieving thoughts
 */
export interface ThoughtFilterOptions {
  userId?: string
  tags?: string[]
  category?: string
  searchText?: string
  fromDate?: number
  toDate?: number
  hasDistortions?: boolean
}

/**
 * Sort options for thoughts
 */
export enum ThoughtSortOption {
  CREATED_DESC = 'created_desc',
  CREATED_ASC = 'created_asc',
  UPDATED_DESC = 'updated_desc',
  UPDATED_ASC = 'updated_asc',
}