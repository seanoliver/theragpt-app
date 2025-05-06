import { DISTORTION_LABELS } from './constants'

export interface Entry {
  id: string
  title?: string
  category?: string
  rawText: string
  reframe?: Reframe
  distortions?: DistortionInstance[]
  strategies?: string[]
  createdAt: number
  updatedAt?: number
  isPinned?: boolean
}

export type EntryListener = (entries: Entry[]) => void

export interface Reframe {
  id: string
  entryId: Entry['id']
  text: string
  explanation: string
}

export interface Distortion {
  id: DistortionType
  label: (typeof DISTORTION_LABELS)[DistortionType]
  description: string
  examples?: string[]
  strategies?: string[]
}

export interface DistortionInstance {
  id: string
  label: (typeof DISTORTION_LABELS)[DistortionType]
  distortionId: Distortion['id']
  description: string
  confidenceScore?: number
}

export enum DistortionType {
  AllOrNothingThinking = 'all-or-nothing-thinking',
  Overgeneralization = 'overgeneralization',
  MentalFilter = 'mental-filter',
  DisqualifyingThePositive = 'disqualifying-the-positive',
  JumpingToConclusions = 'jumping-to-conclusions',
  Magnification = 'magnification',
  EmotionalReasoning = 'emotional-reasoning',
  ShouldStatements = 'should-statements',
  Labeling = 'labeling',
  Personalization = 'personalization',
  Catastrophizing = 'catastrophizing',
  Blaming = 'blaming',
  FortuneTelling = 'fortune-telling',
  MindReading = 'mind-reading',
  Minimization = 'minimization',
}
