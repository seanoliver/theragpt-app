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
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  })
}
