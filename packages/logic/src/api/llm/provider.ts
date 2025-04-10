import { Thought } from '../../thought/types'
import { NestedThoughtAnalysis } from '../../thought/analyzer'
import { APIError, APIErrorType, LLMProvider } from '../types'

/**
 * Interface for LLM provider configuration
 */
export interface LLMProviderConfig {
  apiUrl: string
  apiKey?: string
  model?: string
  temperature?: number
  maxTokens?: number
}

/**
 * Interface for LLM provider
 */
export interface ILLMProvider {
  /**
   * Gets the provider type
   */
  getType(): LLMProvider

  /**
   * Analyzes a thought using the LLM
   * @param thought The thought to analyze
   * @param context Optional context for the thought
   * @returns The analysis result
   */
  analyzeThought(
    thought: Thought,
    context?: string
  ): Promise<NestedThoughtAnalysis>
}

/**
 * Factory for creating LLM providers
 */
export class LLMProviderFactory {
  /**
   * Creates an LLM provider based on the provider type
   * @param type The provider type
   * @param config The provider configuration
   * @returns The LLM provider
   */
  public static async createProvider(
    type: LLMProvider,
    config: LLMProviderConfig
  ): Promise<ILLMProvider> {
    switch (type) {
      case LLMProvider.OPENAI: {
        // Dynamically import to avoid circular dependencies
        const openaiModule = await import('./openai')
        return new openaiModule.OpenAIProvider(config)
      }
      default:
        throw new APIError(
          `Provider ${type} is not supported`,
          APIErrorType.VALIDATION_ERROR
        )
    }
  }
}