import { LLMClient, LLMClientConfig, LLMProvider, ClientRegistry } from './types'
import { OpenAIClient } from './clients/openai'

/**
 * Creates a registry of LLM clients based on the provided configuration
 *
 * This factory function creates LLM clients for each provider based on the
 * configuration provided. It returns a ClientRegistry object that maps
 * providers to their respective clients.
 *
 * @param config Configuration for creating LLM clients
 * @returns A registry of LLM clients by provider
 */
export const createClientRegistry = (config: LLMClientConfig): ClientRegistry => {
  const registry: ClientRegistry = {}

  // Create OpenAI client if API key is provided
  if (config.openAIApiKey) {
    registry[LLMProvider.OpenAI] = new OpenAIClient(config.openAIApiKey)
  }

  // Add other providers here as they are implemented
  // Example:
  // if (config.anthropicApiKey) {
  //   registry[LLMProvider.Anthropic] = new AnthropicClient(config.anthropicApiKey)
  // }

  return registry
}