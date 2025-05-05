import { createLLMRegistry } from '@/apps/web/lib/llm/create-llm-registry'
import { parseAnalysisResponse } from '@/packages/logic/src/workflows/thought-analysis.workflow'
import { callLLM, LLMModel } from '@theragpt/llm'
import { analyzePrompt } from '@theragpt/prompts'
import { NextRequest, NextResponse } from 'next/server'

const TEMPERATURE = 0.7
const MAX_TOKENS = 512

export const POST = async (req: NextRequest) => {
  try {
    const { thought, tone } = await req.json()
    const prompt = analyzePrompt({ rawText: thought, tone })

    // Create the client registry using environment variables
    const registry = createLLMRegistry()

    try {
      // TODO: Implement dynamic fallback logic for different models
      let llmResponse: string
      try {
        llmResponse = await callLLM(LLMModel.GPT_4O, registry, {
          prompt,
          temperature: TEMPERATURE,
          maxTokens: MAX_TOKENS,
          systemPrompt:
            'You are a helpful assistant that responds only with valid JSON. Your responses must be parseable by JSON.parse().',
        })
      } catch (modelError) {
        console.warn('Failed to use GPT-4O, falling back to GPT-4:', modelError)
        llmResponse = await callLLM(LLMModel.GPT_4, registry, {
          prompt,
          temperature: TEMPERATURE,
          maxTokens: MAX_TOKENS,
          // TODO: Put the system prompt somewhere else
          systemPrompt:
            'You are a helpful assistant that responds only with valid JSON. Your responses must be parseable by JSON.parse().',
        })
      }
      // Parse the LLM response to extract structured data
      const parsedResult = parseAnalysisResponse(llmResponse)

      return NextResponse.json({ result: parsedResult })
    } catch (llmError: unknown) {
      console.error('Error calling LLM:', llmError)

      // TODO: Move this safe error handler into a utility function
      const errorMessage =
        llmError instanceof Error
          ? llmError.message
          : typeof llmError === 'string'
            ? llmError
            : 'Unknown LLM error'

      console.error(
        'Error details:',
        JSON.stringify(
          llmError instanceof Error
            ? Object.getOwnPropertyNames(llmError).reduce(
                (acc, key) => {
                  // @ts-expect-error - We're intentionally accessing properties dynamically
                  acc[key] = llmError[key]?.toString()
                  return acc
                },
                {} as Record<string, string>,
              )
            : llmError,
        ),
      )

      throw new Error(`LLM call failed: ${errorMessage}`)
    }
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
