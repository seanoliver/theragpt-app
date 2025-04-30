import { NextRequest, NextResponse } from 'next/server'
import { apiService } from '@still/logic/src/api'
import { getEnvironment } from '@still/config'

/**
 * API route for generating alternative cards in different tones
 * @param request The incoming request
 * @returns The API response
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body = await request.json()
    const { card, tones } = body

    if (typeof card !== 'string' || !Array.isArray(tones)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid request: card (string) and tones (string[]) are required.',
        },
        { status: 400 },
      )
    }

    // Get the OpenAI request configuration
    const openAIRequest = await apiService.generateAlternatives(
      card,
      tones,
    )

    // Get environment with server-side flag to access API key
    const env = getEnvironment(true)

    // Make the actual OpenAI API request
    const response = await fetch(`${env.OPENAI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(openAIRequest),
    })

    if (!response.ok) {
      throw new Error(
        `OpenAI API request failed with status ${response.status}`,
      )
    }

    const data = await response.json()
    // Parse the model's response content as JSON and extract alternatives
    let alternatives
    try {
      const parsed = JSON.parse(data.choices?.[0]?.message?.content)
      alternatives = parsed.alternatives
    } catch {
      throw new Error('Failed to parse alternatives JSON from LLM response')
    }
    if (!alternatives) {
      throw new Error('No alternatives found in LLM response')
    }

    return NextResponse.json(
      {
        success: true,
        alternatives,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error generating alternatives:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error generating alternatives',
      },
      { status: 500 },
    )
  }
}
