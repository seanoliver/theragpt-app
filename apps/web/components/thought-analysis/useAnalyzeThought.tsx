import { useEntryStore } from '@/packages/logic/src/entry/entry.store'
import { fetchPromptOutput } from '@/packages/logic/src/workflows/thought-analysis.workflow'
import { getAnalyzePrompt } from '@/packages/prompts/src'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const useAnalyzeThought = () => {
  const addEntry = useEntryStore(state => state.addEntry)
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
      const rawResult = await fetchPromptOutput(prompt)
      console.log('rawResult', rawResult)
      let result

      try {
        result =
          typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult
        console.log('result', result)
      } catch (err) {
        console.error('Failed to parse analysis result', err)
        setError('Failed to parse analysis result')
        setLoading(false)
        return
      }

      const entry = await addEntry({
        ...result,
        id: '',
        rawText: thought,
        createdAt: Date.now(),
      })
      if (entry) {
        router.push(`/entry/${entry.id}`)
      } else {
        setError('Failed to save entry')
      }
      console.log('entry', entry)
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
