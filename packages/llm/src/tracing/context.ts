import { AsyncLocalStorage } from 'async_hooks'

export interface LLMContext {
  userId?: string
  sessionId?: string
  requestPath?: string
  metadata?: Record<string, any>
}

// Create async local storage for LLM context
export const llmContextStorage = new AsyncLocalStorage<LLMContext>()

/**
 * Get the current LLM context
 */
export function getLLMContext(): LLMContext | undefined {
  return llmContextStorage.getStore()
}

/**
 * Run a function with LLM context
 */
export function withLLMContext<T>(
  context: LLMContext,
  fn: () => T | Promise<T>
): T | Promise<T> {
  return llmContextStorage.run(context, fn)
}