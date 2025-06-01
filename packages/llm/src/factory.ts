import { LLMClientConfig, LLMProvider, ClientRegistry } from './types'
import { OpenAIClient } from './clients/openai'
import { OpenAIPostHogClientV2 } from './clients/openai-posthog-v2'
import { PostHog } from 'posthog-node'

export interface RegistryConfig extends LLMClientConfig {
  posthog?: {
    apiKey: string
    host?: string
    enabled?: boolean
  }
}

export const createClientRegistry = (
  config: RegistryConfig,
): ClientRegistry => {
  const registry: ClientRegistry = {}

  if (config.openAIApiKey) {
    // Use PostHog-wrapped client if PostHog is enabled
    if (config.posthog?.enabled && config.posthog?.apiKey) {
      const posthogClient = new PostHog(config.posthog.apiKey, {
        host: config.posthog.host || 'https://app.posthog.com',
        flushAt: 1,
        flushInterval: 0,
      })
      
      registry[LLMProvider.OpenAI] = new OpenAIPostHogClientV2(
        config.openAIApiKey,
        posthogClient
      )
    } else {
      // Fallback to regular OpenAI client
      registry[LLMProvider.OpenAI] = new OpenAIClient(config.openAIApiKey)
    }
  }

  return registry
}
