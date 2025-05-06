import { createLLMRegistry } from '@/apps/web/lib/llm/create-llm-registry'
import { callLLM, LLMModel } from '@theragpt/llm'
import { NextRequest, NextResponse } from 'next/server'

const TEMPERATURE = 0.7

export const POST = async (req: NextRequest) => {
  try {
    const { prompt } = await req.json()
    const registry = createLLMRegistry()

    const llmResponse = await callLLM(LLMModel.GPT_4O, registry, {
      prompt,
      temperature: TEMPERATURE,
      systemPrompt:
        'You are a helpful assistant that responds only with valid JSON. Your responses must be parseable by JSON.parse().',
    })

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
