'use client'

import { Card } from '@/apps/web/components/ui/card'
import { Badge } from '@/apps/web/components/ui/badge'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { useEntryStore, Entry } from '@theragpt/logic'
import { useEntryStoreInitialized } from './entry-store-provider'

export const JournalEntryList = () => {
  const { entries, isLoading, error } = useEntryStore()
  const { initialized } = useEntryStoreInitialized()

  // Helper function to get distortion labels from distortion instances
  const getDistortionLabels = (entry: Entry) => {
    if (!entry.distortions || entry.distortions.length === 0) {
      return []
    }
    return entry.distortions.map(d => d.distortionId)
  }

  // Helper function to get reframed thought from reframes
  const getReframedThought = (entry: Entry) => {
    if (!entry.reframes || entry.reframes.length === 0) {
      return 'No reframe yet'
    }
    return entry.reframes[0].text
  }

  // Sort entries by createdAt date (newest first)
  const sortedEntries = [...entries].sort((a, b) =>
    (b.createdAt || 0) - (a.createdAt || 0)
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
        sortedEntries.map((entry, index) => (
          <Link href={`/entry/${entry.id}`} key={entry.id}>
            <Card
              className="glass-panel p-6 hover:shadow-lg transition-all duration-300 gradient-border mb-6"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-3 flex justify-between items-start">
                <p className="text-sm text-purple-500 dark:text-purple-400">
                  {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {getDistortionLabels(entry).map((distortion, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/20"
                    >
                      {distortion}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Original Thought</h3>
                  <p className="text-slate-700 dark:text-slate-300 line-through opacity-70">{entry.rawText}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Reframed Thought</h3>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{getReframedThought(entry)}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))
      )}
    </div>
  )
}
