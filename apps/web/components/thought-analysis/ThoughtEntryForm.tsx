'use client'

import { Textarea } from '@/apps/web/components/ui/textarea';
import { useRef, useState } from 'react';
import { AnalyzeThoughtButton } from './AnalyzeThoughtButton';
import { ModelSelector } from './ModelSelector';
import { ThoughtStarters } from './ThoughtStarters';
import { ThoughtStartersButton } from './ThoughtStartersButton';
import { useAnalyzeThought } from './useAnalyzeThought';
export const ThoughtEntryForm = () => {
  // Local component state
  const {
    handleSubmit,
    isLoading,
    thought,
    setThought,
    selectedModel,
    setSelectedModel,
  } = useAnalyzeThought()

  const [showStarters, setShowStarters] = useState(false)
  const startersRef = useRef<HTMLDivElement>(null)

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
        <div className="mb-4">
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            disabled={isLoading}
          />
        </div>
        <form onSubmit={handleSubmit} className="relative space-y-4">
          <Textarea
            placeholder="What's a negative thought that's been bothering you?"
            className="min-h-[120px] p-4 shadow-md border-0 dark:border-0 focus:border-0 dark:focus:border-0 focus:ring-0 dark:focus:ring-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm font-semibold"
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
