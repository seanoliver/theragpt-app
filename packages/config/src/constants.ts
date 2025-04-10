// Application constants
export const APP_NAME = 'TheraGPT'

// Thought validation constants
export const MAX_THOUGHT_LENGTH = 500
export const MAX_CONTEXT_LENGTH = 1000

// SRS constants
export const MIN_INTERVAL = 24 * 60 * 60 * 1000 // 1 day in milliseconds
export const MAX_INTERVAL = 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds
export const DEFAULT_INITIAL_INTERVAL = 24 * 60 * 60 * 1000 // 1 day in milliseconds

// Difficulty multipliers for SRS
export const DIFFICULTY_MULTIPLIERS = {
  easy: 2.5,
  medium: 1.5,
  hard: 1.2,
}

// API rate limiting
export const MAX_API_REQUESTS_PER_MINUTE = 10
export const MAX_API_REQUESTS_PER_DAY = 100