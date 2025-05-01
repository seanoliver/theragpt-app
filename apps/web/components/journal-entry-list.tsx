'use client'

import { Card } from '@/apps/web/components/ui/card'
import { Badge } from '@/apps/web/components/ui/badge'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

// Mock data for journal entries
const mockEntries = [
  {
    id: '1',
    originalThought: 'I\'m going to mess up this presentation tomorrow and everyone will think I\'m incompetent.',
    reframedThought:
      'While this presentation is important, one mistake won\'t ruin my career. I\'ve prepared well and can recover from small errors.',
    date: new Date(2023, 3, 15),
    distortions: ['Catastrophizing', 'All-or-Nothing Thinking'],
  },
  {
    id: '2',
    originalThought: 'My friend didn\'t respond to my text. They must be mad at me or don\'t want to be friends anymore.',
    reframedThought:
      'There are many reasons why someone might not respond right away. They could be busy, have their phone off, or just need some space.',
    date: new Date(2023, 3, 12),
    distortions: ['Mind Reading', 'Jumping to Conclusions'],
  },
  {
    id: '3',
    originalThought:
      'I should be able to handle this workload without feeling stressed. I\'m weak for feeling overwhelmed.',
    reframedThought:
      'It\'s normal to feel stressed with a heavy workload. Acknowledging my limits is a strength, not a weakness.',
    date: new Date(2023, 3, 10),
    distortions: ['Should Statements', 'Labeling'],
  },
]

export const JournalEntryList = () => {
  return (
    <div className="space-y-6">
      {mockEntries.length === 0 ? (
        <Card className="glass-panel p-6 text-center text-slate-600 dark:text-slate-300">
          <p>You haven't created any journal entries yet.</p>
        </Card>
      ) : (
        mockEntries.map((entry, index) => (
          <Link href={`/entry/${entry.id}`} key={entry.id}>
            <Card
              className="glass-panel p-6 hover:shadow-lg transition-all duration-300 gradient-border"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-3 flex justify-between items-start">
                <p className="text-sm text-purple-500 dark:text-purple-400">
                  {formatDistanceToNow(entry.date, { addSuffix: true })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {entry.distortions.map((distortion, index) => (
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
                  <p className="text-slate-700 dark:text-slate-300 line-through opacity-70">{entry.originalThought}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Reframed Thought</h3>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{entry.reframedThought}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))
      )}
    </div>
  )
}
