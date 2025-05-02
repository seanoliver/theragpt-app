import { COGNITIVE_DISTORTIONS, CognitiveDistortion } from '@theragpt/logic'

export interface AnalyzeInput {
  rawText: string
  tone?: string
}

export const analyzePrompt = ({ rawText, tone }: AnalyzeInput): string => {
  const distortionList = COGNITIVE_DISTORTIONS.map(
    (d: CognitiveDistortion) => `- ${d.label}: ${d.definition}`,
  ).join('\n')

  return `
You are a clinically-informed AI trained in Cognitive Behavioral Therapy (CBT). A user has submitted the following negative thought:

"${rawText}"

Your job is to:
1. Identify up to **3 cognitive distortions** present in the thought.
2. Choose only from the following list of distortions:\n\n${distortionList}
3. Reframe the thought using CBT principles in a ${tone || 'neutral'} tone.
4. Return your results in **valid JSON** using the schema below. Do not include commentary outside the JSON.

Schema:
{
  "distortions": [
    {
      "label": "string",             // Must match one of the distortion labels
      "description": "string",      // Why this distortion applies
      "confidenceScore": number     // Between 0 and 1
    }
  ],
  "reframe": {
    "text": "string",               // A rational, believable reframe
    "explanation": "string"        // Why this reframe is helpful
  }
}

Only return the JSON.
`
}
