'use client'

import { Badge } from '@/apps/web/components/ui/badge'
import { Button } from '@/apps/web/components/ui/button'
import { Card, CardContent, CardHeader } from '@/apps/web/components/ui/card'
import { useStreamEntry } from '@/apps/web/lib/llm/useStreamEntry'
import { getAnalyzePrompt } from '@/packages/prompts/src'
import { Entry, useEntryStore } from '@theragpt/logic'
import { formatDistanceToNow } from 'date-fns'
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { EntryItemAnalysisPanel } from './EntryItemAnalysisPanel'
interface EntryItemProps {
  entryId: string
}

export const EntryItem = ({ entryId }: EntryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const entry = useEntryStore(state =>
    state.entries.find(e => e.id === entryId),
  )
  const streamingEntryId = useEntryStore(state => state.streamingEntryId)

  useEffect(() => {
    console.log('entry changed', entry)
  }, [entry])

  const isStreaming = streamingEntryId === entryId

  if (!entry) {
    return <div>Loading...</div>
  }
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md hover:shadow-lg glass-panel transition-all duration-300 mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {formatDistanceToNow(new Date(entry.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <Badge variant="outline">{entry.category}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {entry.title && (
            <h3 className="font-medium text-lg text-slate-900">
              {entry.title}
            </h3>
          )}

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            {isStreaming ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
                <p className="text-lg text-slate-600">
                  Analyzing your thought...
                </p>
              </div>
            ) : (
              <>
                <p className="text-xl font-medium text-slate-800 mb-6">
                  {entry.reframe?.text}
                </p>

                <div className="pt-3 border-t border-dashed border-slate-200">
                  <p className="text-md text-slate-400 line-through italic">
                    {entry.rawText}
                  </p>
                </div>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-slate-500 mt-2 flex items-center justify-center"
            onClick={e => {
              e.stopPropagation()
              e.preventDefault()
              setIsExpanded(!isExpanded)
            }}
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUpIcon className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                <span>Show analysis</span>
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>

          <EntryItemAnalysisPanel
            entry={entry}
            isExpanded={isExpanded}
            isStreaming={isStreaming}
          />
        </div>
      </CardContent>
    </Card>
  )
}
