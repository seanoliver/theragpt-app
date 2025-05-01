'use client'

import { useState } from 'react'
import { Button } from '@/apps/web/components/ui/button'
import { Card } from '@/apps/web/components/ui/card'
import { Textarea } from '@/apps/web/components/ui/textarea'
import { ThumbsUp, ThumbsDown, Edit2, Save, RefreshCw } from 'lucide-react'
import { Badge } from '@/apps/web/components/ui/badge'
import { Separator } from '@/apps/web/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/apps/web/components/ui/tabs'

// Mock data for the AI response
const mockDistortions = [
  {
    id: 1,
    name: 'Catastrophizing',
    explanation: 'You\'re imagining the worst possible outcome without considering more likely scenarios.',
  },
  {
    id: 2,
    name: 'All-or-Nothing Thinking',
    explanation: 'You\'re seeing the situation in black and white terms without acknowledging the middle ground.',
  },
]

const mockReframedThought =
  'While this presentation is important, one mistake won\'t ruin my career. I\'ve prepared well and can recover from small errors. Most people are supportive and understand that everyone makes mistakes.'

const mockJustification =
  'This reframed thought is more realistic because it acknowledges both the importance of the presentation and the fact that small mistakes are normal and recoverable. It also recognizes that most people are understanding rather than harshly judgmental.'

interface AIResponsePanelProps {
  originalThought: string
  onSave: () => void
  onReset: () => void
}

export const AIResponsePanel = ({ originalThought, onSave, onReset }: AIResponsePanelProps) => {
  const [editingReframe, setEditingReframe] = useState(false)
  const [reframedThought, setReframedThought] = useState(mockReframedThought)
  const [activeTab, setActiveTab] = useState('analysis')

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-5 glass-panel bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-900/20 dark:to-indigo-900/20">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Your Original Thought</h3>
        <p className="text-slate-800 dark:text-slate-200 italic">{originalThought}</p>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <TabsTrigger
            value="analysis"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/10 data-[state=active]:to-indigo-500/10 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300"
          >
            Analysis
          </TabsTrigger>
          <TabsTrigger
            value="reframe"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/10 data-[state=active]:to-indigo-500/10 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300"
          >
            Reframed Thought
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold gradient-text">Identified Cognitive Distortions</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Not Helpful
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {mockDistortions.map((distortion) => (
                <Card key={distortion.id} className="p-5 glass-panel">
                  <div className="flex justify-between items-start mb-3">
                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-0">
                      {distortion.name}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{distortion.explanation}</p>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="reframe" className="space-y-6">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold gradient-text">Reframed Thought</h3>
              <div className="flex gap-2">
                {!editingReframe ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                    onClick={() => setEditingReframe(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                    onClick={() => setEditingReframe(false)}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Regenerate
                </Button>
              </div>
            </div>

            <Card className="p-5 glass-panel mb-6">
              {editingReframe ? (
                <Textarea
                  value={reframedThought}
                  onChange={(e) => setReframedThought(e.target.value)}
                  className="min-h-[100px] border-slate-200 dark:border-slate-700 focus:border-purple-300 dark:focus:border-purple-700 focus:ring-purple-300 dark:focus:ring-purple-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                />
              ) : (
                <p className="text-slate-700 dark:text-slate-200">{reframedThought}</p>
              )}
            </Card>

            <h3 className="text-lg font-semibold gradient-text mb-4">Why This Reframe Works</h3>
            <Card className="p-5 glass-panel">
              <p className="text-slate-600 dark:text-slate-300">{mockJustification}</p>
            </Card>
          </section>
        </TabsContent>
      </Tabs>

      <Separator className="bg-slate-200 dark:bg-slate-700" />

      <div className="flex justify-between">
        <Button
          variant="outline"
          className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
          onClick={onReset}
        >
          Start Over
        </Button>
        <Button
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-0"
          onClick={onSave}
        >
          Save to Journal
        </Button>
      </div>
    </div>
  )
}
