'use client'

import type React from 'react'

import { Textarea } from '@/apps/web/components/ui/textarea'
import {
  analyzeThought,
  useEntryStore,
  analyzeAndSaveThought,
} from '@theragpt/logic'
import { useEffect, useRef, useState } from 'react'
import { AnalyzeThoughtButton } from './AnalyzeThoughtButton'
import { ThoughtStarters } from './ThoughtStarters'
import { ThoughtStartersButton } from './ThoughtStartersButton'
import { AnalysisResult } from '@theragpt/logic'

export const ThoughtEntryForm = () => {
  // Local component state
  const [thought, setThought] = useState('')
  const [analysisResult, setAnalysisResult] = useState<
    AnalysisResult | undefined
  >(undefined)
  const [showStarters, setShowStarters] = useState(false)
  const startersRef = useRef<HTMLDivElement>(null)

  const isLoading = useEntryStore(state => state.isLoading)
  const setLoading = useEntryStore(state => state.setLoading)
  const setError = useEntryStore(state => state.setError)

  const hasAutoSaved = useRef(false)
  useEffect(() => {
    if (analysisResult && !hasAutoSaved.current) {
      handleSave()
      hasAutoSaved.current = true
    }
  }, [analysisResult])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!thought.trim()) return
    setLoading(true)

    try {
      const result = await analyzeThought(thought)
      setAnalysisResult(result)
    } catch (error) {
      console.error('Error analyzing thought:', error)
      setError('Failed to analyze thought')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!thought) return

    try {
      setLoading(true)
      const { analysisResult: savedResult } =
        await analyzeAndSaveThought(thought)
      if (!analysisResult) {
        setAnalysisResult(savedResult)
      }
    } catch (error) {
      console.error('Error saving entry:', error)
      setError('Failed to save entry')
    } finally {
      setLoading(false)
    }
  }

  const handleThoughtStarterClick = (starter: string) => {
    setThought(starter)
    const textarea = document.querySelector('textarea')
    if (textarea) {
      textarea.focus()
      const length = starter.length
      textarea.setSelectionRange(length, length)
    }
  }

  return (
    <div>
      <div className="flex-col">
        <form onSubmit={handleSubmit} className="relative space-y-4">
          <Textarea
            placeholder="What's a negative thought that's been bothering you?"
            className="min-h-[120px] p-4 shadow-md border-0 dark:border-0 focus:border-0 dark:focus:border-0 focus:ring-0 dark:focus:ring-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
            value={thought}
            onChange={e => setThought(e.target.value)}
            required
          />
          <div className="absolute bottom-0 right-0 p-2 gap-2 flex">
            <ThoughtStartersButton
              thought={thought}
              showStarters={showStarters}
              setShowStarters={setShowStarters}
            />
            <AnalyzeThoughtButton isLoading={isLoading} thought={thought} />
          </div>
        </form>
        <div
          ref={startersRef}
          className={`overflow-hidden transition-all shadow-md duration-300 ease-in-out ${
            showStarters
              ? 'max-h-[600px] opacity-100 mt-4'
              : 'max-h-0 opacity-0'
          }`}
        >
          <ThoughtStarters onSelect={handleThoughtStarterClick} />
        </div>
      </div>
    </div>
  )
}
