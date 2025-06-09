import { useEntryStore } from '@theragpt/logic/src/entry/entry.store'
import { DistortionType, Entry } from '@theragpt/logic/src/entry/types'
import {
  StreamEvent,
  streamPromptOutput,
} from '@theragpt/logic/src/workflows/thought-analysis-stream.workflow'
import { getAnalyzePrompt } from '@theragpt/prompts'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTracking } from '@/lib/analytics/useTracking'
import { usePathname } from 'next/navigation'

export const useAnalyzeThought = () => {
  const addEntry = useEntryStore(state => state.addEntry)
  const updateEntry = useEntryStore(state => state.updateEntry)
  const isLoading = useEntryStore(state => state.isLoading)
  const setLoading = useEntryStore(state => state.setLoading)
  const error = useEntryStore(state => state.error)
  const setError = useEntryStore(state => state.setError)
  const setStreamingEntryId = useEntryStore(state => state.setStreamingEntryId)
  const router = useRouter()
  const { track } = useTracking()
  const pathname = usePathname()

  const [thought, setThought] = useState('')
  const [analysisStartTime, setAnalysisStartTime] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!thought.trim()) return

    // Track thought submission
    const entryMethod = pathname === '/' ? 'homepage' : 'new_entry_page'
    track('thought_submitted', {
      thought_length: thought.trim().length,
      entry_method: entryMethod,
      thought_starter_used: false, // Will be overridden if thought starter was used
    })

    setLoading(true)
    setError(null) // Clear previous errors
    const startTime = Date.now()
    setAnalysisStartTime(startTime)

    try {
      const prompt = getAnalyzePrompt({ rawText: thought })

      // 1. Create a partial entry immediately
      const partialEntryData = {
        id: '', // ID will be assigned by addEntry
        rawText: thought,
        title: '',
        category: '',
        createdAt: Date.now(),
        distortions: [],
        reframe: {
          id: '',
          entryId: '',
          text: 'Analyzing your thought...',
          explanation: 'Please wait while we analyze your thought...',
        },
        strategies: [],
      }
      const partialEntry = await addEntry(partialEntryData)

      if (!partialEntry) {
        throw new Error('Failed to create partial entry')
      }

      const entryId = partialEntry.id
      setStreamingEntryId(entryId)

      // Track analysis start
      track('thought_analysis_started', {
        entry_id: entryId,
        thought_length: thought.trim().length,
      })

      const streamPatch: Partial<Entry> = {}

      streamPromptOutput(prompt, thought, (event: StreamEvent) => {
        const { type, content, field, value } = event
        let needsStoreUpdate = false

        console.log('[UI] Received event:', { type, content, field, value })

        if (type === 'field' && field && typeof field === 'string') {
          // If value is an object, merge it with existing streamPatch for that field
          if (
            typeof value === 'object' &&
            value !== null &&
            (streamPatch as any)[field] &&
            typeof (streamPatch as any)[field] === 'object'
          ) {
            // eslint-disable-next-line no-extra-semi
            ;(streamPatch as any)[field] = {
              ...((streamPatch as any)[field] || {}),
              ...value,
            }
          } else {
            // eslint-disable-next-line no-extra-semi
            ;(streamPatch as any)[field] = value
          }
          needsStoreUpdate = true
        } else if (type === 'chunk') {
          // Handle raw chunk data from API - just log for debugging
          // The API sends chunk events with raw content and chunkNumber for debugging
          console.log('[UI] Received chunk:', { content, chunkNumber: (event as any).chunkNumber })
          // Don't update UI state for raw chunks - field events handle the actual updates
        } else if (type === 'complete') {
          // `content` is the final, complete entry data.
          const finalEntry = {
            ...partialEntry, // Base with original createdAt, etc.
            ...streamPatch, // Intermediate streamed data
            ...content, // Final data from stream (should override streamPatch if fields overlap)
            id: entryId, // Ensure ID
            createdAt: partialEntry.createdAt, // Preserve original timestamp
          }
          if (finalEntry.reframe) finalEntry.reframe.entryId = entryId // Ensure reframe.entryId
          updateEntry(finalEntry)
          setStreamingEntryId(null)

          // Track successful analysis completion
          if (analysisStartTime) {
            track('thought_analysis_completed', {
              entry_id: entryId,
              analysis_duration_ms: Date.now() - analysisStartTime,
              distortions_found: finalEntry.distortions?.length || 0,
              has_reframe: Boolean(finalEntry.reframe?.text),
            })
          }

          return // Exit callback
        } else if (type === 'error') {
          console.error('[UI] Streaming error:', content)
          setError(typeof content === 'string' ? content : 'Streaming error')

          // Track analysis failure
          if (analysisStartTime) {
            track('thought_analysis_failed', {
              entry_id: entryId,
              error_type: typeof content === 'string' ? content : 'Unknown error',
              analysis_duration_ms: Date.now() - analysisStartTime,
            })
          }

          const errorEntryPayload = {
            ...partialEntry,
            ...streamPatch,
            id: entryId,
            reframe: {
              id: streamPatch.reframe?.id || partialEntry.reframe?.id || '',
              entryId: entryId,
              text: 'An error occurred during analysis.',
              explanation:
                typeof content === 'string' ? content : 'Unknown error',
            },
          }
          updateEntry(errorEntryPayload)
          setStreamingEntryId(null)
          return // Exit callback
        } else {
          // Log unhandled event types for debugging
          console.warn('[UI] Unhandled event type:', type, event)
        }

        if (needsStoreUpdate) {
          // Ensure distortions and strategies are always arrays
          if (
            streamPatch.distortions &&
            !Array.isArray(streamPatch.distortions)
          ) {
            if (typeof streamPatch.distortions === 'string') {
              // If it's a string (from streaming), convert to a placeholder array item
              streamPatch.distortions = [
                {
                  id: Date.now().toString(),
                  label: 'Processing...',
                  distortionId: DistortionType.AllOrNothingThinking, // Use a valid enum value
                  description: String(streamPatch.distortions),
                },
              ]
            } else {
              // Reset to empty array if it's not a valid array
              streamPatch.distortions = []
            }
          }

          if (
            streamPatch.strategies &&
            !Array.isArray(streamPatch.strategies)
          ) {
            if (typeof streamPatch.strategies === 'string') {
              // If it's a string (from streaming), convert to array
              streamPatch.strategies = [String(streamPatch.strategies)]
            } else {
              // Reset to empty array if it's not a valid array
              streamPatch.strategies = []
            }
          }

          // Ensure currentDisplayState fully conforms to Entry type for updateEntry
          const currentDisplayState: Entry = {
            id: entryId,
            rawText: (streamPatch.rawText !== undefined
              ? streamPatch.rawText
              : partialEntry.rawText) as string, // Explicitly cast
            title:
              streamPatch.title !== undefined
                ? streamPatch.title
                : partialEntry.title || '',
            category:
              streamPatch.category !== undefined
                ? streamPatch.category
                : partialEntry.category || '',
            createdAt: partialEntry.createdAt,
            updatedAt: Date.now(), // Update timestamp on each change to trigger re-renders
            isPinned:
              streamPatch.isPinned !== undefined
                ? streamPatch.isPinned
                : partialEntry.isPinned || false,
            distortions: Array.isArray(streamPatch.distortions)
              ? streamPatch.distortions
              : Array.isArray(partialEntry.distortions)
                ? partialEntry.distortions
                : [],
            strategies: Array.isArray(streamPatch.strategies)
              ? streamPatch.strategies
              : Array.isArray(partialEntry.strategies)
                ? partialEntry.strategies
                : [],
            reframe: {
              id: streamPatch.reframe?.id || partialEntry.reframe?.id || '',
              entryId: entryId, // Always ensure entryId is set
              text:
                streamPatch.reframe?.text || partialEntry.reframe?.text || '',
              explanation:
                streamPatch.reframe?.explanation ||
                partialEntry.reframe?.explanation ||
                '',
              ...(streamPatch.reframe || {}), // Apply any other streamed reframe fields
            },
          }

          // Ensure reframe.entryId is correctly set (redundant due to above but safe)
          if (currentDisplayState.reframe) {
            currentDisplayState.reframe.entryId = entryId
          }
          updateEntry(currentDisplayState)
        }
      })

      // 3. Redirect immediately
      router.push(`/entry/${entryId}`)
    } catch (error) {
      console.error('Error analyzing thought:', error)
      setError('Failed to analyze thought')

      // Track general failure
      if (analysisStartTime) {
        track('thought_analysis_failed', {
          entry_id: 'unknown',
          error_type: error instanceof Error ? error.message : 'Unknown error',
          analysis_duration_ms: Date.now() - analysisStartTime,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    handleSubmit,
    isLoading,
    error,
    thought,
    setThought,
  }
}
