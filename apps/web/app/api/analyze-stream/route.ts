import { createLLMRegistry } from '@/lib/llm/create-llm-registry'
import { LLMModel, streamLLM, withLLMContext } from '@theragpt/llm'
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
        // Stream the LLM response with context - just pass through raw chunks
        const llmStream = await withLLMContext(
          { userId, sessionId, requestPath },
          async () =>
            streamLLM(LLMModel.GPT_4O, registry, {
              prompt,
              temperature: TEMPERATURE,
              systemPrompt:
                'You are a helpful assistant that responds only with valid JSON. Your responses must be parseable by JSON.parse().',
              userId,
            }),
        )

        for await (const chunk of llmStream) {
          // Just send the raw chunk without any processing
          controller.enqueue(encoder.encode(chunk))
        }

        // Close the stream
        controller.close()
      } catch (error: any) {
        console.error('[Error] Stream processing error:', error)
        // Send error message as raw text
        controller.enqueue(
          encoder.encode(`Error: ${error.message || 'An error occurred'}`),
        )
        controller.close()
      }
    },
  })

  return new Response(stream)
}
