'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'
import { useEntryItem } from './hooks/useEntryItem'
import { EntryItemHeader } from './EntryItemHeader'
import { EntryItemReframe } from './EntryItemReframe'
import { EntryItemRationale } from './EntryItemRationale'
import { EntryItemStrategies } from './EntryItemStrategies'
import { EntryItemDistortions } from './EntryItemDistortions'
import { EntryItemDeleted } from './EntryItemDeleted'

interface EntryItemProps {
  entryId: string
}

export const EntryItem = ({ entryId }: EntryItemProps) => {
  const {
    entry,
    isStreaming,
    hasContent,
    isDeleted,
    handleDelete,
    undoDelete,
  } = useEntryItem(entryId)

  if (!entry) {
    return (
      <div className="flex items-center justify-center w-full h-40">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  // Show component if: streaming, has reframed content, or has raw text to display
  if (!isStreaming && !hasContent) return null

  if (isDeleted) {
    return <EntryItemDeleted onUndoDelete={undoDelete} />
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <EntryItemHeader
          entryId={entryId}
          title={entry.title}
          category={entry.category}
          createdAt={entry.createdAt}
          onDelete={handleDelete}
        />
      </CardHeader>

      <CardContent className="space-y-6">
        <EntryItemReframe
          reframeText={entry.reframeText}
          rawText={entry.rawText}
          isStreaming={isStreaming}
        />

        {entry.reframeExplanation && (
          <>
            <EntryItemRationale reframeExplanation={entry.reframeExplanation} />
            <Separator />
          </>
        )}

        {entry.strategies && entry.strategies.length > 0 && (
          <>
            <EntryItemStrategies strategies={entry.strategies} />
            <Separator />
          </>
        )}

        {entry.distortions && entry.distortions.length > 0 && (
          <EntryItemDistortions distortions={entry.distortions} />
        )}
      </CardContent>
    </Card>
  )
}
