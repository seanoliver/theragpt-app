import { v4 as uuidv4 } from 'uuid'
import {
  Thought,
  ThoughtAnalysis,
  ValidationResult,
  CognitiveDistortion,
} from './types'
import { Reframe } from '../reframe/types'
import {
  APIError,
  APIErrorType,
  LLMProvider,
  ThoughtAnalysisRequest,
} from '../api/types'
import { apiService } from '../api/service'
import { thoughtValidator } from './validation'
import { logger } from '../utils/logger'

/**
 * Extended CognitiveDistortion with nested reframes
 */
export interface DistortionWithReframes
  extends Omit<CognitiveDistortion, 'reframeIds'> {
  reframes: Omit<
    Reframe,
    | 'id'
    | 'userId'
    | 'originalThought'
    | 'distortionId'
    | 'createdAt'
    | 'lastReviewed'
    | 'nextReviewDate'
    | 'reviewCount'
    | 'isFavorite'
    | 'tags'
    | 'category'
  >[]
}

/**
 * Extended ThoughtAnalysis with distortions containing nested reframes
 */
export interface NestedThoughtAnalysis
  extends Omit<ThoughtAnalysis, 'distortions'> {
  distortions: DistortionWithReframes[]
}

/**
 * Interface for parsed distortion from LLM response
 */
interface ParsedDistortion {
  name: string;
  explanation: string;
  confidence?: number;
  reframes?: ParsedReframe[];
}

/**
 * Interface for parsed reframe from LLM response
 */
interface ParsedReframe {
  reframe: string;
  explanation: string;
}

/**
 * ThoughtAnalyzer class for analyzing thoughts
 */
export class ThoughtAnalyzer {
  /**
   * Validates a thought
   * @param thought The thought to validate
   * @returns Validation result
   */
  public validateThought(thought: Thought | string): ValidationResult {
    return thoughtValidator.validateThought(thought)
  }

  /**
   * Analyzes a thought using the API service
   * @param thought The thought to analyze
   * @param context Optional context for the thought
   * @returns Analysis result
   */
  public async analyzeThought(
    thought: Thought | string,
    context?: string,
  ): Promise<NestedThoughtAnalysis> {
    // Validate the thought
    const validationResult = this.validateThought(thought)
    if (!validationResult.valid) {
      throw new APIError(
        validationResult.error || 'Invalid thought',
        APIErrorType.VALIDATION_ERROR,
      )
    }

    // Create the request
    const request: ThoughtAnalysisRequest = {
      thought,
      context,
      provider: LLMProvider.OPENAI,
    }

    try {
      // Use the API service to make the request
      const response = await apiService.analyzeThought(request)

      if (!response.success || !response.data) {
        throw new APIError(
          response.error || 'Failed to analyze thought',
          APIErrorType.API_ERROR,
        )
      }

      // Transform the standard ThoughtAnalysis into our NestedThoughtAnalysis format
      // This is a temporary transformation until the API route is updated to return NestedThoughtAnalysis
      const analysis = response.data

      // Create a placeholder NestedThoughtAnalysis with empty reframes arrays
      const nestedAnalysis: NestedThoughtAnalysis = {
        originalThought: analysis.originalThought,
        explanation: analysis.explanation,
        distortions: analysis.distortions.map(distortion => ({
          id: distortion.id,
          name: distortion.name,
          explanation: distortion.explanation,
          confidence: distortion.confidence || 0,
          reframes: [], // Empty reframes array to be filled by the API route in the future
        })),
      }

      return nestedAnalysis
    } catch (error) {
      logger.error('Error analyzing thought', error as Error)

      if (error instanceof APIError) {
        throw error
      }

      throw new APIError(
        (error as Error).message || 'Unknown error analyzing thought',
        APIErrorType.UNKNOWN_ERROR,
      )
    }
  }

  /**
   * Constructs a prompt for OpenAI
   * This is a helper method that can be used by the API route
   * @param content The thought content
   * @param context Optional context for the thought
   * @returns Array of messages for the OpenAI API
   */
  public static constructPrompt(
    content: string,
    context?: string,
  ): { role: 'system' | 'user' | 'assistant'; content: string }[] {
    const messages = [
      {
        role: 'system' as const,
        content: `You are a cognitive behavioral therapy assistant. Your task is to analyze a thought and identify any cognitive distortions present in it.

For each distortion you identify, provide:
1. The name of the distortion
2. A brief explanation of why this thought exhibits this distortion
3. A confidence level (0-1) indicating how strongly this distortion is present
4. 1-2 possible reframes that challenge this specific distortion, each with its own explanation

Respond in JSON format with the following structure:
{
  "distortions": [
    {
      "name": "string",
      "explanation": "string",
      "confidence": number,
      "reframes": [
        {
          "reframe": "string",
          "explanation": "string"
        }
      ]
    }
  ],
  "explanation": "string"
}

The "explanation" field should provide a general analysis of the thought pattern.
Each distortion should have its own "reframes" array with reframes specifically addressing that distortion.`,
      },
      {
        role: 'user' as const,
        content: `Analyze this thought: "${content}"${
          context ? `\n\nContext: ${context}` : ''
        }`,
      },
    ]

    return messages
  }

  /**
   * Parses the OpenAI response into a NestedThoughtAnalysis
   * This is a helper method that can be used by the API route
   * @param responseContent The content from OpenAI response
   * @param thought The original thought
   * @returns The nested thought analysis
   */
  public static parseResponse(
    responseContent: string,
    thought: Thought,
  ): NestedThoughtAnalysis {
    try {
      // Parse the JSON response
      const parsedContent = JSON.parse(responseContent)

      // Map the distortions with nested reframes to our format
      const distortions: DistortionWithReframes[] = (
        parsedContent.distortions || []
      ).map((d: ParsedDistortion) => ({
        id: uuidv4(),
        name: d.name,
        explanation: d.explanation,
        confidence: d.confidence || 0,
        reframes: (d.reframes || []).map((r: ParsedReframe) => ({
          reframe: r.reframe,
          explanation: r.explanation,
        })),
      }))

      return {
        originalThought: thought,
        distortions,
        explanation: parsedContent.explanation || '',
      }
    } catch (error) {
      logger.error('Error parsing OpenAI response', error as Error)
      throw new APIError(
        'Failed to parse OpenAI response',
        APIErrorType.PARSING_ERROR,
      )
    }
  }
}

// Export a singleton instance for convenience
export const thoughtAnalyzer = new ThoughtAnalyzer()
