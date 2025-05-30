import { LLMClientConfig, LLMProvider, ClientRegistry } from './types'
import { OpenAIClient } from './clients/openai'
import { PostHogLLMTracer, TracingConfig } from './tracing/posthog-tracer'
import { TracedLLMClient } from './tracing/traced-client'

export interface RegistryConfig extends LLMClientConfig {
  tracing?: TracingConfig
}

export const createClientRegistry = (
  config: RegistryConfig,
): ClientRegistry => {
  const registry: ClientRegistry = {}
  
  // Create tracer if configured
  const tracer = config.tracing ? new PostHogLLMTracer(config.tracing) : null

  if (config.openAIApiKey) {
    const client = new OpenAIClient(config.openAIApiKey)
    registry[LLMProvider.OpenAI] = tracer 
      ? new TracedLLMClient(client, LLMProvider.OpenAI, tracer)
      : client
  }

  return registry
}
