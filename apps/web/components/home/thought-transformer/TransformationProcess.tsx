import { motion } from 'motion/react'
import React from 'react'
import { Brain, Zap, ArrowRight } from 'lucide-react'

interface TransformationProcessProps {}

export const TransformationProcess = ({}: TransformationProcessProps) => {
  return (
    <div className="flex justify-center items-center md:col-span-1">
      <div className="relative">
      <ArrowRight className="absolute -left-10 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-500 hidden md:block" />
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
        >
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
            <Zap className="h-3 w-3 text-purple-600 dark:text-purple-300" />
          </div>
        </motion.div>
        <ArrowRight className="absolute -right-10 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-500 hidden md:block" />
      </div>
    </div>
  )
}
