export interface LLMCallOptions {
  prompt: string
  model: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  userId?: string
  logger?: (log: Record<string, any>) => void
  responseFormat?: 'text' | 'json_object'
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

/**
 * Registry of LLM clients by provider
 */
export type ClientRegistry = Partial<Record<LLMProvider, LLMClient>>

/**
 * Configuration for creating LLM clients
 */
export interface LLMClientConfig {
  openAIApiKey?: string
  anthropicApiKey?: string
  // Add other provider configs as needed
}

export enum LLMModel {
  // OpenAI
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4',
  GPT_4_32K = 'gpt-4-32k',
  GPT_4O = 'gpt-4o',

  // Anthropic Claude 4 (Latest Generation)
  CLAUDE_4_OPUS = 'claude-opus-4-20250514',
  CLAUDE_4_SONNET = 'claude-sonnet-4-20250514',

  // Anthropic Claude 3.7
  CLAUDE_3_7_SONNET = 'claude-3-7-sonnet-20250219',

  // Anthropic Claude 3.5
  CLAUDE_3_5_SONNET_V2 = 'claude-3-5-sonnet-20241022',
  CLAUDE_3_5_SONNET = 'claude-3-5-sonnet-20240620',
  CLAUDE_3_5_HAIKU = 'claude-3-5-haiku-20241022',

  // Anthropic Claude 3 (Legacy)
  CLAUDE_3_OPUS = 'claude-3-opus-20240229',
  CLAUDE_3_SONNET = 'claude-3-sonnet-20240229',
  CLAUDE_3_HAIKU = 'claude-3-haiku-20240307',
}

export const MODEL_PROVIDER_MAP: Record<LLMModel, LLMProvider> = {
  // OpenAI
  [LLMModel.GPT_3_5_TURBO]: LLMProvider.OpenAI,
  [LLMModel.GPT_4]: LLMProvider.OpenAI,
  [LLMModel.GPT_4_32K]: LLMProvider.OpenAI,
  [LLMModel.GPT_4O]: LLMProvider.OpenAI,

  // Anthropic Claude 4
  [LLMModel.CLAUDE_4_OPUS]: LLMProvider.Anthropic,
  [LLMModel.CLAUDE_4_SONNET]: LLMProvider.Anthropic,

  // Anthropic Claude 3.7
  [LLMModel.CLAUDE_3_7_SONNET]: LLMProvider.Anthropic,

  // Anthropic Claude 3.5
  [LLMModel.CLAUDE_3_5_SONNET_V2]: LLMProvider.Anthropic,
  [LLMModel.CLAUDE_3_5_SONNET]: LLMProvider.Anthropic,
  [LLMModel.CLAUDE_3_5_HAIKU]: LLMProvider.Anthropic,

  // Anthropic Claude 3 (Legacy)
  [LLMModel.CLAUDE_3_OPUS]: LLMProvider.Anthropic,
  [LLMModel.CLAUDE_3_SONNET]: LLMProvider.Anthropic,
  [LLMModel.CLAUDE_3_HAIKU]: LLMProvider.Anthropic,
}

export const getProviderFromModel = function (model: LLMModel): LLMProvider {
  const provider = MODEL_PROVIDER_MAP[model]
  if (!provider) throw new Error(`Unrecognized or unsupported model: ${model}`)
  return provider
}
