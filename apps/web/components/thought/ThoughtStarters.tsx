'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/apps/web/components/ui/tabs'
import { Card } from '@/apps/web/components/ui/card'
import { Badge } from '@/apps/web/components/ui/badge'

// Define categories and thought starters
const thoughtStarterCategories = [
  {
    id: 'work',
    name: 'Work & Career',
    starters: [
      'I\'m worried I\'ll mess up this presentation and everyone will think I\'m incompetent.',
      'My colleague got praised for their work, but mine was ignored. I must be terrible at my job.',
      'If I don\'t get this promotion, it means I\'m a complete failure.',
      'I made one mistake in the report, so the whole thing is ruined.',
      'My boss gave me feedback, which means they\'re unhappy with my performance.',
      'If I ask for help at work, everyone will think I can\'t handle my responsibilities.',
    ],
  },
  {
    id: 'relationships',
    name: 'Relationships',
    starters: [
      'My friend hasn\'t texted me back. They must be mad at me or don\'t want to be friends anymore.',
      'If I share my true feelings, people will think I\'m too needy and leave me.',
      'I made one mistake in our conversation, and now they probably think I\'m stupid.',
      'If I disagree with someone, they won\'t like me anymore.',
      'Everyone else has better relationships than I do.',
      'If I don\'t get invited to every event, it means nobody really likes me.',
    ],
  },
  {
    id: 'self',
    name: 'Self-Image',
    starters: [
      'I should be able to handle this workload without feeling stressed. I\'m weak for feeling overwhelmed.',
      'I made a mistake, which proves I\'m not good enough.',
      'Everyone else seems to have their life together. I\'m the only one struggling.',
      'If I\'m not perfect at everything I do, I\'m a failure.',
      'I should be further along in life by now.',
      'If I can\'t do something right the first time, I must not be smart.',
    ],
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    starters: [
      'This headache must mean something is seriously wrong with me.',
      'I missed one day at the gym, so my whole fitness routine is ruined.',
      'I\'ll never be able to develop healthy habits. I always fail eventually.',
      'Everyone else finds it easy to stay healthy. I must be doing something wrong.',
      'If I can\'t stick to this diet perfectly, I might as well not try at all.',
      'If I feel tired today, it means I\'m getting sick or something is wrong with me.',
    ],
  },
]

interface ThoughtStartersProps {
  onSelect: (starter: string) => void
}

export const ThoughtStarters = ({ onSelect }: ThoughtStartersProps) => {
  const [activeTab, setActiveTab] = useState('work')

  return (
    <div className="glass-panel rounded-lg p-4 text-left">
      <Tabs
        defaultValue="work"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          {thoughtStarterCategories.map(category => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/10 data-[state=active]:to-indigo-500/10 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {thoughtStarterCategories.map(category => (
          <TabsContent
            key={category.id}
            value={category.id}
            className="mt-0 space-y-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.starters.map((starter, index) => (
                <Card
                  key={index}
                  className="p-3 cursor-pointer hover:shadow-md transition-all border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 bg-white/70 dark:bg-slate-800/70"
                  onClick={() => onSelect(starter)}
                >
                  <div className="flex flex-col gap-2">
                    <Badge
                      variant="outline"
                      className="self-start text-xs border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/20"
                    >
                      {category.name}
                    </Badge>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {starter}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}