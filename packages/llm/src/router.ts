import { getProviderFromModel, LLMCallOptions, LLMModel } from './types'
import { ClientRegistry } from '@theragpt/web'

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
