'use client'

import { Card } from '@/components/ui/card'
import { useEntryStore } from '@theragpt/logic'
import { compareTimestampsDesc } from '@/lib/date-utils'
import Link from 'next/link'
import { EntryItem } from './EntryItem/EntryItem'
import { useEntryStoreInitialized } from './store/EntryStoreProvider'

export const EntryList = () => {
  const { entries, isLoading, error } = useEntryStore()
  const { initialized } = useEntryStoreInitialized()

  // Sort entries by createdAt date (newest first)
  const sortedEntries = [...entries].sort(
    (a, b) => compareTimestampsDesc(a.createdAt, b.createdAt),
  )

  if (isLoading || !initialized) {
    return (
      <Card className="glass-panel p-6 text-center text-slate-600 dark:text-slate-300">
        <p>Loading journal entries...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="glass-panel p-6 text-center text-slate-600 dark:text-slate-300">
        <p>Error loading entries: {error}</p>
      </Card>
    )
  }
  return (
    <div className="space-y-6">
      {sortedEntries.length === 0 ? (
        <Card className="glass-panel p-6 text-center text-slate-600 dark:text-slate-300">
          <p>You haven't created any journal entries yet.</p>
        </Card>
      ) : (
        sortedEntries.map(entry => (
          <Link href={`/entry/${entry.id}`} key={entry.id}>
            <EntryItem key={entry.id} entryId={entry.id} />
          </Link>
        ))
      )}
    </div>
  )
}
