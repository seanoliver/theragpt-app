import { AnalysisResponse, AnalysisResult } from './types'

export const fetchPromptOutput = async (
  prompt: string,
): Promise<AnalysisResult> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
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
