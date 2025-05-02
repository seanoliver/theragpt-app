import { LLMClient, LLMProvider, OpenAIClient } from '@theragpt/llm'

/**
 * Update this type once we have Anthropic and
 * other model providers implemented
 * Currently this only supports GPT-4o
 */
export type ClientRegistry = Partial<Record<LLMProvider, LLMClient>>

export const createLLMRegistry = (): ClientRegistry => {
  // Make sure we're not in a client component
  if (typeof window !== 'undefined') {
    throw new Error('createLLMRegistry() should never run on the client')
  }

  return {
    [LLMProvider.OpenAI]: new OpenAIClient(process.env.OPENAI_API_KEY!),
    // More providers here...
  }
}
