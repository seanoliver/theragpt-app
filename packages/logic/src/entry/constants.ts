import { Distortion, DistortionType } from './types'

export const DISTORTION_LABELS: Record<DistortionType, string> = {
  [DistortionType.AllOrNothingThinking]: 'All-or-Nothing Thinking',
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

export const DISTORTIONS: Distortion[] = [
  {
    id: DistortionType.Catastrophizing,
    label: 'Catastrophizing',
    description:
      'Catastrophizing involves predicting the worst possible outcome for a situation with little or no evidence to support it. It\'s taking a minor negative event and imagining all the terrible things that might happen as a result.',
    examples: [
      'If I fail this test, I\'ll never get into a good college, and my whole future will be ruined.',
      'My headache must mean I have a brain tumor.',
      'My partner is late coming home. They must have been in a terrible accident.',
    ],
    strategies: [
      'Ask yourself: What\'s the most likely outcome? What evidence do I have for my prediction? What would I tell a friend who had this worry? Consider multiple possible outcomes, not just the worst one.',
    ],
  },
  {
    id: DistortionType.AllOrNothingThinking,
    label: 'All-or-Nothing Thinking',
    description:
      'All-or-nothing thinking (also called black-and-white thinking) is seeing situations in only two categories instead of on a continuum. If your performance falls short of perfect, you see yourself as a total failure.',
    examples: [
      'I made a mistake on this report, so it\'s completely worthless.',
      'If I\'m not the best at this, I\'m a failure.',
      'Either I do this perfectly or not at all.',
    ],
    strategies: [
      'Look for the gray areas and nuances in situations. Recognize that most things exist on a spectrum rather than in absolute categories. Acknowledge partial successes and the value in imperfect efforts.',
    ],
  },
  {
    id: DistortionType.MindReading,
    label: 'Mind Reading',
    description:
      'Mind reading is assuming you know what other people are thinking without having sufficient evidence. You arbitrarily conclude that someone is reacting negatively to you without verifying if this is true.',
    examples: [
      'My boss didn\'t smile at me this morning. She must be upset with my work.',
      'He\'s probably thinking I\'m incompetent.',
      'Everyone at this party must think I don\'t belong here.',
    ],
    strategies: [
      'Remind yourself that you cannot read minds. Consider alternative explanations for behavior. When in doubt, ask directly rather than assuming what others are thinking.',
    ],
  },
  {
    id: DistortionType.EmotionalReasoning,
    label: 'Emotional Reasoning',
    description:
      'Emotional reasoning is assuming that your negative emotions reflect the way things really are: "I feel it, therefore it must be true." Just because you feel something doesn\'t mean it\'s reality.',
    examples: [
      'I feel inadequate, so I must be incompetent.',
      'I feel guilty, so I must have done something wrong.',
      'I feel overwhelmed, so this task must be impossible.',
    ],
    strategies: [
      'Recognize that emotions are not facts. They\'re signals, not reality. Ask yourself what evidence, beyond your feelings, supports your conclusion. Consider how you might view the situation if you felt differently.',
    ],
  },
  {
    id: DistortionType.Overgeneralization,
    label: 'Overgeneralization',
    description:
      'Overgeneralization is taking one instance or example and incorrectly drawing a general conclusion. If something bad happens once, you expect it to happen over and over again.',
    examples: [
      'I failed one job interview, so I\'ll never get hired anywhere.',
      'That person was rude to me. People are always disrespectful.',
      'My last relationship ended badly. I\'ll always be alone.',
    ],
    strategies: [
      'Look for counter-examples that disprove your generalization. Remind yourself that single events are not universal patterns. Use specific language instead of absolute terms like \'always\' or \'never\'.',
    ],
  },
  {
    id: DistortionType.Labeling,
    label: 'Labeling',
    description:
      'Labeling is an extreme form of all-or-nothing thinking where you attach a negative label to yourself or others based on a single event or characteristic. Instead of describing an error, you attach a label to yourself or someone else.',
    examples: [
      'I made a mistake, so I\'m a failure.',
      'She forgot our lunch date. She\'s so inconsiderate.',
      'I couldn\'t solve that problem. I\'m an idiot.',
    ],
    strategies: [
      'Separate behaviors from identity. Describe specific actions rather than applying global labels. Remember that everyone is complex and multifaceted, not defined by single actions or traits.',
    ],
  },
  {
    id: DistortionType.MentalFilter,
    label: 'Mental Filter',
    description:
      'Mental filtering is focusing exclusively on the negative aspects of a situation while ignoring the positive. It\'s like wearing dark glasses that only let you see the bad things in your life.',
    examples: [
      'My presentation went well, but I stumbled over one answer, so it was terrible.',
      'I got mostly positive feedback, but one person didn\'t like my work, so it\'s a failure.',
      'We had a great day together, but we argued about where to eat dinner, so the whole day was ruined.',
    ],
    strategies: [
      'Deliberately look for positive aspects of situations. Ask yourself what went well, not just what went wrong. Consider the complete picture, including both positive and negative elements.',
    ],
  },
  {
    id: DistortionType.ShouldStatements,
    label: 'Should Statements',
    description:
      'Should statements involve criticizing yourself or others with \'shoulds,\' \'musts,\' or \'oughts.\' These rigid demands create guilt and disappointment when applied to yourself, and anger and resentment when directed at others.',
    examples: [
      'I should always be productive.',
      'People should always be considerate of my feelings.',
      'I must never make mistakes.',
    ],
    strategies: [
      'Replace rigid demands with preferences and realistic expectations. Consider what\'s reasonable rather than what\'s ideal. Use language like \'I prefer\' or \'It would be nice if\' instead of \'should\' or \'must\'.',
    ],
  },
  {
    id: DistortionType.Personalization,
    label: 'Personalization',
    description:
      'Personalization is believing that you are responsible for events outside your control. You take things personally and blame yourself for external events or other people\'s behaviors that may have little or nothing to do with you.',
    examples: [
      'My child is struggling in school. I must be a terrible parent.',
      'The meeting didn\'t go well. It\'s all my fault.',
      'My friend is in a bad mood. It must be something I did.',
    ],
    strategies: [
      'Consider multiple factors that contribute to outcomes, not just your actions. Recognize the limits of your control and influence. Ask yourself if you would hold someone else responsible in the same situation.',
    ],
  },
  {
    id: DistortionType.JumpingToConclusions,
    label: 'Jumping to Conclusions',
    description:
      'Jumping to conclusions is making negative interpretations without actual evidence. You act like a mind reader (assuming you know what others are thinking) or a fortune teller (predicting that things will turn out badly).',
    examples: [
      'This headache means I have a brain tumor.',
      'They haven\'t called back, so they must not want to see me again.',
      'I know I\'ll mess up during my presentation tomorrow.',
    ],
    strategies: [
      'Identify the evidence for and against your conclusion. Consider alternative explanations. Ask yourself what a neutral observer might think about the situation. Wait for more information before drawing conclusions.',
    ],
  },
  {
    id: DistortionType.DisqualifyingThePositive,
    label: 'Disqualifying the Positive',
    description:
      'Disqualifying the positive is rejecting positive experiences by insisting they "don\'t count." If you do a good job, you may tell yourself that it wasn\'t good enough or that anyone could have done it.',
    examples: [
      'My boss complimented my work, but she was just being nice.',
      'I did well on the presentation, but that was just luck.',
      'Sure, I got the job, but they probably couldn\'t find anyone better.',
    ],
    strategies: [
      'Practice acknowledging and accepting compliments. Keep a success journal to document positive experiences. Challenge yourself to find at least one positive aspect in situations before dismissing them.',
    ],
  },
  {
    id: DistortionType.Magnification,
    label: 'Magnification',
    description:
      'Magnification (also called "catastrophizing") involves exaggerating the importance of negative events or mistakes. It\'s taking a minor negative event and making it into a major catastrophe.',
    examples: [
      'I made a small error in my report. My career is over!',
      'I forgot to call my friend back. She\'ll never speak to me again.',
      'I failed one test. I\'ll never get into a good college.',
    ],
    strategies: [
      'Ask yourself: "How important will this be in six months or a year?" Use a scale from 1-10 to rate how bad a situation really is. Consider what advice you would give a friend in the same situation.',
    ],
  },
  {
    id: DistortionType.Blaming,
    label: 'Blaming',
    description:
      'Blaming is holding others responsible for your pain or blaming yourself for every problem. When exclusively blaming others, you avoid taking responsibility for your role in the situation. When blaming yourself, you take responsibility for things outside your control.',
    examples: [
      'It\'s your fault I\'m unhappy in this relationship.',
      'If only my parents had been more supportive, I wouldn\'t have these problems.',
      'I\'m responsible for everyone\'s happiness at the party.',
    ],
    strategies: [
      'Identify all factors that contribute to a situation, not just one person\'s actions. Recognize the difference between responsibility and blame. Focus on solutions rather than assigning fault.',
    ],
  },
  {
    id: DistortionType.FortuneTelling,
    label: 'Fortune Telling',
    description:
      'Fortune telling is predicting that things will turn out badly without adequate evidence. You arbitrarily predict that things will go wrong, acting as if your prediction is an established fact.',
    examples: [
      'I\'ll never find a job that I enjoy.',
      'I\'m going to fail this interview.',
      'No one will like me at the party.',
    ],
    strategies: [
      'Identify the evidence for and against your prediction. Consider alternative outcomes. Remind yourself that you cannot predict the future. Focus on what you can control in the present.',
    ],
  },
  {
    id: DistortionType.Minimization,
    label: 'Minimization',
    description:
      'Minimization is the opposite of magnification. It\'s downplaying the significance of positive events, accomplishments, or qualities. You shrink your positive qualities and achievements until they appear insignificant.',
    examples: [
      'I got a promotion, but it\'s not a big deal. Anyone could have done it.',
      'Sure, I can play the piano, but I\'m not that good.',
      'I graduated with honors, but the program wasn\'t very challenging.',
    ],
    strategies: [
      'Practice acknowledging your achievements without adding qualifiers. Ask trusted friends to help you recognize your strengths. Keep a journal of your accomplishments and positive qualities.',
    ],
  },
]
