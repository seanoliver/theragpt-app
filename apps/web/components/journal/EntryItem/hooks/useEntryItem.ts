'use client'

import { useState } from 'react'
import { useEntryStore } from '@theragpt/logic'

export const useEntryItem = (entryId: string) => {
  const [isDeleted, setIsDeleted] = useState(false)

  const entry = useEntryStore(state =>
    state.entries.find(e => e.id === entryId),
  )
  const streamingEntryId = useEntryStore(state => state.streamingEntryId)
  const deleteEntry = useEntryStore(state => state.deleteEntry)

  const isStreaming = streamingEntryId === entryId
  const hasContent = entry?.rawText || entry?.reframeText

  const handleDelete = async () => {
    setIsDeleted(true)
    await deleteEntry(entryId)
  }

  const undoDelete = () => {
    setIsDeleted(false)
  }

  return {
    entry,
    isStreaming,
    hasContent,
    isDeleted,
    handleDelete,
    undoDelete,
  }
}