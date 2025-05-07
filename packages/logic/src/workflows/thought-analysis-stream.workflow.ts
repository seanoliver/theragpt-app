import { AnalysisResult } from './types'

export type StreamEventType = 'thought' | 'chunk' | 'complete' | 'error'

export interface StreamEvent {
  type: StreamEventType
  content: any
}

export type StreamEventCallback = (event: StreamEvent) => void

export const streamPromptOutput = async (
  prompt: string,
  thought: string,
  onEvent: StreamEventCallback
): Promise<void> => {
  try {
    const response = await fetch('/api/analyze-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        thought,
      }),
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

      if (done) {
        break
      }

      // Decode the chunk and add it to our buffer
      buffer += decoder.decode(value, { stream: true })

      // Process complete SSE messages
      const lines = buffer.split('\n\n')
      buffer = lines.pop() || '' // Keep the last incomplete chunk in the buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const eventData = JSON.parse(line.substring(6))
            onEvent(eventData)
          } catch (error) {
            console.error('Error parsing SSE message:', error)
          }
        }
      }
    }
  } catch (error) {
    console.error('Error streaming thought analysis:', error)
    onEvent({
      type: 'error',
      content: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}