import { DistortionInstance } from '../entry/types'

export interface AnalysisResult {
  distortions: DistortionInstance[]
  reframedThought: string
  justification: string
}

export interface AnalysisResponse {
  result: AnalysisResult
}
