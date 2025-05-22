import { AnthropicClient } from './clients/anthropic'
import { OpenAIClient } from './clients/openai'
import { ClientRegistry, LLMClientConfig, LLMProvider } from './types'

export const createClientRegistry = (
  config: LLMClientConfig,
): ClientRegistry => {
  const registry: ClientRegistry = {}

  if (config.openAIApiKey) {
    registry[LLMProvider.OpenAI] = new OpenAIClient(config.openAIApiKey)
  }

  if (config.anthropicApiKey) {
    registry[LLMProvider.Anthropic] = new AnthropicClient(config.anthropicApiKey)
  }

  return registry
}
