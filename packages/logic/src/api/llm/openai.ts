import { Thought } from '../../thought/types'
import { NestedThoughtAnalysis, ThoughtAnalyzer } from '../../thought/analyzer'
import { APIError, APIErrorType, LLMProvider } from '../types'
import { ILLMProvider, LLMProviderConfig } from './provider'

/**
 * OpenAI API request interface
 */
interface OpenAIRequest {
  model: string
  messages: {
    role: 'system' | 'user' | 'assistant'
    content: string
  }[]
  temperature: number
  max_tokens: number
}

/**
 * OpenAI API response interface
 */
interface OpenAIResponse {
  choices: {
    message: {
      content: string
    }
  }[]
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * OpenAI provider implementation
 */
export class OpenAIProvider implements ILLMProvider {
  private config: LLMProviderConfig

  constructor(config: LLMProviderConfig) {
    this.config = {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000,
      ...config,
    }
  }

  /**
   * Gets the provider type
   */
  public getType(): LLMProvider {
    return LLMProvider.OPENAI
  }

  /**
   * Analyzes a thought using OpenAI
   * @param thought The thought to analyze
   * @param context Optional context for the thought
   * @returns The analysis result
   */
  public async analyzeThought(
    thought: Thought,
    context?: string
  ): Promise<NestedThoughtAnalysis> {
    // Construct the prompt using the ThoughtAnalyzer
    const messages = ThoughtAnalyzer.constructPrompt(
      thought.content,
      context || thought.context
    )

    try {
      // Make the request to OpenAI
      const response = await this.makeOpenAIRequest(messages)

      // Parse the response using the ThoughtAnalyzer
      return ThoughtAnalyzer.parseResponse(response, thought)
    } catch (error) {
      throw new APIError(
        (error as Error).message || 'Error analyzing thought with OpenAI',
        APIErrorType.API_ERROR
      )
    }
  }

  /**
   * Makes a request to the OpenAI API
   * @param messages The messages to send to OpenAI
   * @returns The response content
   */
  private async makeOpenAIRequest(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
  ): Promise<string> {
    if (!this.config.apiKey) {
      throw new APIError(
        'OpenAI API key not found in configuration',
        APIErrorType.API_ERROR
      )
    }

    const request: OpenAIRequest = {
      model: this.config.model || 'gpt-4',
      messages,
      temperature: this.config.temperature || 0.7,
      max_tokens: this.config.maxTokens || 1000,
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new APIError(
          errorData.error?.message || `OpenAI API request failed with status ${response.status}`,
          APIErrorType.API_ERROR,
          response.status
        )
      }

      const data = await response.json() as OpenAIResponse

      if (!data.choices || data.choices.length === 0) {
        throw new APIError(
          'Empty response from OpenAI',
          APIErrorType.PARSING_ERROR
        )
      }

      return data.choices[0].message.content
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }

      throw new APIError(
        (error as Error).message || 'Error making OpenAI API request',
        APIErrorType.NETWORK_ERROR
      )
    }
  }
}