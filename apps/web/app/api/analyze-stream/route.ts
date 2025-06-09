import { createLLMRegistry } from '@/lib/llm/create-llm-registry'
import { parseIncompleteJSONStream } from '@theragpt/logic/src/workflows/thought-analysis-stream.workflow'
import { LLMModel, withLLMContext } from '@theragpt/llm'
import { streamLLM } from '@theragpt/llm/src/router'
import { NextRequest } from 'next/server'

const TEMPERATURE = 0.3

export const POST = async (req: NextRequest) => {
  let prompt = ''

  try {
    const body = await req.json()
    prompt = body.prompt
  } catch (error) {
    console.error(error)
    return new Response('Invalid request body', { status: 400 })
  }

  const registry = createLLMRegistry()

  // Extract context from headers
  const userId = req.headers.get('x-user-id') || undefined
  const sessionId = req.headers.get('x-session-id') || undefined
  const requestPath = req.headers.get('x-request-path') || undefined

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Initialize a buffer to accumulate JSON chunks
        let buffer = ''
        const previousParsed: Record<string, any> = {}
        let chunkCount = 0

        // Helper function for deep equality comparison
        const deepEqual = (obj1: any, obj2: any): boolean => {
          if (obj1 === obj2) return true
          if (obj1 == null || obj2 == null) return false
          if (typeof obj1 !== typeof obj2) return false

          if (typeof obj1 === 'object') {
            const keys1 = Object.keys(obj1)
            const keys2 = Object.keys(obj2)
            if (keys1.length !== keys2.length) return false

            for (const key of keys1) {
              if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
                return false
              }
            }
            return true
          }

          return obj1 === obj2
        }

        // Stream the LLM response with context
        const llmStream = await withLLMContext(
          { userId, sessionId, requestPath },
          async () => streamLLM(LLMModel.GPT_4O, registry, {
            prompt,
            temperature: TEMPERATURE,
            systemPrompt:
              'You are a helpful assistant that responds only with valid JSON. Your responses must be parseable by JSON.parse().',
            userId,
          })
        )

        for await (const chunk of llmStream) {
          chunkCount++
          buffer += chunk

          // Send chunk event for UI compatibility
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'chunk', content: chunk, chunkNumber: chunkCount })}\n\n`,
            ),
          )

          console.log(`[Chunk ${chunkCount}] Buffer length: ${buffer.length}, Content: ${buffer.slice(-100)}`)

          // Always try to parse incomplete JSON first for streaming updates
          let currentParsed: Record<string, any> = {}
          let isCompleteJSON = false

          // First, try to parse as complete JSON
          try {
            currentParsed = JSON.parse(buffer)
            isCompleteJSON = true
            console.log(`[Chunk ${chunkCount}] Successfully parsed complete JSON:`, currentParsed)
          } catch (parseError) {
            // If complete JSON parsing fails, try incomplete JSON parsing
            try {
              const incompleteJSON = parseIncompleteJSONStream(buffer)
              if (incompleteJSON && Object.keys(incompleteJSON).length > 0) {
                currentParsed = incompleteJSON
                console.log(`[Chunk ${chunkCount}] Parsed incomplete JSON:`, incompleteJSON)
              }
            } catch (incompleteError) {
              console.log(`[Chunk ${chunkCount}] Both complete and incomplete JSON parsing failed`)
              // Continue to next chunk if we can't parse anything
              continue
            }
          }

          // If we have any parsed data, check for field updates
          if (Object.keys(currentParsed).length > 0) {
            for (const key in currentParsed) {
              if (
                Object.prototype.hasOwnProperty.call(currentParsed, key) &&
                !deepEqual(currentParsed[key], previousParsed[key])
              ) {
                console.log(`[Chunk ${chunkCount}] Field updated: ${key} (${isCompleteJSON ? 'complete' : 'partial'})`)
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: 'field',
                      field: key,
                      value: currentParsed[key],
                      isComplete: isCompleteJSON
                    })}\n\n`,
                  ),
                )
                previousParsed[key] = currentParsed[key]
              }
            }
          }
        }

        // Final processing after all chunks are received
        console.log(`[Final] Processing complete. Buffer length: ${buffer.length}`)

        let finalParsed = previousParsed

        // Try one final parse of the complete buffer
        if (buffer.trim()) {
          try {
            finalParsed = JSON.parse(buffer)
            console.log('[Final] Successfully parsed final buffer:', finalParsed)
          } catch (finalParseError) {
            console.log('[Final] Final parse failed, trying incomplete JSON parsing')
            try {
              const incompleteJSON = parseIncompleteJSONStream(buffer)
              if (incompleteJSON && Object.keys(incompleteJSON).length > 0) {
                finalParsed = { ...previousParsed, ...incompleteJSON }
                console.log('[Final] Used incomplete JSON parsing:', finalParsed)
              }
            } catch (incompleteError) {
              console.log('[Final] Incomplete JSON parsing failed, using previousParsed')
            }
          }
        }

        // Send the final complete event ONLY ONCE
        console.log('[Final] Sending final complete event')
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'complete', content: finalParsed })}\n\n`,
          ),
        )

        // Close the stream
        controller.close()
      } catch (error: any) {
        console.error('[Error] Stream processing error:', error)
        // Send error message
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'error', content: error.message || 'An error occurred' })}\n\n`,
          ),
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
