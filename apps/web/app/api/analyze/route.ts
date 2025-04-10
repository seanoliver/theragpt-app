import { NextRequest, NextResponse } from 'next/server'
import { getEnvironment } from '@theragpt/config'
import {
  ThoughtAnalysisRequest,
  ThoughtAnalysisResponse,
  LLMProvider,
  LLMProviderFactory,
  LLMProviderConfig,
} from '@theragpt/logic/src/api'
import { Thought, thoughtValidator } from '@theragpt/logic/src/thought'
import { v4 as uuidv4 } from 'uuid'

/**
 * API route for analyzing thoughts
 * @param request The incoming request
 * @returns The API response
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    // Parse the request body
    const body = (await request.json()) as ThoughtAnalysisRequest

    // Validate the thought
    const thought =
      typeof body.thought === 'string' ? body.thought : body.thought.content

    const validationResult = thoughtValidator.validateContent(thought)
    if (!validationResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error || 'Invalid thought',
        } as ThoughtAnalysisResponse,
        { status: 400 },
      )
    }

    // Create a Thought object if string was provided
    const thoughtObj: Thought =
      typeof body.thought === 'string'
        ? {
            id: uuidv4(),
            content: body.thought,
            context: body.context,
            createdAt: Date.now(),
          }
        : body.thought

    // Get the provider from the request or use the default
    const provider = body.provider || LLMProvider.OPENAI

    // Get environment with server-side flag to access API key
    const env = getEnvironment(true)

    // Create the provider configuration
    const config: LLMProviderConfig = {
      apiUrl: env.OPENAI_API_URL,
      apiKey: env.OPENAI_API_KEY,
    }

    try {
      // Create the provider
      const llmProvider = await LLMProviderFactory.createProvider(
        provider,
        config,
      )

      // Analyze the thought
      const analysis = await llmProvider.analyzeThought(
        thoughtObj,
        body.context || thoughtObj.context,
      )

      // Convert NestedThoughtAnalysis to ThoughtAnalysis format
      // This is needed because ThoughtAnalysisResponse expects distortions with reframeIds
      const standardAnalysis = {
        originalThought: analysis.originalThought,
        explanation: analysis.explanation,
        distortions: analysis.distortions.map(distortion => ({
          id: distortion.id,
          name: distortion.name,
          explanation: distortion.explanation,
          confidence: distortion.confidence,
          reframeIds: [], // Empty array as we're not using reframeIds in this context
        })),
      }

      // Return the analysis
      return NextResponse.json(
        {
          success: true,
          data: standardAnalysis,
        } as ThoughtAnalysisResponse,
        { status: 200 },
      )
    } catch (error) {
      if (error instanceof Error && error.message.includes('not supported')) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
          } as ThoughtAnalysisResponse,
          { status: 400 },
        )
      }

      throw error
    }
  } catch (error) {
    console.error('Error analyzing thought:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error analyzing thought',
      } as ThoughtAnalysisResponse,
      { status: 500 },
    )
  }
}
