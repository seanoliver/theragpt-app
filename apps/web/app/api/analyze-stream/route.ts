import { createLLMRegistry } from '@/apps/web/lib/llm/create-llm-registry'
import { LLMModel } from '@theragpt/llm'
import { streamLLM } from '@theragpt/llm/src/router'
import { NextRequest } from 'next/server'

const TEMPERATURE = 0.3

export async function POST(req: NextRequest) {
  let prompt = ''
  let thought = ''

  try {
    const body = await req.json()
    prompt = body.prompt
    thought = body.thought
  } catch (error) {
    return new Response('Invalid request body', { status: 400 })
  }

  const registry = createLLMRegistry()

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send the raw thought text first so the client can create a partial entry
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'thought', content: thought })}\n\n`,
          ),
        )
        // Initialize a buffer to accumulate JSON chunks
        let buffer = ''
        let previousParsed: Record<string, any> = {}

        // Stream the LLM response using the streamLLM function from the router
        const llmStream = streamLLM(LLMModel.GPT_4O, registry, {
          prompt,
          temperature: TEMPERATURE,
          systemPrompt:
            'You are a helpful assistant that responds only with valid JSON. Your responses must be parseable by JSON.parse().',
        })
        for await (const chunk of llmStream) {
          // Add the chunk to our buffer
          buffer += chunk

          try {
            // Try to parse the buffer as JSON to see if we have a complete object
            const parsed = JSON.parse(buffer)

            // Compare with previousParsed and emit updated fields
            for (const key in parsed) {
              if (
                Object.prototype.hasOwnProperty.call(parsed, key) &&
                parsed[key] !== previousParsed[key]
              ) {
                console.log('Sending field:', key, parsed[key])

                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: 'field', field: key, value: parsed[key] })}\n\n`,
                  ),
                )
                previousParsed[key] = parsed[key]
              }
            }

            // If we successfully parsed, send the complete object
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'complete', content: parsed })}\n\n`,
              ),
            )
            console.log('✅ Sent complete object:', parsed)

            // Reset buffer after successful parse
            buffer = ''
          } catch (e) {
            // If parsing fails, it means we have an incomplete JSON object
            // Send the chunk as a partial update
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`,
              ),
            )
            console.log('Sent chunk:', chunk)
          }
        }

        // Send the final complete event with the accumulated data
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'complete', content: previousParsed })}\n\n`,
          ),
        )
        console.log('Sent final complete object:', previousParsed)

        // Close the stream
        controller.close()
      } catch (error: any) {
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
