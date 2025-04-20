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
        content:
          'You are a CBT assistant helping identify cognitive distortions in thoughts.',
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

/**
 * Prepares an OpenAI request config to generate alternative statements in different tones
 * @param statement The original statement
 * @param tones Array of tone keywords
 * @returns OpenAI request config
 */
export async function generateAlternatives(statement: string, tones: string[]) {
  const systemPrompt =
    'You are a highly creative, empathetic assistant. Your task is to help users find the most personally resonant version of an affirmation by rewriting it in a variety of distinct tones. For each tone, deeply reinterpret the affirmation, using novel word choices, metaphors, or perspectives that fit the tone. Your goal is to provide a range of options so the user can discover the exact phrasing that feels most powerful and authentic to them. Each alternative should feel fresh, personal, and clearly reflect the specified tone.'

  const userPrompt =
    `Here is an affirmation:\n"${statement}"\n\nPlease rewrite this affirmation in each of the following tones, making each version feel unique, personal, and creatively reworded. For each, provide a JSON object with \"tone\" and \"text\".\n\nTones: ${tones.join(', ')}\n\nRespond ONLY with a JSON object in this format: {"alternatives": [{"tone": "<tone>", "text": "<rewritten statement>"}, ...]}`

  return {
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
  }
}
