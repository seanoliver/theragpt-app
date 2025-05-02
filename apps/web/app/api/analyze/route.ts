import { NextRequest, NextResponse } from 'next/server'
import { analyzePrompt } from '@theragpt/prompts'
import { callLLM, LLMModel } from '@theragpt/llm'
import { createLLMRegistry } from '@/apps/web/lib/llm/create-llm-registry'
import { v4 as uuidv4 } from 'uuid'

const TEMPERATURE = 0.7
const MAX_TOKENS = 512

interface AnalysisResult {
  distortions: Array<{
    id: string
    name: string
    explanation: string
  }>
  reframedThought: string
  justification: string
}

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
      const parsedResult = parseLLMResponse(llmResponse)

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
                  // @ts-ignore - We're intentionally accessing properties dynamically
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

/**
 * Parse the LLM response into a structured format for the frontend
 *
 * Note: This is a simplified implementation. In a real-world scenario,
 * you would need to parse the actual LLM response format, which might be
 * JSON, markdown, or plain text that needs to be parsed.
 */
function parseLLMResponse(response: string): AnalysisResult {
  try {
    // Clean up the response to handle potential formatting issues
    let cleanedResponse = response.trim()

    // If the response starts with ``` (code block), extract the content
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\n/, '')
        .replace(/\n```$/, '')
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse
        .replace(/^```\n/, '')
        .replace(/\n```$/, '')
    }

    // Try to find JSON in the response if it's not a complete JSON
    if (!cleanedResponse.startsWith('{')) {
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        cleanedResponse = jsonMatch[0]
      }
    }

    console.log(
      'Cleaned response for parsing:',
      cleanedResponse.substring(0, 100) + '...',
    )

    // Attempt to parse as JSON
    const jsonResponse = JSON.parse(cleanedResponse)
    console.log('Parsed LLM response:', jsonResponse)

    // Handle the expected format from the prompt (distortions and reframe)
    if (jsonResponse.distortions && jsonResponse.reframe) {
      // Map the distortions from the LLM format to our expected format
      const distortionsWithIds = jsonResponse.distortions.map((d: any) => ({
        id: d.id || d.label?.toLowerCase().replace(/\s+/g, '-') || uuidv4(),
        name: d.label || '',
        explanation: d.description || '',
      }))

      return {
        distortions: distortionsWithIds,
        reframedThought: jsonResponse.reframe.text || '',
        justification: jsonResponse.reframe.explanation || '',
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
        id: d.id || d.name?.toLowerCase().replace(/\s+/g, '-') || uuidv4(),
      }))

      return {
        distortions: distortionsWithIds,
        reframedThought: jsonResponse.reframedThought,
        justification: jsonResponse.justification,
      }
    }

    // Try to handle other possible formats
    if (jsonResponse.distortions) {
      const distortionsWithIds = jsonResponse.distortions.map((d: any) => {
        // Handle different property naming conventions
        return {
          id:
            d.id ||
            (d.label || d.name)?.toLowerCase().replace(/\s+/g, '-') ||
            uuidv4(),
          name: d.label || d.name || '',
          explanation: d.description || d.explanation || '',
        }
      })

      return {
        distortions: distortionsWithIds,
        reframedThought:
          jsonResponse.reframe?.text || jsonResponse.reframedThought || '',
        justification:
          jsonResponse.reframe?.explanation || jsonResponse.justification || '',
      }
    }

    // If we got JSON but in an unexpected format, log it and throw an error
    console.error('LLM response is in an unexpected format:', jsonResponse)
    throw new Error('LLM response is in an unexpected format')
  } catch (e) {
    // Log the error and the raw response for debugging
    console.error('Error parsing LLM response:', e)
    console.error('Raw LLM response:', response)

    // Instead of throwing an error, return a fallback response
    console.warn('Using fallback response due to parsing error')

    // TODO: Don't love this, but it's fine for now
    return {
      distortions: [
        {
          id: 'parsing-error',
          name: 'Unable to analyze thought',
          explanation:
            'There was an error processing your thought. Please try again with a different thought or wording.',
        },
      ],
      reframedThought:
        'I was unable to properly analyze your thought. Please try again with a different thought or wording.',
      justification:
        'The system encountered an error while processing your thought. This could be due to the complexity of the thought or a temporary issue with the analysis system.',
    }
  }
}
