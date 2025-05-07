import React from 'react'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

interface AnalyzeThoughtButtonProps {
  isLoading: boolean
  thought: string
}

export const AnalyzeThoughtButton = ({
  isLoading,
  thought,
}: AnalyzeThoughtButtonProps) => {
  return (
    <Button
      type="submit"
      className={`
      bg-gradient-to-r from-purple-500 to-indigo-500
      hover:from-purple-600 hover:to-indigo-600
      dark:text-slate-50 border-0
      transition-opacity duration-500 ease-in-out
      ${isLoading || !thought.trim() ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
    `}
      disabled={isLoading || !thought.trim()}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Analyze Thought'
      )}
    </Button>
  )
}
