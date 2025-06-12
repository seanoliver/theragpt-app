import { DISTORTION_LABELS } from './constants';

export interface Entry {
  id: string
  title?: string
  category?: string
  rawText: string
  reframeText?: string
  reframeExplanation?: string
  distortions?: DistortionInstance[]
  strategies?: string[]
  createdAt: number
  updatedAt?: number
  isPinned?: boolean
}

export type EntryListener = (entries: Entry[]) => void

export interface Distortion {
  id: DistortionType
  label: (typeof DISTORTION_LABELS)[DistortionType]
  description: string
  examples?: string[]
  strategies?: string[]
}

export interface DistortionInstance {
  label: (typeof DISTORTION_LABELS)[DistortionType]
  type: Distortion['id']
  description: string
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
