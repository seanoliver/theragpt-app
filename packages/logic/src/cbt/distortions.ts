export interface CognitiveDistortion {
  id: string
  label: string
  definition: string
}

export const COGNITIVE_DISTORTIONS: CognitiveDistortion[] = [
  {
    id: 'all-or-nothing',
    label: 'All-or-Nothing Thinking',
    definition:
      'Seeing things in black-or-white categories with no middle ground.',
  },
  {
    id: 'catastrophizing',
    label: 'Catastrophizing',
    definition: 'Expecting the worst possible outcome, no matter how unlikely.',
  },
  {
    id: 'mind-reading',
    label: 'Mind Reading',
    definition:
      'Assuming you know what others are thinking, usually something negative.',
  },
  {
    id: 'emotional-reasoning',
    label: 'Emotional Reasoning',
    definition:
      'Believing something must be true because you feel it strongly.',
  },
  {
    id: 'should-statements',
    label: 'Should Statements',
    definition:
      'Criticizing yourself or others with “shoulds,” “musts,” or “oughts.”',
  },
  {
    id: 'labeling',
    label: 'Labeling',
    definition: 'Assigning global negative traits to yourself or others.',
  },
  {
    id: 'mental-filter',
    label: 'Mental Filter',
    definition: 'Focusing only on the negatives and ignoring the positives.',
  },
  {
    id: 'overgeneralization',
    label: 'Overgeneralization',
    definition:
      'Seeing a single negative event as part of a never-ending pattern.',
  },
  {
    id: 'personalization',
    label: 'Personalization',
    definition: 'Blaming yourself for things outside your control.',
  },
]

export const DISTORTIONS_BY_ID = Object.fromEntries(
  COGNITIVE_DISTORTIONS.map(d => [d.id, d]),
)
