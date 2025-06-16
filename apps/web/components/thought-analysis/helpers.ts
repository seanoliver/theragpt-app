import { DistortionType, Entry, StreamEvent } from '@theragpt/logic'

/** Returns true if the event is a field update (has a string field and correct type) */
export const isFieldEvent = (type: string, field: unknown): boolean =>
  type === 'field' && typeof field === 'string'

/** Returns true if the value is a non-null object */
export const isObjectEvent = (value: unknown): boolean =>
  typeof value === 'object' && value !== null

/** Generic utility to update a field in an object in a type-safe way */
export const updateField = <T extends Record<string, any>>(
  obj: T,
  field: keyof T,
  value: any,
) => {
  const existing = obj[field]
  obj[field] = isObjectEvent(value) ? { ...existing, ...value } : value
}

/** Logs raw chunk events for debugging, including chunk number */
export const logChunk = (event: StreamEvent) => {
  console.debug('[UI] Received chunk:', {
    content: event.content,
    chunkNumber: (event as any).chunkNumber,
  })
}

/**
 * Handles the 'complete' event by constructing a final Entry
 * and calling updateEntry.
 */
export const handleComplete = (
  content: any,
  partialEntry: Entry,
  patch: Partial<Entry>,
  entryId: string,
  updateEntry: (entry: Entry) => void,
  setStreamingEntryId: (id: string | null) => void,
) => {
  // If content is null or empty, don't spread it at all - just use partialEntry + patch
  const finalEntry: Entry =
    content && typeof content === 'object' && Object.keys(content).length > 0
      ? {
          ...partialEntry,
          ...patch,
          ...content,
          id: entryId,
          createdAt: partialEntry.createdAt,
        }
      : {
          ...partialEntry,
          ...patch,
          id: entryId,
          createdAt: partialEntry.createdAt,
        }

  if (Array.isArray(finalEntry.distortions)) {
    finalEntry.distortions = finalEntry.distortions.map(d => ({
      ...d,
    }))
  }

  updateEntry(finalEntry)
  setStreamingEntryId(null)

  return finalEntry
}

/**
 * Handles the 'error' event by displaying an error message,
 * tracking failure, and updating the entry with an error reframe.
 */
export const handleError = (
  content: any,
  partialEntry: Entry,
  patch: Partial<Entry>,
  entryId: string,
  updateEntry: (entry: Entry) => void,
  analysisStartTime: number | null,
  setError: (msg: string) => void,
  setStreamingEntryId: (id: string | null) => void,
) => {
  const message = typeof content === 'string' ? content : 'Streaming error'
  console.error('[UI] Streaming error:', message)
  setError(message)

  const errorEntryPayload: Entry = {
    ...partialEntry,
    ...patch,
    id: entryId,
    reframeText: 'An error occurred during analysis.',
    reframeExplanation: message,
  }

  updateEntry(errorEntryPayload)
  setStreamingEntryId(null)

  return errorEntryPayload
}

/**
 * Normalizes `distortions` and `strategies` fields in the patch
 * to ensure they're always valid arrays.
 */
export const normalizePatchArrays = (patch: Partial<Entry>) => {
  if (!Array.isArray(patch.distortions)) {
    patch.distortions =
      typeof patch.distortions === 'string'
        ? [
            {
              label: 'Processing...',
              type: DistortionType.AllOrNothingThinking,
              description: String(patch.distortions),
            },
          ]
        : []
  }

  if (!Array.isArray(patch.strategies)) {
    patch.strategies =
      typeof patch.strategies === 'string' ? [String(patch.strategies)] : []
  }
}

/**
 * Builds the in-progress UI state from the patch and partialEntry,
 * ensuring all required fields are present.
 */
export const buildCurrentDisplayState = (
  patch: Partial<Entry>,
  partialEntry: Entry,
  entryId: string,
): Entry => ({
  id: entryId,
  rawText: patch.rawText ?? partialEntry.rawText,
  title: patch.title ?? partialEntry.title ?? '',
  category: patch.category ?? partialEntry.category ?? '',
  createdAt: partialEntry.createdAt,
  updatedAt: Date.now(),
  isPinned: patch.isPinned ?? partialEntry.isPinned ?? false,
  distortions: patch.distortions ?? partialEntry.distortions ?? [],
  strategies: patch.strategies ?? partialEntry.strategies ?? [],
  reframeText: patch.reframeText ?? partialEntry.reframeText ?? '',
  reframeExplanation:
    patch.reframeExplanation ?? partialEntry.reframeExplanation ?? '',
})
