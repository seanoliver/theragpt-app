import { ClientRegistry, createClientRegistry } from '@theragpt/llm'

/**
 * Creates an LLM client registry using environment variables for API keys
 *
 * This function should only be called on the server side, as it accesses
 * environment variables that are not available in the browser.
 */
export const createLLMRegistry = (): ClientRegistry => {
  // Make sure we're not in a client component
  if (typeof window !== 'undefined') {
    throw new Error('createLLMRegistry() should never run on the client')
  }

  return createClientRegistry({
    openAIApiKey: process.env.OPENAI_API_KEY,
    // Add other provider API keys as needed
    // anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    tracing: {
      apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      enabled: process.env.POSTHOG_LLM_TRACING_ENABLED === 'true',
    },
  })
}
