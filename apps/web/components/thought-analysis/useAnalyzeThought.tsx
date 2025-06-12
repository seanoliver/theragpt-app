import { useTracking } from '@/lib/analytics/useTracking'
import { useEntryStore } from '@theragpt/logic/src/entry/entry.store'
import { Entry } from '@theragpt/logic/src/entry/types'
import {
  StreamEvent,
  streamPromptOutput,
} from '@theragpt/logic/src/workflows/thought-analysis-stream.workflow'
import { getAnalyzePrompt } from '@theragpt/prompts'
import throttle from 'lodash.throttle'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  buildCurrentDisplayState,
  handleComplete,
  handleError,
  logChunk,
  normalizePatchArrays,
} from './helpers'

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
  const [analysisStartTime, setAnalysisStartTime] = useState<number | null>(
    null,
  )

  // Throttled update mechanism using lodash
  const throttledUpdate = useMemo(
    () =>
      throttle(
        (partialEntry: Entry, streamPatch: Partial<Entry>, entryId: string) => {
          const updatedEntry = buildCurrentDisplayState(
            streamPatch,
            partialEntry,
            entryId,
          )
          updateEntry(updatedEntry)
        },
        100,
        {
          // Update every 100ms max
          leading: true, // Call immediately on first invocation
          trailing: true, // Call after the wait period if invoked again
        },
      ),
    [updateEntry],
  )

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

      const entryId = uuidv4()

      const partialEntryData = {
        id: entryId,
        rawText: thought,
        title: '',
        category: '',
        createdAt: Date.now(),
        distortions: [],
        reframeText: '',
        reframeExplanation: '',
        strategies: [],
      }

      const partialEntry = await addEntry(partialEntryData)

      if (!partialEntry) {
        throw new Error('Failed to create partial entry')
      }

      setStreamingEntryId(entryId)

      track('thought_analysis_started', {
        entry_id: entryId,
        thought_length: thought.trim().length,
      })

      const streamPatch: Partial<Entry> = {}

      streamPromptOutput(prompt, thought, (event: StreamEvent) => {
        const { type, content } = event
        let needsStoreUpdate = false

        if (type === 'update') {
          // Update the streamPatch with the latest parsed object
          Object.assign(streamPatch, content)
          needsStoreUpdate = true
        } else if (type === 'chunk') {
          logChunk(event)
        } else if (type === 'complete') {
          // Clear any pending debounced updates
          if (throttledUpdate) {
            throttledUpdate(partialEntry, streamPatch, entryId)
          }

          const finalEntry = handleComplete(
            content,
            partialEntry,
            streamPatch,
            entryId,
            updateEntry,
            setStreamingEntryId,
          )

          if (analysisStartTime) {
            track('thought_analysis_completed', {
              entry_id: entryId,
              analysis_duration_ms: Date.now() - analysisStartTime,
              distortions_found: finalEntry.distortions?.length || 0,
              has_reframe: Boolean(finalEntry.reframeText),
            })
          }

          return
        } else if (type === 'error') {
          // Clear any pending debounced updates
          if (throttledUpdate) {
            throttledUpdate(partialEntry, streamPatch, entryId)
          }

          const errorEntry = handleError(
            content,
            partialEntry,
            streamPatch,
            entryId,
            updateEntry,
            analysisStartTime,
            setError,
            setStreamingEntryId,
          )

          if (analysisStartTime) {
            track('thought_analysis_failed', {
              entry_id: entryId,
              error_type: errorEntry.reframeExplanation ?? 'Unknown error',
              analysis_duration_ms: Date.now() - analysisStartTime,
            })
          }
          return
        } else {
          console.warn('[UI] Unhandled event type:', type, event)
        }

        if (needsStoreUpdate) {
          if (throttledUpdate) {
            throttledUpdate(partialEntry, streamPatch, entryId)
          }
        }
      })

      router.push(`/entry/${entryId}`)
    } catch (error) {
      console.error('Error analyzing thought:', error)
      setError('Failed to analyze thought')

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
