'use client'

import { Button } from '@/apps/web/components/ui/button'
import { Card, CardContent, CardHeader } from '@/apps/web/components/ui/card'
import { Entry, entryService } from '@theragpt/logic'
import { formatDistanceToNow } from 'date-fns'
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EntryItemAnalysisPanel } from './EntryItemAnalysisPanel'
import { EntryItemResponsiveBadges } from './EntryItemResponsiveBadges'

interface EntryItemProps {
  entryId: string
}

export const EntryItem = ({ entryId }: EntryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [entry, setEntry] = useState<Entry | null>(null)

  useEffect(() => {
    const fetchEntry = async () => {
      const entry = await entryService.getById(entryId)
      if (entry) {
        setEntry(entry)
      }
    }
    fetchEntry()
  }, [entryId])

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
        <EntryItemResponsiveBadges distortions={entry.distortions || []} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {entry.title && (
            <h3 className="font-medium text-lg text-slate-900">
              {entry.title}
            </h3>
          )}

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <p className="text-lg font-medium text-slate-800 mb-6">
              {entry.reframe?.text}
            </p>

            <div className="pt-3 border-t border-dashed border-slate-200">
              <p className="text-sm text-slate-400 line-through italic">
                {entry.rawText}
              </p>
            </div>
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

          <EntryItemAnalysisPanel entry={entry} isExpanded={isExpanded} />
        </div>
      </CardContent>
    </Card>
  )
}
