import { thoughtValidator } from '../thought/validation'
import { Thought } from '../thought/types'
import {
  APIError,
  APIErrorType,
  LLMProvider,
  ThoughtAnalysisRequest,
  ThoughtAnalysisResponse,
} from './types'

/**
 * Configuration for the API service
 */
interface APIServiceConfig {
  baseUrl: string
  defaultProvider: LLMProvider
  maxRetries: number
  retryDelay: number // in milliseconds
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: APIServiceConfig = {
  baseUrl: '/api',
  defaultProvider: LLMProvider.OPENAI,
  maxRetries: 3,
  retryDelay: 1000,
}

/**
 * Service for handling API requests to the backend
 */
export class APIService {
  private config: APIServiceConfig

  constructor(config: Partial<APIServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Analyzes a thought using the configured LLM provider
   * @param request The thought analysis request
   * @returns The thought analysis response
   */
  public async analyzeThought(
    request: ThoughtAnalysisRequest
  ): Promise<ThoughtAnalysisResponse> {
    // Validate the thought
    const thought = typeof request.thought === 'string'
      ? request.thought
      : request.thought.content

    const validationResult = thoughtValidator.validateContent(thought)
    if (!validationResult.valid) {
      throw new APIError(
        validationResult.error || 'Invalid thought',
        APIErrorType.VALIDATION_ERROR
      )
    }

    // Prepare the request
    const provider = request.provider || this.config.defaultProvider
    const endpoint = `${this.config.baseUrl}/analyze`

    // Make the request with retry logic
    return this.makeRequestWithRetry(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        thought: request.thought,
        context: request.context,
        provider,
      }),
    })
  }

  /**
   * Makes an API request with retry logic
   * @param url The URL to request
   * @param options The fetch options
   * @returns The parsed response
   */
  private async makeRequestWithRetry(
    url: string,
    options: RequestInit
  ): Promise<ThoughtAnalysisResponse> {
    let lastError: Error | null = null
    let retries = 0

    while (retries < this.config.maxRetries) {
      try {
        const response = await fetch(url, options)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new APIError(
            errorData.error || `API request failed with status ${response.status}`,
            APIErrorType.API_ERROR,
            response.status
          )
        }

        const data = await response.json()
        return data as ThoughtAnalysisResponse
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Don't retry validation errors
        if (error instanceof APIError && error.type === APIErrorType.VALIDATION_ERROR) {
          throw error
        }

        // Increment retry counter
        retries++

        // If we have more retries, wait before trying again
        if (retries < this.config.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay))
        }
      }
    }

    // If we've exhausted retries, throw the last error
    throw lastError || new APIError('Request failed after retries', APIErrorType.UNKNOWN_ERROR)
  }
}

// Export a singleton instance for convenience
export const apiService = new APIService()