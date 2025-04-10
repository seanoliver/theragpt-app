// Thought-related types

/**
 * Represents a user's thought for analysis
 */
export interface Thought {
  content: string
  context?: string
  userId?: string
  createdAt: number // Timestamp
}

/**
 * Represents a cognitive distortion identified in a thought
 */
export interface CognitiveDistortion {
  name: string
  explanation: string
  confidence: number // 0-1 value representing confidence level
}

/**
 * Represents the result of thought analysis
 */
export interface ThoughtAnalysis {
  originalThought: Thought
  distortions: CognitiveDistortion[]
  reframes: string[]
  explanation: string
}

/**
 * Validation result for a thought
 */
export interface ValidationResult {
  valid: boolean
  error?: string
}