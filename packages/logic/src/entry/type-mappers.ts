import type { Tables, TablesInsert, Database } from '@theragpt/config'
import { Entry, Reframe, DistortionInstance, DistortionType } from './types'

// Database types
export type DbEntry = Tables<'entries'>
export type DbEntryInsert = TablesInsert<'entries'>
export type DbReframe = Tables<'reframes'>
export type DbDistortionInstance = Tables<'distortion_instances'>

// Type mapping functions to convert between your app types and database types

export function mapDbEntryToAppEntry(
  dbEntry: DbEntry,
  reframes?: DbReframe[],
  distortionInstances?: (DbDistortionInstance & { distortions?: Tables<'distortions'> })[]
): Entry {
  return {
    id: dbEntry.id,
    title: dbEntry.title || undefined,
    category: dbEntry.category || undefined,
    rawText: dbEntry.raw_text,
    reframe: reframes?.[0] ? mapDbReframeToAppReframe(reframes[0]) : undefined,
    distortions: distortionInstances?.map(mapDbDistortionInstanceToApp) || undefined,
    strategies: dbEntry.strategies || undefined,
    createdAt: new Date(dbEntry.created_at).getTime(),
    updatedAt: dbEntry.updated_at ? new Date(dbEntry.updated_at).getTime() : undefined,
    isPinned: dbEntry.is_pinned || undefined,
  }
}

export function mapAppEntryToDbEntry(entry: Entry): DbEntryInsert {
  return {
    id: entry.id,
    title: entry.title || null,
    category: entry.category || null,
    raw_text: entry.rawText,
    strategies: entry.strategies || null,
    is_pinned: entry.isPinned || false,
    created_at: new Date(entry.createdAt).toISOString(),
    updated_at: entry.updatedAt ? new Date(entry.updatedAt).toISOString() : undefined,
  }
}

export function mapDbReframeToAppReframe(dbReframe: DbReframe): Reframe {
  return {
    id: dbReframe.id,
    entryId: dbReframe.entry_id,
    text: dbReframe.text,
    explanation: dbReframe.explanation,
  }
}

export function mapAppReframeToDbReframe(reframe: Reframe): Omit<TablesInsert<'reframes'>, 'id'> {
  return {
    entry_id: reframe.entryId,
    text: reframe.text,
    explanation: reframe.explanation,
  }
}

export function mapDbDistortionInstanceToApp(
  dbInstance: DbDistortionInstance & { distortions?: Tables<'distortions'> }
): DistortionInstance {
  return {
    id: dbInstance.id,
    label: dbInstance.distortions?.label || getDistortionLabel(dbInstance.distortion_id),
    distortionId: dbInstance.distortion_id as DistortionType,
    description: dbInstance.description,
    confidenceScore: dbInstance.confidence_score || undefined,
  }
}

export function mapAppDistortionInstanceToDb(
  instance: DistortionInstance,
  entryId: string
): Omit<TablesInsert<'distortion_instances'>, 'id'> {
  return {
    entry_id: entryId,
    distortion_id: instance.distortionId as Database['public']['Enums']['distortion_type'],
    description: instance.description,
    confidence_score: instance.confidenceScore || null,
  }
}

// Helper function to get distortion label from ID
function getDistortionLabel(distortionId: string): string {
  const labelMap: Record<string, string> = {
    'all-or-nothing-thinking': 'All-or-Nothing Thinking',
    'overgeneralization': 'Overgeneralization',
    'mental-filter': 'Mental Filter',
    'disqualifying-the-positive': 'Disqualifying the Positive',
    'jumping-to-conclusions': 'Jumping to Conclusions',
    'magnification': 'Magnification',
    'emotional-reasoning': 'Emotional Reasoning',
    'should-statements': 'Should Statements',
    'labeling': 'Labeling',
    'personalization': 'Personalization',
    'catastrophizing': 'Catastrophizing',
    'blaming': 'Blaming',
    'fortune-telling': 'Fortune Telling',
    'mind-reading': 'Mind Reading',
    'minimization': 'Minimization',
  }
  return labelMap[distortionId] || distortionId
}