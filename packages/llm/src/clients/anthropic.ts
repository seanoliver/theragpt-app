import { Anthropic } from '@anthropic-ai/sdk';
import type { ContentBlock, MessageParam, TextBlock } from '@anthropic-ai/sdk/resources';
import { LLMCallOptions, LLMClient, LLMProvider } from '../types';

export class AnthropicClient implements LLMClient {
  private client: Anthropic

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Anthropic API key is required')
    }

    this.client = new Anthropic({
      apiKey,
    })
  }

  private isTextBlock(block: ContentBlock): block is TextBlock {
    return block.type === 'text'
  }

  async call({
    prompt,
    model,
    temperature,
    maxTokens,
    systemPrompt,
    logger,
  }: LLMCallOptions): Promise<string> {
    const messages: MessageParam[] = [
      { role: 'user', content: prompt },
    ]

    const response = await this.client.messages.create({
      model,
      max_tokens: maxTokens ?? 1000,
      messages,
      temperature,
      system: systemPrompt,
    })

    const firstBlock = response.content[0]
    const result = this.isTextBlock(firstBlock) ? firstBlock.text : ''

    logger?.({ model, provider: LLMProvider.Anthropic, result })

    return result
  }

  async *stream({
    prompt,
    model,
    temperature,
    maxTokens,
    systemPrompt,
  }: LLMCallOptions): AsyncGenerator<string> {
    const messages: MessageParam[] = [
      { role: 'user', content: prompt },
    ]

    const stream = await this.client.messages.stream({
      model,
      messages,
      temperature,
      max_tokens: maxTokens ?? 1000,
      system: systemPrompt,
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        yield chunk.delta.text
      }
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
