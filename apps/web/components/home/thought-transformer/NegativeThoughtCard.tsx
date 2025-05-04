import React from 'react'
import { Card } from '@/apps/web/components/ui/card'
import { motion } from 'motion/dist/react'
import { CloudRain } from 'lucide-react'
import { SAMPLE_TRANSFORMATIONS } from './constants'
import { Badge } from '@/apps/web/components/ui/badge'

interface NegativeThoughtCardProps {
  activeIndex: number
  activeTransformation: (typeof SAMPLE_TRANSFORMATIONS)[number]
}

export const NegativeThoughtCard = ({
  activeIndex,
  activeTransformation,
}: NegativeThoughtCardProps) => {
  return (
    <motion.div
      className="md:col-span-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      key={`negative-${activeIndex}`}
    >
      <Card className="glass-panel p-6 border-red-200 dark:border-red-900/30 bg-gradient-to-br from-slate-100/80 to-red-50/80 dark:from-slate-900/80 dark:to-red-950/30">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
            <CloudRain className="h-5 w-5 text-red-500" />1
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              Negative Thought
            </h3>
            <p className="text-xs text-red-600 dark:text-red-400">
              {activeTransformation.emotion.before}
            </p>
          </div>
        </div>
        <p className="text-slate-700 dark:text-slate-300 italic">
          {activeTransformation.negativeThought}
        </p>
        <Badge
          variant="outline"
          className="mt-4 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/20"
        >
          {activeTransformation.distortion}
        </Badge>
      </Card>
    </motion.div>
  )
}
