import { useEntryStore } from '@/packages/logic/src/entry/entry.store'
import { fetchPromptOutput } from '@/packages/logic/src/workflows/thought-analysis.workflow'
import {
  streamPromptOutput,
  StreamEvent,
} from '@/packages/logic/src/workflows/thought-analysis-stream.workflow'
import { getAnalyzePrompt } from '@theragpt/prompts'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Entry } from '@/packages/logic/src/entry/types';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!thought.trim()) return
    setLoading(true)
    setStreamingEntryId(null)

    try {
      const prompt = getAnalyzePrompt({ rawText: thought })

      // 1. Create a partial entry immediately
      const partialEntry = await addEntry({
        id: '',
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
      })

      if (!partialEntry) {
        throw new Error('Failed to create partial entry')
      }

      const entryId = partialEntry.id

      const entryPatch: Partial<Entry> = {}

      // 2. Kick off streaming request
      streamPromptOutput(prompt, thought, (event: StreamEvent) => {
        const { type, content, field, value } = event

        if (type === 'thought') {
          entryPatch.rawText = content
        } else if (type === 'field' && field) {
          (entryPatch as any)[field] = value
        } else if (type === 'complete') {
          Object.assign(entryPatch, content)
          // Ensure required fields are always defined when updating the entry
          updateEntry({
            ...entryPatch,
            id: entryId,
            rawText: entryPatch.rawText || thought, // Use original thought if rawText is undefined
            createdAt: entryPatch.createdAt || partialEntry.createdAt // Ensure createdAt is defined
          })
          setStreamingEntryId(null)
        } else if (type === 'error') {
          console.error('Streaming error:', content)
          setError(content)
          updateEntry({
            ...entryPatch,
            id: entryId,
            rawText: entryPatch.rawText || thought, // Ensure rawText is defined
            createdAt: entryPatch.createdAt || partialEntry.createdAt, // Ensure createdAt is defined
            reframe: {
              id: entryPatch.reframe?.id || '',
              entryId: entryId,
              text: 'An error occurred during analysis.',
              explanation:
                typeof content === 'string' ? content : 'Unknown error',
            },
          })
          setStreamingEntryId(null)
        }
      })

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
  }
}
