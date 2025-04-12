import { thoughtValidator } from '../thought/validation'
import {
  APIError,
  APIErrorType,
  LLMProvider,
  ThoughtAnalysisRequest,
  ThoughtAnalysisResponse,
} from './types'
import { TOOLS } from './tools'

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
    request: ThoughtAnalysisRequest,
  ): Promise<ThoughtAnalysisResponse> {
    // Validate the thought
    const thought =
      typeof request.thought === 'string'
        ? request.thought
        : request.thought.content

    const validationResult = thoughtValidator.validateContent(thought)
    if (!validationResult.valid) {
      throw new APIError(
        validationResult.error || 'Invalid thought',
        APIErrorType.VALIDATION_ERROR,
      )
    }

    // Prepare the OpenAI API request
    const response = await this.makeOpenAIRequest(thought, request.context)

    return {
      success: true,
      data: response,
    }
  }

  /**
   * Makes a request to the OpenAI API
   * @param thought The thought to analyze
   * @param context Optional context for the thought
   * @returns The analysis response
   */
  private async makeOpenAIRequest(
    thought: string,
    context?: string,
  ): Promise<any> {
    const messages = [
      {
        role: 'system',
        content: 'You are a CBT assistant helping identify cognitive distortions in thoughts.',
      },
      {
        role: 'user',
        content: context
          ? `Thought: ${thought}\nContext: ${context}`
          : `Thought: ${thought}`,
      },
    ]

    return {
      model: 'gpt-4-turbo-preview',
      messages,
      tools: TOOLS,
      tool_choice: { type: 'function', function: { name: 'analyze_thought' } },
    }
  }
}

// Export a singleton instance for convenience
export const apiService = new APIService()
