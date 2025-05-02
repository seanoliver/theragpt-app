import { NextRequest, NextResponse } from 'next/server'
import { analyzePrompt } from '@theragpt/prompts'
import { callLLM, LLMModel } from '@theragpt/llm'
import { createLLMRegistry } from '@/apps/web/lib/llm/create-llm-registry'
import { v4 as uuidv4 } from 'uuid'

const TEMPERATURE = 0.7
const MAX_TOKENS = 512

interface AnalysisResult {
  distortions: Array<{
    id: string;
    name: string;
    explanation: string;
  }>;
  reframedThought: string;
  justification: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const { thought, tone } = await req.json()
    const prompt = analyzePrompt({ rawText: thought, tone })

    // Create the client registry using environment variables
    const registry = createLLMRegistry()

    const llmResponse = await callLLM(LLMModel.GPT_4O, registry, {
      prompt,
      temperature: TEMPERATURE,
      maxTokens: MAX_TOKENS,
    })

    // Parse the LLM response to extract structured data
    // This is a simplified example - in a real implementation, you would
    // need to parse the LLM response based on its actual format
    const parsedResult = parseLLMResponse(llmResponse)

    return NextResponse.json({ result: parsedResult })
  } catch (error) {
    console.error('Error in analyze route:', error)
    return NextResponse.json(
      { error: 'Failed to analyze thought' },
      { status: 500 }
    )
  }
}

/**
 * Parse the LLM response into a structured format for the frontend
 *
 * Note: This is a simplified implementation. In a real-world scenario,
 * you would need to parse the actual LLM response format, which might be
 * JSON, markdown, or plain text that needs to be parsed.
 */
function parseLLMResponse(response: string): AnalysisResult {
  try {
    // Attempt to parse as JSON if the LLM returns JSON
    const jsonResponse = JSON.parse(response)
    console.log('Parsed LLM response:', jsonResponse)

    // Handle the expected format from the prompt
    if (jsonResponse.distortions && jsonResponse.reframe) {
      // Map the distortions from the LLM format to our expected format
      const distortionsWithIds = jsonResponse.distortions.map((d: any) => ({
        id: d.id || d.label.toLowerCase().replace(/\s+/g, '-') || uuidv4(),
        name: d.label,
        explanation: d.description,
      }))

      return {
        distortions: distortionsWithIds,
        reframedThought: jsonResponse.reframe.text,
        justification: jsonResponse.reframe.explanation,
      }
    }

    // If the response is already in the expected format, return it
    if (
      jsonResponse.distortions &&
      jsonResponse.reframedThought &&
      jsonResponse.justification
    ) {
      // Ensure each distortion has an ID
      const distortionsWithIds = jsonResponse.distortions.map((d: any) => ({
        ...d,
        id: d.id || uuidv4(),
      }))

      return {
        distortions: distortionsWithIds,
        reframedThought: jsonResponse.reframedThought,
        justification: jsonResponse.justification,
      }
    }

    // If we got JSON but in an unexpected format, log it and throw an error
    console.error('LLM response is in an unexpected format:', jsonResponse)
    throw new Error('LLM response is in an unexpected format')
  } catch (e) {
    // Log the error and the raw response for debugging
    console.error('Error parsing LLM response:', e)
    console.error('Raw LLM response:', response)

    // Throw the error to be caught by the route handler
    throw new Error('Failed to parse LLM response')
  }
}
