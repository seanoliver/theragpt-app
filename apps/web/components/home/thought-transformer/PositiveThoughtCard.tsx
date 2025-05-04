import React from 'react'
import { SAMPLE_TRANSFORMATIONS } from './constants'
import { Badge } from '../../ui/badge'
import { Card } from '../../ui/card'
import { motion } from 'motion/dist/react'
import { Sun } from 'lucide-react';

interface PositiveThoughtCardProps {
  activeIndex: number
  activeTransformation: (typeof SAMPLE_TRANSFORMATIONS)[number]
}

export const PositiveThoughtCard = ({
  activeIndex,
  activeTransformation,
}: PositiveThoughtCardProps) => {
  return (
    <motion.div
      className="md:col-span-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      key={`positive-${activeIndex}`}
    >
      <Card className="glass-panel p-6 border-green-200 dark:border-green-900/30 bg-gradient-to-br from-slate-100/80 to-green-50/80 dark:from-slate-900/80 dark:to-green-950/30">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
            <Sun className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              Reframed Thought
            </h3>
            <p className="text-xs text-green-600 dark:text-green-400">
              {activeTransformation.emotion.after}
            </p>
          </div>
        </div>
        <p className="text-slate-700 dark:text-slate-300">
          {activeTransformation.positiveThought}
        </p>
        <Badge
          variant="outline"
          className="mt-4 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-900/20"
        >
          Balanced Perspective
        </Badge>
      </Card>
    </motion.div>
  )
}
