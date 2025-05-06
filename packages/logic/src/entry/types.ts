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
  icon: string
  label: (typeof DISTORTION_LABELS)[DistortionType]
  text: string
}

export interface DistortionInstance {
  id: string
  label: (typeof DISTORTION_LABELS)[DistortionType]
  distortionId: Distortion['id']
  explanation: string
}

export enum DistortionType {
  AllOrNothing = 'all-or-nothing',
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

export const DISTORTION_LABELS: Record<DistortionType, string> = {
  [DistortionType.AllOrNothing]: 'All-or-Nothing Thinking',
  [DistortionType.Overgeneralization]: 'Overgeneralization',
  [DistortionType.MentalFilter]: 'Mental Filter',
  [DistortionType.DisqualifyingThePositive]: 'Disqualifying the Positive',
  [DistortionType.JumpingToConclusions]: 'Jumping to Conclusions',
  [DistortionType.Magnification]: 'Magnification',
  [DistortionType.EmotionalReasoning]: 'Emotional Reasoning',
  [DistortionType.ShouldStatements]: 'Should Statements',
  [DistortionType.Labeling]: 'Labeling',
  [DistortionType.Personalization]: 'Personalization',
  [DistortionType.Catastrophizing]: 'Catastrophizing',
  [DistortionType.Blaming]: 'Blaming',
  [DistortionType.FortuneTelling]: 'Fortune Telling',
  [DistortionType.MindReading]: 'Mind Reading',
  [DistortionType.Minimization]: 'Minimization',
}
