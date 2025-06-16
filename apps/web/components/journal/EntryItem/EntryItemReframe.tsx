'use client'

import { Loader2 } from 'lucide-react'

interface EntryItemReframeProps {
  reframeText?: string
  rawText?: string
  isStreaming: boolean
}

export const EntryItemReframe = ({ 
  reframeText, 
  rawText, 
  isStreaming,
}: EntryItemReframeProps) => {
  if (!reframeText && !isStreaming) return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">REFRAMED THOUGHT</h3>
      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500 relative">
        {isStreaming && (
          <div className="absolute top-2 right-2 flex items-center text-xs text-indigo-500 dark:text-indigo-400">
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
            <span>Thinking...</span>
          </div>
        )}
        <p className="text-base leading-relaxed">
          {reframeText || (isStreaming ? 'Generating reframe...' : '')}
        </p>
        {rawText && (
          <p className="text-sm text-muted-foreground mt-2 line-through">{rawText}</p>
        )}
      </div>
    </div>
  )
}