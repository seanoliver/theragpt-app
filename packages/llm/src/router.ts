import { getProviderFromModel, LLMCallOptions, LLMModel, ClientRegistry } from './types'

/**
 * Calls an LLM with the specified model, using the appropriate client from the registry
 *
 * @param model The LLM model to use
 * @param registry Registry of LLM clients by provider
 * @param opts Options for the LLM call
 * @returns The LLM response as a string
 */
export const callLLM = async (
  model: LLMModel,
  registry: ClientRegistry,
  opts: Omit<LLMCallOptions, 'model'>,
): Promise<string> => {
  const provider = getProviderFromModel(model)
  const client = registry[provider]

  if (!client) {
    throw new Error(`No registered client for provider: ${provider}`)
  }

  return client.call({ model, ...opts })
}
