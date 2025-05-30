import { createLLMRegistry } from '@/apps/web/lib/llm/create-llm-registry'
import { parseIncompleteJSONStream } from '@/packages/logic/src/workflows/thought-analysis-stream.workflow'
import { LLMModel } from '@theragpt/llm'
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
  
  // Extract user ID from headers or session if available
  const userId = req.headers.get('x-user-id') || undefined

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Initialize a buffer to accumulate JSON chunks
        let buffer = ''
        const previousParsed: Record<string, any> = {}

        // Stream the LLM response using the streamLLM function from the router
        const llmStream = streamLLM(LLMModel.GPT_4O, registry, {
          prompt,
          temperature: TEMPERATURE,
          systemPrompt:
            'You are a helpful assistant that responds only with valid JSON. Your responses must be parseable by JSON.parse().',
          userId,
        })
        for await (const chunk of llmStream) {
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
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: 'field', field: key, value: parsed[key] })}\n\n`,
                  ),
                )
                previousParsed[key] = parsed[key]
              }
            }

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'complete', content: parsed })}\n\n`,
              ),
            )
            buffer = ''
          } catch (e) {
            // If parsing fails, parse incomplete JSON as if it were a complete object
            const incompleteJSON = parseIncompleteJSONStream(buffer)
            console.error('error', e)

            if (incompleteJSON) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: 'complete', content: incompleteJSON })}\n\n`,
                ),
              )
            }
          }
        }

        // Send the final complete event with the accumulated data
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'complete', content: previousParsed })}\n\n`,
          ),
        )

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
