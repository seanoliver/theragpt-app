export type StreamEventType = 'thought' | 'field' | 'complete' | 'error'

export interface StreamEvent {
  type: StreamEventType
  content: any
  field?: string
  value?: any
}

export type StreamEventCallback = (event: StreamEvent) => void

export const streamPromptOutput = async (
  prompt: string,
  thought: string,
  onEvent: StreamEventCallback,
  endpoint: string = '/api/analyze-stream',
  signal?: AbortSignal,
): Promise<void> => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, thought }),
      signal,
    })

    if (!response.ok) {
      throw new Error('Failed to analyze thought')
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const events = buffer.split('\n\n')
      buffer = events.pop() || ''

      for (const rawEvent of events) {
        if (!rawEvent.startsWith('data: ')) continue

        try {
          const json = JSON.parse(rawEvent.slice(6))
          const { type, content, field, value } = json

          if (!type || !content) continue

          // Emit structured event
          onEvent({ type, content, field, value })

          if (type === 'thought') {
            console.log('🔵 SET RAW THOUGHT', content)
          } else if (type === 'field') {
            console.log('🟢 onPatch', field, value)
          } else if (type === 'complete') {
            console.log('🟠 onComplete', content)
          } else if (type === 'error') {
            console.log('🟣 onError', content)
          }
        } catch (err) {
          console.error('Error parsing SSE chunk:', err)
        }
      }
    }
  } catch (err: unknown) {
    console.error('Error streaming thought analysis:', err)
    onEvent({
      type: 'error',
      content: err instanceof Error ? err.message : 'Unknown error',
    })
  }
}
