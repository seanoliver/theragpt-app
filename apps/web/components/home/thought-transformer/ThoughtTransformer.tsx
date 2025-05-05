'use client'

import { Button } from '@/apps/web/components/ui/button'
import { useState } from 'react'
import { SAMPLE_TRANSFORMATIONS } from './constants'
import { NegativeThoughtCard } from './NegativeThoughtCard'
import { PositiveThoughtCard } from './PositiveThoughtCard'
import { TransformationProcess } from './TransformationProcess'
export const ThoughtTransformer = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeTransformation = SAMPLE_TRANSFORMATIONS[activeIndex]

  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
          Transform Your Thinking
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          See how TheraGPT helps you reframe negative thoughts into balanced,
          constructive perspectives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {SAMPLE_TRANSFORMATIONS.map((transformation, index) => (
          <Button
            key={transformation.id}
            variant={activeIndex === index ? 'default' : 'outline'}
            className={`h-auto py-3 px-4 justify-start text-left ${
              activeIndex === index
                ? 'bg-gradient-to-r ' +
                  transformation.color.from +
                  ' ' +
                  transformation.color.to +
                  ' text-white'
                : 'border-purple-200 dark:border-purple-800 text-slate-700 dark:text-slate-300'
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <div>
              <div className="font-medium">{transformation.distortion}</div>
              <div className="text-xs opacity-80 mt-1">
                {transformation.emotion.before} → {transformation.emotion.after}
              </div>
            </div>
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-5 gap-6 items-center">
        <NegativeThoughtCard
          activeIndex={activeIndex}
          activeTransformation={activeTransformation}
        />
        <TransformationProcess />
        <PositiveThoughtCard
          activeIndex={activeIndex}
          activeTransformation={activeTransformation}
        />
      </div>
      <div className="mt-10 text-center">
        <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
          TheraGPT uses cognitive behavioral therapy (CBT) techniques to help
          you identify cognitive distortions and develop healthier thinking
          patterns.
        </p>
        <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-0">
          Try It Now
        </Button>
      </div>
    </div>
  )
}
