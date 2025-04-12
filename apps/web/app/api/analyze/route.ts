import { NextRequest, NextResponse } from 'next/server'
import { apiService } from '@theragpt/logic/src/api'
import { getEnvironment } from '@theragpt/config'

/**
 * API route for analyzing thoughts
 * @param request The incoming request
 * @returns The API response
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body = await request.json()

    // Get the OpenAI request configuration from the service
    const openAIRequest = await apiService.analyzeThought(body)

    // Get environment with server-side flag to access API key
    const env = getEnvironment(true)

    // Make the actual OpenAI API request
    const response = await fetch(env.OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(openAIRequest.data),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API request failed with status ${response.status}`)
    }

    const data = await response.json()
    const toolCall = data.choices[0].message.tool_calls[0]
    const analysis = JSON.parse(toolCall.function.arguments)

    return NextResponse.json({
      success: true,
      data: analysis,
    }, { status: 200 })
  } catch (error) {
    console.error('Error analyzing thought:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error analyzing thought',
      },
      { status: error instanceof Error && error.message.includes('not supported') ? 400 : 500 }
    )
  }
}
