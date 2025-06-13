import type { Tables, TablesInsert } from '@theragpt/config'
import { DistortionInstance, DistortionType, Entry } from './types'

// Database types
export type DbEntry = Tables<'entries'>
export type DbEntryInsert = TablesInsert<'entries'>

// Type mapping functions to convert between your app types and database types

export const mapDbEntryToAppEntry = (dbEntry: DbEntry): Entry => {
  // Parse distortions from JSON
  let distortions: DistortionInstance[] | undefined = undefined
  if (dbEntry.distortions) {
    try {
      const parsedDistortions = Array.isArray(dbEntry.distortions)
        ? dbEntry.distortions
        : JSON.parse(dbEntry.distortions as string)

      if (Array.isArray(parsedDistortions)) {
        distortions = parsedDistortions.map((d: any) => ({
          label: d.label || getDistortionLabel(d.distortionId),
          type: d.distortionId as DistortionType,
          description: d.description || '',
        }))
      }
    } catch (error) {
      console.warn('Failed to parse distortions JSON:', error)
    }
  }

  return {
    id: dbEntry.id,
    title: dbEntry.title || undefined,
    category: dbEntry.category || undefined,
    rawText: dbEntry.raw_text,
    reframeText: dbEntry.reframe_text || undefined,
    reframeExplanation: dbEntry.reframe_explanation || undefined,
    distortions,
    strategies: dbEntry.strategies || undefined,
    createdAt: new Date(dbEntry.created_at).getTime(),
    updatedAt: dbEntry.updated_at
      ? new Date(dbEntry.updated_at).getTime()
      : undefined,
    isPinned: dbEntry.is_pinned || undefined,
  }
}

export const mapAppEntryToDbEntry = (entry: Entry): DbEntryInsert => {
  let distortionsJson: string | null = null
  if (entry.distortions && entry.distortions.length > 0) {
    distortionsJson = JSON.stringify(entry.distortions)
  }

  console.log('[🔴 Type Mappers] entry', entry)
  console.log('[🔴 Type Mappers] distortionsJson', distortionsJson)

  return {
    id: entry.id,
    title: entry.title || null,
    category: entry.category || null,
    raw_text: entry.rawText,
    strategies: entry.strategies || null,
    is_pinned: entry.isPinned || false,
    created_at: new Date(entry.createdAt).toISOString(),
    updated_at: entry.updatedAt
      ? new Date(entry.updatedAt).toISOString()
      : undefined,
    reframe_text: entry.reframeText || null,
    reframe_explanation: entry.reframeExplanation || null,
    distortions: distortionsJson,
  }
}

// Helper function to get distortion label from ID
const getDistortionLabel = (distortionId: string): string => {
  const labelMap: Record<string, string> = {
    'all-or-nothing-thinking': 'All-or-Nothing Thinking',
    overgeneralization: 'Overgeneralization',
    'mental-filter': 'Mental Filter',
    'disqualifying-the-positive': 'Disqualifying the Positive',
    'jumping-to-conclusions': 'Jumping to Conclusions',
    magnification: 'Magnification',
    'emotional-reasoning': 'Emotional Reasoning',
    'should-statements': 'Should Statements',
    labeling: 'Labeling',
    personalization: 'Personalization',
    catastrophizing: 'Catastrophizing',
    blaming: 'Blaming',
    'fortune-telling': 'Fortune Telling',
    'mind-reading': 'Mind Reading',
    minimization: 'Minimization',
  }
  return labelMap[distortionId] || distortionId
}
