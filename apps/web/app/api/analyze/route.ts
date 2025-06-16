import { createLLMRegistry } from '@/lib/llm/create-llm-registry'
import { callLLM, LLMModel, withLLMContext } from '@theragpt/llm'
import { NextRequest, NextResponse } from 'next/server'

const TEMPERATURE = 0.3

export const POST = async (req: NextRequest) => {
  try {
    const { prompt } = await req.json()
    const registry = createLLMRegistry()

    // Extract context from headers
    const userId = req.headers.get('x-user-id') || undefined
    const sessionId = req.headers.get('x-session-id') || undefined
    const requestPath = req.headers.get('x-request-path') || undefined

    // Run LLM call with context
    const llmResponse = await withLLMContext(
      { userId, sessionId, requestPath },
      async () => {
        return callLLM(LLMModel.GPT_4O, registry, {
          prompt,
          temperature: TEMPERATURE,
          systemPrompt:
            'You are a helpful assistant that responds only with valid JSON. Your responses must be parseable by JSON.parse().',
          userId,
        })
      }
    )

    return NextResponse.json({ result: llmResponse })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Failed to analyze thought',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
