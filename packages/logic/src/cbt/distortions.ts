export interface CognitiveDistortion {
  id: string
  label: string
  definition: string
}

export const PUBLIC_DISTORTIONS_LIST = [
  {
    id: 'catastrophizing',
    title: 'Catastrophizing',
    description:
      'Catastrophizing involves predicting the worst possible outcome for a situation with little or no evidence to support it. It\'s taking a minor negative event and imagining all the terrible things that might happen as a result.',
    examples: [
      'If I fail this test, I\'ll never get into a good college, and my whole future will be ruined.',
      'My headache must mean I have a brain tumor.',
      'My partner is late coming home. They must have been in a terrible accident.',
    ],
    reframing:
      'Ask yourself: What\'s the most likely outcome? What evidence do I have for my prediction? What would I tell a friend who had this worry? Consider multiple possible outcomes, not just the worst one.',
  },
  {
    id: 'all-or-nothing',
    title: 'All-or-Nothing Thinking',
    description:
      'All-or-nothing thinking (also called black-and-white thinking) is seeing situations in only two categories instead of on a continuum. If your performance falls short of perfect, you see yourself as a total failure.',
    examples: [
      'I made a mistake on this report, so it\'s completely worthless.',
      'If I\'m not the best at this, I\'m a failure.',
      'Either I do this perfectly or not at all.',
    ],
    reframing:
      'Look for the gray areas and nuances in situations. Recognize that most things exist on a spectrum rather than in absolute categories. Acknowledge partial successes and the value in imperfect efforts.',
  },
  {
    id: 'mind-reading',
    title: 'Mind Reading',
    description:
      'Mind reading is assuming you know what other people are thinking without having sufficient evidence. You arbitrarily conclude that someone is reacting negatively to you without verifying if this is true.',
    examples: [
      'My boss didn\'t smile at me this morning. She must be upset with my work.',
      'He\'s probably thinking I\'m incompetent.',
      'Everyone at this party must think I don\'t belong here.',
    ],
    reframing:
      'Remind yourself that you cannot read minds. Consider alternative explanations for behavior. When in doubt, ask directly rather than assuming what others are thinking.',
  },
  {
    id: 'emotional-reasoning',
    title: 'Emotional Reasoning',
    description:
      'Emotional reasoning is assuming that your negative emotions reflect the way things really are: "I feel it, therefore it must be true." Just because you feel something doesn\'t mean it\'s reality.',
    examples: [
      'I feel inadequate, so I must be incompetent.',
      'I feel guilty, so I must have done something wrong.',
      'I feel overwhelmed, so this task must be impossible.',
    ],
    reframing:
      'Recognize that emotions are not facts. They\'re signals, not reality. Ask yourself what evidence, beyond your feelings, supports your conclusion. Consider how you might view the situation if you felt differently.',
  },
  {
    id: 'overgeneralization',
    title: 'Overgeneralization',
    description:
      'Overgeneralization is taking one instance or example and incorrectly drawing a general conclusion. If something bad happens once, you expect it to happen over and over again.',
    examples: [
      'I failed one job interview, so I\'ll never get hired anywhere.',
      'That person was rude to me. People are always disrespectful.',
      'My last relationship ended badly. I\'ll always be alone.',
    ],
    reframing:
      'Look for counter-examples that disprove your generalization. Remind yourself that single events are not universal patterns. Use specific language instead of absolute terms like \'always\' or \'never\'.',
  },
  {
    id: 'labeling',
    title: 'Labeling',
    description:
      'Labeling is an extreme form of all-or-nothing thinking where you attach a negative label to yourself or others based on a single event or characteristic. Instead of describing an error, you attach a label to yourself or someone else.',
    examples: [
      'I made a mistake, so I\'m a failure.',
      'She forgot our lunch date. She\'s so inconsiderate.',
      'I couldn\'t solve that problem. I\'m an idiot.',
    ],
    reframing:
      'Separate behaviors from identity. Describe specific actions rather than applying global labels. Remember that everyone is complex and multifaceted, not defined by single actions or traits.',
  },
  {
    id: 'filtering',
    title: 'Mental Filtering',
    description:
      'Mental filtering is focusing exclusively on the negative aspects of a situation while ignoring the positive. It\'s like wearing dark glasses that only let you see the bad things in your life.',
    examples: [
      'My presentation went well, but I stumbled over one answer, so it was terrible.',
      'I got mostly positive feedback, but one person didn\'t like my work, so it\'s a failure.',
      'We had a great day together, but we argued about where to eat dinner, so the whole day was ruined.',
    ],
    reframing:
      'Deliberately look for positive aspects of situations. Ask yourself what went well, not just what went wrong. Consider the complete picture, including both positive and negative elements.',
  },
  {
    id: 'should-statements',
    title: 'Should Statements',
    description:
      'Should statements involve criticizing yourself or others with \'shoulds,\' \'musts,\' or \'oughts.\' These rigid demands create guilt and disappointment when applied to yourself, and anger and resentment when directed at others.',
    examples: [
      'I should always be productive.',
      'People should always be considerate of my feelings.',
      'I must never make mistakes.',
    ],
    reframing:
      'Replace rigid demands with preferences and realistic expectations. Consider what\'s reasonable rather than what\'s ideal. Use language like \'I prefer\' or \'It would be nice if\' instead of \'should\' or \'must\'.',
  },
  {
    id: 'personalization',
    title: 'Personalization',
    description:
      'Personalization is believing that you are responsible for events outside your control. You take things personally and blame yourself for external events or other people\'s behaviors that may have little or nothing to do with you.',
    examples: [
      'My child is struggling in school. I must be a terrible parent.',
      'The meeting didn\'t go well. It\'s all my fault.',
      'My friend is in a bad mood. It must be something I did.',
    ],
    reframing:
      'Consider multiple factors that contribute to outcomes, not just your actions. Recognize the limits of your control and influence. Ask yourself if you would hold someone else responsible in the same situation.',
  },
  {
    id: 'jumping-to-conclusions',
    title: 'Jumping to Conclusions',
    description:
      'Jumping to conclusions is making negative interpretations without actual evidence. You act like a mind reader (assuming you know what others are thinking) or a fortune teller (predicting that things will turn out badly).',
    examples: [
      'This headache means I have a brain tumor.',
      'They haven\'t called back, so they must not want to see me again.',
      'I know I\'ll mess up during my presentation tomorrow.',
    ],
    reframing:
      'Identify the evidence for and against your conclusion. Consider alternative explanations. Ask yourself what a neutral observer might think about the situation. Wait for more information before drawing conclusions.',
  },
]

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
