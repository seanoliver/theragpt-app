import { AnalysisResult, AnalysisResponse } from './types'
import { useEntryStore } from '../entry/entry.store'
import { DistortionInstance } from '../entry/types'
import { v4 as uuidv4 } from 'uuid'

/**
 * Analyzes a thought using the AI service
 *
 * This function sends the thought to the API for analysis and returns the result.
 * It handles error cases and provides appropriate error messages.
 *
 * @param thought The thought to analyze
 * @returns The analysis result containing distortions and reframed thought
 */
export const analyzeThought = async (
  thought: string,
): Promise<AnalysisResult> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        thought: thought.trim(),
        tone: 'supportive', // TODO: Make this configurable
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to analyze thought')
    }

    const data: AnalysisResponse = await response.json()
    return data.result
  } catch (error) {
    console.error('Error analyzing thought:', error)
    throw new Error('Failed to analyze thought')
  }
}

/**
 * Parse the LLM response into a structured format for the frontend
 *
 * Note: This is a simplified implementation. In a real-world scenario,
 * you would need to parse the actual LLM response format, which might be
 * JSON, markdown, or plain text that needs to be parsed.
 */
export const parseAnalysisResponse = (response: string): AnalysisResult => {
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

    // eslint-disable-next-line no-console
    console.log(
      'Cleaned response for parsing:',
      cleanedResponse.substring(0, 100) + '...',
    )

    // Attempt to parse as JSON
    const jsonResponse = JSON.parse(cleanedResponse)
    // eslint-disable-next-line no-console
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
          label: 'Unable to analyze thought',
          distortionId: 'parsing-error',
          explanation:
            'There was an error processing your thought. Please try again with a different thought or wording.',
        },
      ],
      reframedThought:
        'I was unable to properly analy ze your thought. Please try again with a different thought or wording.',
      justification:
        'The system encountered an error while processing your thought. This could be due to the complexity of the thought or a temporary issue with the analysis system.',
    }
  }
}

/**
 * Creates distortion instances from the analysis result
 *
 * The API returns distortions with properties that we need to map to our
 * DistortionInstance type. We extract the explanation and use the ID as both
 * the distortion ID and a temporary label.
 */
const createDistortionInstances = (
  analysisResult: AnalysisResult,
): DistortionInstance[] => {
  return analysisResult.distortions.map(distortion => ({
    id: distortion.id,
    distortionId: distortion.id,
    explanation: distortion.explanation || '',
    label: distortion.label || distortion.id,
    timestamp: Date.now(),
  }))
}

/**
 * Complete workflow for analyzing a thought and saving it with its analysis results
 *
 * This function:
 * 1. Analyzes the thought using the AI service
 * 2. Creates a new entry with the thought text
 * 3. Updates the entry with any identified cognitive distortions
 * 4. Adds a reframe to the entry if one was generated
 *
 * @param thought The negative thought to analyze and save
 * @returns The created entry and analysis result
 */
export const analyzeAndSaveThought = async (thought: string) => {
  // 1. Analyze the thought
  const analysisResult = await analyzeThought(thought)

  // 2. Save the entry with distortions and reframes
  const entry = await useEntryStore.getState().addEntry({
    id: '', // Will be generated by the service
    rawText: thought,
    createdAt: Date.now(),
  })

  if (!entry) {
    throw new Error('Failed to create entry')
  }

  // 3. Update with distortions
  if (analysisResult.distortions.length > 0) {
    const distortionInstances = createDistortionInstances(analysisResult)
    await useEntryStore.getState().updateEntry({
      ...entry,
      distortions: distortionInstances,
    })
  }

  // 4. Add reframe if available
  if (analysisResult.reframedThought) {
    // We'll update the store to include this method in the next step
    await useEntryStore.getState().addReframe(entry.id, {
      text: analysisResult.reframedThought,
      source: 'ai',
      style: 'supportive',
      explanation: analysisResult.justification,
    })
  }

  return { entry, analysisResult }
}
