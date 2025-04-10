import { Thought, CognitiveDistortion, ThoughtAnalysis } from '../thought/types'

/**
 * Supported LLM providers
 */
export enum LLMProvider {
  OPENAI = 'openai',
  // Future providers can be added here
}

/**
 * Thought analysis request
 */
export interface ThoughtAnalysisRequest {
  thought: Thought | string
  context?: string
  provider?: LLMProvider // Optional, defaults to configured default provider
}

/**
 * Thought analysis response
 */
export interface ThoughtAnalysisResponse {
  success: boolean
  data?: ThoughtAnalysis
  error?: string
}

/**
 * Error types for API calls
 */
export enum APIErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  PARSING_ERROR = 'PARSING_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * API error class
 */
export class APIError extends Error {
  type: APIErrorType
  statusCode?: number

  constructor(message: string, type: APIErrorType, statusCode?: number) {
    super(message)
    this.name = 'APIError'
    this.type = type
    this.statusCode = statusCode
  }
}