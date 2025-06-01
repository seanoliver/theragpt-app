import { LLMCallOptions, LLMClient, LLMProvider, LLMResponse } from '../types'
import { OpenAI as PostHogOpenAI } from '@posthog/ai'
import { PostHog } from 'posthog-node'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

/**
 * OpenAI client with PostHog LLM observability
 * Uses PostHog's official AI wrapper for automatic tracking
 */
export class OpenAIPostHogClientV2 implements LLMClient {
  private client: PostHogOpenAI

  constructor(apiKey: string, posthogClient: PostHog) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required')
    }

    // Initialize PostHog-wrapped OpenAI client
    this.client = new PostHogOpenAI({
      apiKey,
      posthog: posthogClient,
    })
  }

  async call({
    prompt,
    model,
    temperature,
    maxTokens,
    systemPrompt,
    logger,
    userId,
  }: LLMCallOptions): Promise<LLMResponse> {
    const messages: ChatCompletionMessageParam[] = [
      ...(systemPrompt
        ? [
            {
              role: 'system',
              content: systemPrompt,
            } as ChatCompletionMessageParam,
          ]
        : []),
      { role: 'user', content: prompt } as ChatCompletionMessageParam,
    ]

    // Create the completion request with PostHog tracking
    const response = await this.client.chat.completions.create({
      model,
      messages,
      temperature,
      max_completion_tokens: maxTokens,
      response_format: { type: 'json_object' },
      // PostHog monitoring parameters
      posthogDistinctId: userId || 'anonymous',
    })

    const content = response.choices?.[0]?.message?.content ?? ''
    const usage = response.usage ? {
      promptTokens: response.usage.prompt_tokens,
      completionTokens: response.usage.completion_tokens,
      totalTokens: response.usage.total_tokens,
    } : undefined

    logger?.({ 
      model, 
      provider: LLMProvider.OpenAI, 
      result: content,
      usage: response.usage,
    })

    return { content, usage }
  }

  async *stream({
    prompt,
    model,
    temperature,
    maxTokens,
    systemPrompt,
    userId,
  }: LLMCallOptions): AsyncGenerator<string> {
    const messages: ChatCompletionMessageParam[] = [
      ...(systemPrompt
        ? [
            {
              role: 'system',
              content: systemPrompt,
            } as ChatCompletionMessageParam,
          ]
        : []),
      { role: 'user', content: prompt } as ChatCompletionMessageParam,
    ]

    const stream = await this.client.chat.completions.create({
      model,
      messages,
      temperature,
      max_completion_tokens: maxTokens,
      stream: true,
      response_format: { type: 'json_object' },
      // PostHog monitoring parameters
      posthogDistinctId: userId || 'anonymous',
    })

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content
      if (text) yield text
    }
  }

  // TODO: Implement function calling request
  async functionCall() {
    throw new Error('Function calling not implemented yet')
  }

  // TODO: Implement tool calling request
  async toolCall() {
    throw new Error('Tool calling not implemented yet')
  }
}