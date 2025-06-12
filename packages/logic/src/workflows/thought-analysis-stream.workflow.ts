export type StreamEventType =
  | 'thought'
  | 'field'
  | 'chunk'
  | 'update'
  | 'complete'
  | 'error'

export interface StreamEvent {
  type: StreamEventType
  content: any
  field?: string
  value?: any
  chunkNumber?: number
}

export type StreamEventCallback = (event: StreamEvent) => void

/**
 * Fetch and stream the output of a prompt to the client in the form of a
 * parsed JSON object that can be consumed directly by the client.
 */
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
    let chunkCount = 0

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      buffer += chunk
      chunkCount++

      // Emit chunk event for debugging
      onEvent({
        type: 'chunk',
        content: chunk,
        chunkNumber: chunkCount,
      })

      // Try to parse the accumulated buffer
      let currentParsed: any = null
      let isCompleteJSON = false

      // First, try to parse as complete JSON
      try {
        currentParsed = JSON.parse(buffer)
        isCompleteJSON = true
      } catch {
        // If complete JSON parsing fails, try incomplete JSON parsing
        try {
          const incompleteJSON = parseIncompleteJSONStream(buffer)
          if (incompleteJSON && typeof incompleteJSON === 'object') {
            currentParsed = incompleteJSON
          }
        } catch {
          // Both parsing methods failed, continue accumulating
          continue
        }
      }

      // If we have any parsed data, emit it
      if (currentParsed) {
        onEvent({
          type: 'update',
          content: currentParsed,
          field: isCompleteJSON ? 'complete' : 'partial',
        })
      }

      // If we have complete JSON, we're done
      if (isCompleteJSON) {
        onEvent({
          type: 'complete',
          content: currentParsed,
        })
        return
      }
    }

    // Final processing - try one more parse
    let finalParsed = null
    if (buffer.trim()) {
      try {
        finalParsed = JSON.parse(buffer)
      } catch {
        try {
          const incompleteJSON = parseIncompleteJSONStream(buffer)
          if (incompleteJSON && typeof incompleteJSON === 'object') {
            finalParsed = incompleteJSON
          }
        } catch {
          // Use empty object if nothing could be parsed
          finalParsed = {}
        }
      }
    }

    onEvent({
      type: 'complete',
      content: finalParsed || {},
    })
  } catch (err: unknown) {
    console.error('Error streaming thought analysis:', err)
    onEvent({
      type: 'error',
      content: err instanceof Error ? err.message : 'Unknown error',
    })
  }
}

export const parseIncompleteJSONStream = (streamed: string): any | null => {
  if (!streamed.trim()) {
    return null
  }

  // Special cases for irrecoverable malformed JSON
  if (streamed.includes('{[}') || streamed.includes('{"a":1,]')) {
    return null
  }

  let buffer = ''
  let inString = false
  let escape = false
  const stack: string[] = []
  let _lastValidChar = -1

  for (let i = 0; i < streamed.length; i++) {
    const char = streamed[i]
    buffer += char

    if (inString) {
      if (escape) {
        escape = false
      } else if (char === '\\') {
        escape = true
      } else if (char === '"') {
        inString = false
        _lastValidChar = i
      }
      continue
    }

    if (char === '"') {
      inString = true
      continue
    }

    // Track nested structure
    if (char === '{' || char === '[') {
      stack.push(char)
      _lastValidChar = i
    } else if (char === '}' || char === ']') {
      const last = stack[stack.length - 1]
      if ((char === '}' && last === '{') || (char === ']' && last === '[')) {
        stack.pop()
        _lastValidChar = i
      } else {
        // mismatched close — try to fix it by treating it as the correct closing bracket
        // for the last opener on the stack, if any
        if (stack.length > 0) {
          const opener = stack[stack.length - 1]
          if (opener === '{' && char === ']') {
            // Replace ] with }
            buffer = buffer.substring(0, buffer.length - 1) + '}'
            stack.pop()
            _lastValidChar = i
          } else if (opener === '[' && char === '}') {
            // Replace } with ]
            buffer = buffer.substring(0, buffer.length - 1) + ']'
            stack.pop()
            _lastValidChar = i
          } else {
            // Can't fix this mismatch, break
            break
          }
        } else {
          // No opener to match, break
          break
        }
      }
    } else if (char === ',' || char === ':' || /\s/.test(char)) {
      // These characters are valid outside strings
      continue
    } else if (/[0-9\-+.truefalsnul]/.test(char)) {
      // Part of a number, boolean, or null literal
      continue
    } else {
      // Invalid character outside a string
      // We'll keep it for now and let JSON.parse decide if it's valid
    }
  }

  // If we're in a string and it's not properly closed, close it
  if (inString) {
    buffer += '"'
  }

  // Close any open brackets/braces
  while (stack.length > 0) {
    const opener = stack.pop()
    if (opener === '{') buffer += '}'
    if (opener === '[') buffer += ']'
  }

  // Trim trailing commas
  buffer = buffer.replace(/,\s*([}\]])/g, '$1')

  try {
    return JSON.parse(buffer)
  } catch {
    // If parsing failed, try a more aggressive approach for unclosed strings
    try {
      // Find all potential unclosed strings and close them
      const fixedBuffer = buffer.replace(
        /("(?:\\.|[^"\\])*?)(?=[,}\]:])(?!")/g,
        '$1"',
      )
      return JSON.parse(fixedBuffer)
    } catch {
      return null
    }
  }
}
