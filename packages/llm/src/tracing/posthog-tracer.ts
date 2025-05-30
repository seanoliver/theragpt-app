import { PostHog } from 'posthog-node'
import { LLMCallOptions, LLMProvider } from '../types'

export interface TracingConfig {
  apiKey: string
  host?: string
  enabled?: boolean
}

export class PostHogLLMTracer {
  private posthog: PostHog | null = null
  private enabled: boolean

  constructor(config: TracingConfig) {
    this.enabled = config.enabled ?? true
    
    if (this.enabled && config.apiKey) {
      this.posthog = new PostHog(config.apiKey, {
        host: config.host || 'https://app.posthog.com',
        flushAt: 1,
        flushInterval: 0,
      })
    }
  }

  async traceStart(
    options: LLMCallOptions & { 
      provider: LLMProvider 
      requestId: string
      userId?: string
    }
  ): Promise<void> {
    if (!this.enabled || !this.posthog) return

    const { model, provider, requestId, userId, prompt, systemPrompt, temperature, maxTokens } = options

    this.posthog.capture({
      distinctId: userId || 'anonymous',
      event: 'llm_request_start',
      properties: {
        $lib: 'theragpt-llm',
        model,
        provider,
        request_id: requestId,
        prompt_length: prompt.length,
        has_system_prompt: !!systemPrompt,
        temperature,
        max_tokens: maxTokens,
        timestamp: new Date().toISOString(),
      },
    })
  }

  async traceEnd(
    options: {
      requestId: string
      userId?: string
      model: string
      provider: LLMProvider
      responseText: string
      durationMs: number
      error?: Error
      tokenUsage?: {
        promptTokens?: number
        completionTokens?: number
        totalTokens?: number
      }
    }
  ): Promise<void> {
    if (!this.enabled || !this.posthog) return

    const { requestId, userId, model, provider, responseText, durationMs, error, tokenUsage } = options

    this.posthog.capture({
      distinctId: userId || 'anonymous',
      event: error ? 'llm_request_error' : 'llm_request_success',
      properties: {
        $lib: 'theragpt-llm',
        model,
        provider,
        request_id: requestId,
        response_length: responseText?.length || 0,
        duration_ms: durationMs,
        error_message: error?.message,
        error_stack: error?.stack,
        prompt_tokens: tokenUsage?.promptTokens,
        completion_tokens: tokenUsage?.completionTokens,
        total_tokens: tokenUsage?.totalTokens,
        timestamp: new Date().toISOString(),
      },
    })
  }

  async traceStream(
    options: {
      requestId: string
      userId?: string
      model: string
      provider: LLMProvider
      chunk: string
      chunkIndex: number
    }
  ): Promise<void> {
    if (!this.enabled || !this.posthog) return

    // Only trace every 10th chunk to avoid overwhelming the system
    if (options.chunkIndex % 10 !== 0) return

    const { requestId, userId, model, provider, chunk, chunkIndex } = options

    this.posthog.capture({
      distinctId: userId || 'anonymous',
      event: 'llm_stream_chunk',
      properties: {
        $lib: 'theragpt-llm',
        model,
        provider,
        request_id: requestId,
        chunk_index: chunkIndex,
        chunk_length: chunk.length,
        timestamp: new Date().toISOString(),
      },
    })
  }

  async shutdown(): Promise<void> {
    if (this.posthog) {
      await this.posthog.shutdown()
    }
  }
}