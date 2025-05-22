import { useEntryStore } from '@/packages/logic/src/entry/entry.store'
import { DistortionType, Entry } from '@/packages/logic/src/entry/types'
import {
    StreamEvent,
    streamPromptOutput,
} from '@/packages/logic/src/workflows/thought-analysis-stream.workflow'
import { LLMModel } from '@theragpt/llm'
import { getAnalyzePrompt } from '@theragpt/prompts'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const useAnalyzeThought = () => {
  const addEntry = useEntryStore(state => state.addEntry)
  const updateEntry = useEntryStore(state => state.updateEntry)
  const isLoading = useEntryStore(state => state.isLoading)
  const setLoading = useEntryStore(state => state.setLoading)
  const error = useEntryStore(state => state.error)
  const setError = useEntryStore(state => state.setError)
  const setStreamingEntryId = useEntryStore(state => state.setStreamingEntryId)
  const router = useRouter()

  const [thought, setThought] = useState('')
  const [selectedModel, setSelectedModel] = useState<LLMModel>(LLMModel.CLAUDE_4_SONNET)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!thought.trim()) return
    setLoading(true)
    setLoading(true) // setLoading was already called, ensure it's true
    setError(null) // Clear previous errors

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

      const streamPatch: Partial<Entry> = {}

      streamPromptOutput(
        prompt,
        thought,
        (event: StreamEvent) => {
          const { type, content, field, value } = event
          let needsStoreUpdate = false

        if (type === 'thought') {
          streamPatch.rawText = content
          needsStoreUpdate = true
        } else if (type === 'field' && field && typeof field === 'string') {
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
        } else if (
          type === 'chunk' &&
          typeof field === 'string' &&
          content !== undefined &&
          content !== null
        ) {
          const keys = field.split('.')
          let tempObj = streamPatch as any
          for (let i = 0; i < keys.length - 1; i++) {
            tempObj[keys[i]] = tempObj[keys[i]] || {} // Ensure path exists
            tempObj = tempObj[keys[i]]
          }
          // Append content to the target string property
          tempObj[keys[keys.length - 1]] =
            (tempObj[keys[keys.length - 1]] || '') + String(content)
          needsStoreUpdate = true
        } else if (type === 'complete') {
          // `content` is the final, complete entry data.
          const finalEntry = {
            ...partialEntry, // Base with original createdAt, etc.
            ...streamPatch, // Intermediate streamed data
            ...content, // Final data from stream (should override streamPatch if fields overlap)
            id: entryId, // Ensure ID
          }
          if (finalEntry.reframe) finalEntry.reframe.entryId = entryId // Ensure reframe.entryId
          updateEntry(finalEntry)
          setStreamingEntryId(null)
          return // Exit callback
        } else if (type === 'error') {
          console.error('Streaming error:', content)
          setError(typeof content === 'string' ? content : 'Streaming error')
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
      },
      '/api/analyze-stream',
      undefined,
      selectedModel
      )

      // 3. Redirect immediately
      router.push(`/entry/${entryId}`)
    } catch (error) {
      console.error('Error analyzing thought:', error)
      setError('Failed to analyze thought')
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
    selectedModel,
    setSelectedModel,
  }
}
