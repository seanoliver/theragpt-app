import {
  getProviderFromModel,
  LLMCallOptions,
  LLMModel,
  ClientRegistry,
} from './types'

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

export const streamLLM = async function* (
  model: LLMModel,
  registry: ClientRegistry,
  opts: Omit<LLMCallOptions, 'model'>,
): AsyncGenerator<string> {
  const provider = getProviderFromModel(model)
  const client = registry[provider]

  if (!client) {
    throw new Error(`No registered client for provider: ${provider}`)
  }

  if (!client.stream) {
    throw new Error(`Streaming not supported for provider: ${provider}`)
  }

  yield* client.stream({ model, ...opts })
}
