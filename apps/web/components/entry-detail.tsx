'use client'

import { useState } from 'react'
import { Card } from '@/apps/web/components/ui/card'
import { Badge } from '@/apps/web/components/ui/badge'
import { Button } from '@/apps/web/components/ui/button'
import { Textarea } from '@/apps/web/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/apps/web/components/ui/tabs'
import { Edit2, Save, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/apps/web/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'

// Mock data for a single entry
const mockEntry = {
  id: '1',
  originalThought: 'I\'m going to mess up this presentation tomorrow and everyone will think I\'m incompetent.',
  reframedThought:
    'While this presentation is important, one mistake won\'t ruin my career. I\'ve prepared well and can recover from small errors.',
  date: new Date(2023, 3, 15),
  distortions: [
    {
      name: 'Catastrophizing',
      explanation: 'You\'re imagining the worst possible outcome without considering more likely scenarios.',
    },
    {
      name: 'All-or-Nothing Thinking',
      explanation: 'You\'re seeing the situation in black and white terms without acknowledging the middle ground.',
    },
  ],
  justification:
    'This reframed thought is more realistic because it acknowledges both the importance of the presentation and the fact that small mistakes are normal and recoverable. It also recognizes that most people are understanding rather than harshly judgmental.',
}

interface EntryDetailProps {
  id: string
}

export const EntryDetail = ({ id: _id }: EntryDetailProps) => {
  // In a real implementation, we would use the id to fetch the entry data
  // For now, using mock data for demonstration
  const [entry] = useState(mockEntry)
  const [editingReframe, setEditingReframe] = useState(false)
  const [reframedThought, setReframedThought] = useState(mockEntry.reframedThought)
  const router = useRouter()

  const handleDelete = () => {
    // In a real app, this would delete the entry from the database
    router.push('/journal')
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-purple-500 dark:text-purple-400 mb-2">
            {format(entry.date, 'MMMM d, yyyy \'at\' h:mm a')}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {entry.distortions.map((distortion, index) => (
              <Badge
                key={index}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-0"
              >
                {distortion.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
            onClick={() => setEditingReframe(!editingReframe)}
          >
            {editingReframe ? (
              <>
                <Save className="h-4 w-4 mr-1" />
                Save
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </>
            )}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-panel">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this journal entry.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-slate-200 dark:border-slate-700">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="thoughts" className="space-y-6">
        <TabsList className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <TabsTrigger
            value="thoughts"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/10 data-[state=active]:to-indigo-500/10 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300"
          >
            Thoughts
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/10 data-[state=active]:to-indigo-500/10 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300"
          >
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="thoughts" className="space-y-6">
          <Card className="glass-panel p-5 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-900/20 dark:to-indigo-900/20">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Original Thought</h3>
            <p className="text-slate-700 dark:text-slate-300 italic line-through opacity-70">{entry.originalThought}</p>
          </Card>

          <Card className="glass-panel p-5">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Reframed Thought</h3>
            {editingReframe ? (
              <Textarea
                value={reframedThought}
                onChange={(e) => setReframedThought(e.target.value)}
                className="min-h-[100px] border-slate-200 dark:border-slate-700 focus:border-purple-300 dark:focus:border-purple-700 focus:ring-purple-300 dark:focus:ring-purple-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
              />
            ) : (
              <p className="text-slate-800 dark:text-slate-200 font-medium">{reframedThought}</p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold gradient-text">Identified Cognitive Distortions</h3>
            {entry.distortions.map((distortion, index) => (
              <Card key={index} className="glass-panel p-5">
                <div className="flex justify-between items-start mb-3">
                  <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-0">
                    {distortion.name}
                  </Badge>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{distortion.explanation}</p>
              </Card>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold gradient-text mb-4">Why This Reframe Works</h3>
            <Card className="glass-panel p-5">
              <p className="text-slate-600 dark:text-slate-300">{entry.justification}</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
