import { LLMCallOptions, LLMClient, LLMProvider } from '../types'
import { PostHogLLMTracer } from './posthog-tracer'
import { v4 as uuidv4 } from 'uuid'

export class TracedLLMClient implements LLMClient {
  constructor(
    private client: LLMClient,
    private provider: LLMProvider,
    private tracer: PostHogLLMTracer
  ) {}

  async call(opts: LLMCallOptions): Promise<string> {
    const requestId = uuidv4()
    const startTime = Date.now()

    try {
      // Trace the start of the request
      await this.tracer.traceStart({
        ...opts,
        provider: this.provider,
        requestId,
        userId: opts.userId,
      })

      // Make the actual LLM call
      const result = await this.client.call(opts)

      // Trace the successful completion
      await this.tracer.traceEnd({
        requestId,
        userId: opts.userId,
        model: opts.model,
        provider: this.provider,
        responseText: result,
        durationMs: Date.now() - startTime,
      })

      return result
    } catch (error) {
      // Trace the error
      await this.tracer.traceEnd({
        requestId,
        userId: opts.userId,
        model: opts.model,
        provider: this.provider,
        responseText: '',
        durationMs: Date.now() - startTime,
        error: error as Error,
      })

      throw error
    }
  }

  async *stream(opts: LLMCallOptions): AsyncGenerator<string> {
    if (!this.client.stream) {
      throw new Error(`Streaming not supported for provider: ${this.provider}`)
    }

    const requestId = uuidv4()
    const startTime = Date.now()
    let chunkIndex = 0
    let fullResponse = ''

    try {
      // Trace the start of the stream
      await this.tracer.traceStart({
        ...opts,
        provider: this.provider,
        requestId,
        userId: opts.userId,
      })

      // Stream from the actual client
      for await (const chunk of this.client.stream(opts)) {
        fullResponse += chunk
        
        // Trace stream chunks
        await this.tracer.traceStream({
          requestId,
          userId: opts.userId,
          model: opts.model,
          provider: this.provider,
          chunk,
          chunkIndex: chunkIndex++,
        })

        yield chunk
      }

      // Trace successful stream completion
      await this.tracer.traceEnd({
        requestId,
        userId: opts.userId,
        model: opts.model,
        provider: this.provider,
        responseText: fullResponse,
        durationMs: Date.now() - startTime,
      })
    } catch (error) {
      // Trace stream error
      await this.tracer.traceEnd({
        requestId,
        userId: opts.userId,
        model: opts.model,
        provider: this.provider,
        responseText: fullResponse,
        durationMs: Date.now() - startTime,
        error: error as Error,
      })

      throw error
    }
  }

  async toolCall(opts: LLMCallOptions & { tools: any[] }): Promise<any> {
    if (!this.client.toolCall) {
      throw new Error(`Tool calling not supported for provider: ${this.provider}`)
    }
    
    // For now, just pass through without tracing
    // Can be extended later
    return this.client.toolCall(opts)
  }

  async functionCall(opts: LLMCallOptions & { functionName: string }): Promise<any> {
    if (!this.client.functionCall) {
      throw new Error(`Function calling not supported for provider: ${this.provider}`)
    }
    
    // For now, just pass through without tracing
    // Can be extended later
    return this.client.functionCall(opts)
  }
}