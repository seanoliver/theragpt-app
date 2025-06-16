'use client'

import { Lightbulb } from 'lucide-react'

interface EntryItemStrategiesProps {
  strategies: string[]
}

export const EntryItemStrategies = ({ strategies }: EntryItemStrategiesProps) => {
  if (!strategies || strategies.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-600" />
        <h3 className="text-lg font-medium">Strategies</h3>
      </div>
      <div className="pl-7">
        <div className="space-y-3">
          {strategies.map((strategy, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">{strategy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}