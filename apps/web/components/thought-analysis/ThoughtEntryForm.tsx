'use client'

import { Textarea } from '@/apps/web/components/ui/textarea'
import { useRef, useState, useEffect } from 'react'
import { AnalyzeThoughtButton } from './AnalyzeThoughtButton'
import { ThoughtStarters } from './ThoughtStarters'
import { ThoughtStartersButton } from './ThoughtStartersButton'
import { useAnalyzeThought } from './useAnalyzeThought'
import { useTracking } from '@/apps/web/lib/analytics/useTracking'
import { usePathname } from 'next/navigation'
export const ThoughtEntryForm = () => {
  // Local component state
  const { handleSubmit, isLoading, thought, setThought } = useAnalyzeThought()
  const { track } = useTracking()
  const pathname = usePathname()

  const [showStarters, setShowStarters] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null)
  const startersRef = useRef<HTMLDivElement>(null)

  // Determine entry method based on current page
  const getEntryMethod = (): 'homepage' | 'new_entry_page' => {
    return pathname === '/' ? 'homepage' : 'new_entry_page'
  }

  const handleThoughtStarterClick = (starter: string, index: number) => {
    track('thought_starter_used', {
      starter_text: starter,
      starter_position: index,
    })
    
    setThought(starter)
    const textarea = document.querySelector('textarea')
    if (textarea) {
      textarea.focus()
      const length = starter.length
      textarea.setSelectionRange(length, length)
    }
  }

  const handleShowStarters = (value: React.SetStateAction<boolean>) => {
    const newValue = typeof value === 'function' ? value(showStarters) : value
    if (newValue) {
      track('thought_starter_menu_opened', {})
    }
    setShowStarters(newValue)
  }

  const handleTextareaFocus = () => {
    track('form_engagement', {
      form_type: 'thought_entry',
      action: 'focus',
      character_count: thought.length,
    })
  }

  const handleTextareaBlur = () => {
    track('form_engagement', {
      form_type: 'thought_entry',
      action: 'blur',
      character_count: thought.length,
    })
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setThought(newValue)

    // Track typing start
    if (!isTyping && newValue.length > thought.length) {
      setIsTyping(true)
      track('form_engagement', {
        form_type: 'thought_entry',
        action: 'typing_started',
        character_count: newValue.length,
      })
    }

    // Reset typing timer
    if (typingTimer) {
      clearTimeout(typingTimer)
    }

    // Set new timer to detect when user stops typing
    const newTimer = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false)
        track('form_engagement', {
          form_type: 'thought_entry',
          action: 'typing_stopped',
          character_count: newValue.length,
        })
      }
    }, 2000) // 2 seconds of inactivity

    setTypingTimer(newTimer)
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimer) {
        clearTimeout(typingTimer)
      }
    }
  }, [typingTimer])

  return (
    <div>
      <div className="flex-col">
        <form onSubmit={handleSubmit} className="relative space-y-4">
          <Textarea
            placeholder="What's a negative thought that's been bothering you?"
            className="min-h-[120px] p-4 shadow-md border-0 dark:border-0 focus:border-0 dark:focus:border-0 focus:ring-0 dark:focus:ring-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm font-semibold"
            value={thought}
            onChange={handleTextareaChange}
            onFocus={handleTextareaFocus}
            onBlur={handleTextareaBlur}
            required
          />
          <div className="absolute bottom-0 right-0 p-2 gap-2 flex">
            <ThoughtStartersButton
              thought={thought}
              showStarters={showStarters}
              setShowStarters={handleShowStarters}
            />
            <AnalyzeThoughtButton 
              isLoading={isLoading} 
              thought={thought}
              entryMethod={getEntryMethod()}
            />
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
