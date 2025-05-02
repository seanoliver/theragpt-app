import { NextRequest, NextResponse } from 'next/server'
import { analyzePrompt } from '@theragpt/prompts'
import { callLLM, LLMModel } from '@theragpt/llm'
import { createLLMRegistry } from '@/apps/web/lib/llm/create-llm-registry'

const TEMPERATURE = 0.7
const MAX_TOKENS = 512

export const POST = async (req: NextRequest) => {
  const { thought, tone } = await req.json()
  const prompt = analyzePrompt({ rawText: thought, tone })

  const registry = createLLMRegistry()

  const result = await callLLM(LLMModel.GPT_4O, registry, {
    prompt,
    temperature: TEMPERATURE,
    maxTokens: MAX_TOKENS,
  })

  return NextResponse.json({ result })
}
