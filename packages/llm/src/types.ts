export interface LLMCallOptions {
  prompt: string
  model: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  userId?: string
  logger?: (log: Record<string, any>) => void
}

export interface LLMClient {
  call(opts: LLMCallOptions): Promise<string>
  stream?(opts: LLMCallOptions): AsyncGenerator<string>
  toolCall?(opts: LLMCallOptions & { tools: any[] }): Promise<any>
  functionCall?(opts: LLMCallOptions & { functionName: string }): Promise<any>
}
export enum LLMProvider {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
}

export enum LLMModel {
  // OpenAI
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4',
  GPT_4_32K = 'gpt-4-32k',
  GPT_4O = 'gpt-4o',

  // Anthropic
  CLAUDE_3_OPUS = 'claude-3-opus',
  CLAUDE_3_SONNET = 'claude-3-sonnet',
  CLAUDE_3_HAIKU = 'claude-3-haiku',
}

export const MODEL_PROVIDER_MAP: Record<LLMModel, LLMProvider> = {
  // OpenAI
  [LLMModel.GPT_3_5_TURBO]: LLMProvider.OpenAI,
  [LLMModel.GPT_4]: LLMProvider.OpenAI,
  [LLMModel.GPT_4_32K]: LLMProvider.OpenAI,
  [LLMModel.GPT_4O]: LLMProvider.OpenAI,

  // Anthropic
  [LLMModel.CLAUDE_3_OPUS]: LLMProvider.Anthropic,
  [LLMModel.CLAUDE_3_SONNET]: LLMProvider.Anthropic,
  [LLMModel.CLAUDE_3_HAIKU]: LLMProvider.Anthropic,
}

export function getProviderFromModel(model: LLMModel): LLMProvider {
  const provider = MODEL_PROVIDER_MAP[model]
  if (!provider) throw new Error(`Unrecognized or unsupported model: ${model}`)
  return provider
}
