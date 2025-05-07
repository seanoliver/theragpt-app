import React from 'react'
import { Button } from '../ui/button'
import { ChevronDown, Sparkles } from 'lucide-react'

interface ThoughtStartersButtonProps {
  thought: string
  onClick?: () => void
  showStarters: boolean
  setShowStarters: React.Dispatch<React.SetStateAction<boolean>>
}

export const ThoughtStartersButton = ({
  thought,
  showStarters,
  setShowStarters,
}: ThoughtStartersButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={`bg-purple-100 dark:bg-purple-900 border-0 rounded-full flex items-center justify-center transition-opacity duration-500 ease-in-out ${
        thought.length === 0
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
      tabIndex={thought.length === 0 ? 0 : -1}
      aria-hidden={thought.length !== 0}
      onClick={e => {
        e.preventDefault()
        setShowStarters(prev => !prev)
      }}
    >
      {showStarters ? (
        <ChevronDown className="h-5 w-5 text-purple-500 dark:text-purple-400" />
      ) : (
        <Sparkles className="h-5 w-5 text-purple-500 dark:text-purple-400" />
      )}
    </Button>
  )
}
