import { LLMClientConfig, LLMProvider, ClientRegistry } from './types'
import { OpenAIClient } from './clients/openai'

export const createClientRegistry = (
  config: LLMClientConfig,
): ClientRegistry => {
  const registry: ClientRegistry = {}

  if (config.openAIApiKey) {
    registry[LLMProvider.OpenAI] = new OpenAIClient(config.openAIApiKey)
  }

  return registry
}
