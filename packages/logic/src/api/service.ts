import { LLMProvider } from './types'

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
   * Prepares an OpenAI request config to generate alternative statements in different tones
   * @param statement The original statement
   * @param tones Array of tone keywords
   * @returns OpenAI request config
   */
  public async generateAlternatives(statement: string, tones: string[]) {
    const systemPrompt =
      'You are a highly creative, empathetic assistant. Your task is to help users find the most personally resonant version of an affirmation by rewriting it in a variety of distinct tones. For each tone, deeply reinterpret the affirmation, using novel word choices, metaphors, or perspectives that fit the tone. Your goal is to provide a range of options so the user can discover the exact phrasing that feels most powerful and authentic to them. Each alternative should feel fresh, personal, and clearly reflect the specified tone. IMPORTANT: Keep all alternatives direct, clear, and to the point. Avoid flowery or superfluous language, even when expressing different tones.'

    const userPrompt = `Here is an affirmation:\n"${statement}"\n\nPlease rewrite this affirmation in each of the following tones, making each version feel unique, personal, and creatively reworded. For each, provide a JSON object with \"tone\" and \"text\".\n\nTones: ${tones.join(', ')}\n\nRespond ONLY with a JSON object in this format: {"alternatives": [{"tone": "<tone>", "text": "<rewritten statement>"}, ...]}`

    return {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    }
  }

  /**
   * Prepares an OpenAI request config to generate a single alternative statement in a specific tone
   * @param statement The original statement
   * @param tone The tone keyword
   * @returns OpenAI request config
   */
  public async generateAlternative(statement: string, tone: string) {
    const systemPrompt =
      'You are a highly creative, empathetic assistant. Your task is to help users find the most personally resonant version of an affirmation by rewriting it in a specific tone. Deeply reinterpret the affirmation, using novel word choices, metaphors, or perspectives that fit the tone. Your goal is to provide an option so the user can discover the exact phrasing that feels most powerful and authentic to them. The alternative should feel fresh, personal, and clearly reflect the specified tone. IMPORTANT: Keep the alternative direct, clear, and to the point. Avoid flowery or superfluous language, even when expressing different tones.'

    const userPrompt = `Here is an affirmation:\n"${statement}"\n\nPlease rewrite this affirmation in the following tone, making it feel unique, personal, and creatively reworded. Provide a JSON object with \"tone\" and \"text\".\n\nTone: ${tone}\n\nRespond ONLY with a JSON object in this format: {"tone": "<tone>", "text": "<rewritten statement>"}`

    return {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    }
  }
}

// Export a singleton instance for convenience
export const apiService = new APIService()
