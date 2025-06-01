import { LLMCallOptions, LLMClient, LLMProvider } from '../types'
import { PostHogLLMTracer } from './posthog-tracer'
import { v4 as uuidv4 } from 'uuid'
import { getLLMContext } from './context'

export class TracedLLMClient implements LLMClient {
  constructor(
    private client: LLMClient,
    private provider: LLMProvider,
    private tracer: PostHogLLMTracer
  ) {}

  async call(opts: LLMCallOptions): Promise<string> {
    const requestId = uuidv4()
    const startTime = Date.now()
    
    // Get context from async local storage
    const context = getLLMContext()
    const userId = opts.userId || context?.userId
    
    // Merge metadata from context and options
    const metadata = {
      ...context?.metadata,
      session_id: context?.sessionId,
      request_path: context?.requestPath,
    }

    try {
      // Trace the start of the request
      await this.tracer.traceStart({
        ...opts,
        provider: this.provider,
        requestId,
        userId,
        metadata,
      })

      // Make the actual LLM call
      const result = await this.client.call(opts)

      // Handle both string and LLMResponse formats
      const isLLMResponse = typeof result === 'object' && 'content' in result
      const content = isLLMResponse ? result.content : result
      const usage = isLLMResponse ? result.usage : undefined

      // Trace the successful completion
      await this.tracer.traceEnd({
        requestId,
        userId,
        model: opts.model,
        provider: this.provider,
        responseText: content,
        durationMs: Date.now() - startTime,
        tokenUsage: usage,
      })

      // Return string content for backward compatibility
      return content
    } catch (error) {
      // Trace the error
      await this.tracer.traceEnd({
        requestId,
        userId,
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
    
    // Get context from async local storage
    const context = getLLMContext()
    const userId = opts.userId || context?.userId
    
    // Merge metadata from context and options
    const metadata = {
      ...context?.metadata,
      session_id: context?.sessionId,
      request_path: context?.requestPath,
    }

    try {
      // Trace the start of the stream
      await this.tracer.traceStart({
        ...opts,
        provider: this.provider,
        requestId,
        userId,
        metadata,
      })

      // Stream from the actual client
      for await (const chunk of this.client.stream(opts)) {
        fullResponse += chunk
        
        // Trace stream chunks
        await this.tracer.traceStream({
          requestId,
          userId,
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
        userId,
        model: opts.model,
        provider: this.provider,
        responseText: fullResponse,
        durationMs: Date.now() - startTime,
      })
    } catch (error) {
      // Trace stream error
      await this.tracer.traceEnd({
        requestId,
        userId,
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