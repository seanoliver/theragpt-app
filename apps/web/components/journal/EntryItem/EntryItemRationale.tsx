'use client'

import { Target } from 'lucide-react'

interface EntryItemRationaleProps {
  reframeExplanation: string
}

export const EntryItemRationale = ({ reframeExplanation }: EntryItemRationaleProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-medium">Rationale</h3>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground pl-7">
        {reframeExplanation}
      </p>
    </div>
  )
}