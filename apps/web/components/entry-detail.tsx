'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/apps/web/components/ui/card'
import { Badge } from '@/apps/web/components/ui/badge'
import { Button } from '@/apps/web/components/ui/button'
import { Textarea } from '@/apps/web/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/apps/web/components/ui/tabs'
import { Edit2, Save, Trash2, Loader2 } from 'lucide-react'
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
import { useEntryStore, entryService, Entry } from '@theragpt/logic'
import { useEntryStoreInitialized } from './entry-store-provider'

interface EntryDetailProps {
  id: string
}

export const EntryDetail = ({ id }: EntryDetailProps) => {
  const { entries, deleteEntry, isLoading, error } = useEntryStore()
  const { initialized } = useEntryStoreInitialized()
  const [entry, setEntry] = useState<Entry | null>(null)
  const [editingReframe, setEditingReframe] = useState(false)
  const [reframedThought, setReframedThought] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // Find the entry by ID when entries are loaded
  useEffect(() => {
    if (initialized && entries.length > 0) {
      const foundEntry = entries.find(e => e.id === id)
      if (foundEntry) {
        setEntry(foundEntry)
        // Set reframed thought if available
        if (foundEntry.reframes && foundEntry.reframes.length > 0) {
          setReframedThought(foundEntry.reframes[0].text)
        }
      }
    }
  }, [id, entries, initialized])

  // Helper function to get distortion name from ID
  const getDistortionName = (distortionId: string) => {
    // This would ideally come from a distortions service or store
    const distortionMap: Record<string, string> = {
      'catastrophizing': 'Catastrophizing',
      'all-or-nothing': 'All-or-Nothing Thinking',
      'mind-reading': 'Mind Reading',
      'jumping-to-conclusions': 'Jumping to Conclusions',
      'should-statements': 'Should Statements',
      'labeling': 'Labeling',
      'emotional-reasoning': 'Emotional Reasoning',
      'fortune-telling': 'Fortune Telling',
      'disqualifying-the-positive': 'Disqualifying the Positive',
      'magnification-minimization': 'Magnification/Minimization',
      'personalization': 'Personalization',
      'overgeneralization': 'Overgeneralization'
    }
    return distortionMap[distortionId] || distortionId
  }

  const handleSaveReframe = async () => {
    if (!entry || !reframedThought.trim()) return

    setIsSaving(true)
    try {
      // If there's an existing reframe, update it
      if (entry.reframes && entry.reframes.length > 0) {
        const reframeId = entry.reframes[0].id
        await entryService.updateReframe(reframeId, {
          text: reframedThought
        })
      } else {
        // Otherwise create a new reframe
        await entryService.addReframe(entry.id, {
          text: reframedThought,
          source: 'user-edit',
          style: 'custom'
        })
      }
      setEditingReframe(false)
    } catch (error) {
      console.error('Error saving reframe:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!entry) return

    try {
      await deleteEntry(entry.id)
      router.push('/journal')
    } catch (error) {
      console.error('Error deleting entry:', error)
    }
  }

  if (isLoading || !initialized) {
    return (
      <Card className="glass-panel p-6 text-center text-slate-600 dark:text-slate-300">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        <p>Loading entry...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="glass-panel p-6 text-center text-slate-600 dark:text-slate-300">
        <p>Error loading entry: {error}</p>
      </Card>
    )
  }

  if (!entry) {
    return (
      <Card className="glass-panel p-6 text-center text-slate-600 dark:text-slate-300">
        <p>Entry not found</p>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-purple-500 dark:text-purple-400 mb-2">
            {format(new Date(entry.createdAt), 'MMMM d, yyyy \'at\' h:mm a')}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {entry.distortions && entry.distortions.map((distortion, index) => (
              <Badge
                key={index}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-0"
              >
                {getDistortionName(distortion.distortionId)}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
            onClick={() => editingReframe ? handleSaveReframe() : setEditingReframe(true)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Saving...
              </>
            ) : editingReframe ? (
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
            <p className="text-slate-700 dark:text-slate-300 italic line-through opacity-70">{entry.rawText}</p>
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
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                {entry.reframes && entry.reframes.length > 0
                  ? entry.reframes[0].text
                  : 'No reframe available'}
              </p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold gradient-text">Identified Cognitive Distortions</h3>
            {entry.distortions && entry.distortions.length > 0 ? (
              entry.distortions.map((distortion, index) => (
                <Card key={index} className="glass-panel p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-0">
                      {getDistortionName(distortion.distortionId)}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{distortion.text}</p>
                </Card>
              ))
            ) : (
              <Card className="glass-panel p-5 text-center text-slate-600 dark:text-slate-300">
                <p>No cognitive distortions identified</p>
              </Card>
            )}
          </div>

          {entry.reframes && entry.reframes.length > 0 && entry.reframes[0].explanation && (
            <div>
              <h3 className="text-lg font-semibold gradient-text mb-4">Why This Reframe Works</h3>
              <Card className="glass-panel p-5">
                <p className="text-slate-600 dark:text-slate-300">{entry.reframes[0].explanation}</p>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
