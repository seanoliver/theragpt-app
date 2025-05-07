import { useEntryStore } from '@/packages/logic/src/entry/entry.store'
import { fetchPromptOutput } from '@/packages/logic/src/workflows/thought-analysis.workflow'
import { streamPromptOutput, StreamEvent } from '@/packages/logic/src/workflows/thought-analysis-stream.workflow'
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
  const router = useRouter()

  const [thought, setThought] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!thought.trim()) return
    setLoading(true)

    try {
      const prompt = getAnalyzePrompt({ rawText: thought })

      // Create a partial entry immediately with just the raw thought
      const partialEntry = await addEntry({
        id: '',
        rawText: thought,
        title: '',
        category: '',
        createdAt: Date.now(),
        // Initialize with empty values that will be updated as streaming data arrives
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

      // Redirect to the entry page immediately
      router.push(`/entry/${partialEntry.id}`)
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
