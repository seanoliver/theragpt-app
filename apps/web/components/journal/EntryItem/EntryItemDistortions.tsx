'use client'

import { Badge } from '@/components/ui/badge'
import { AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react'
import { DistortionInstance } from '@theragpt/logic'
import { useDistortions } from './hooks/useDistortions'

interface EntryItemDistortionsProps {
  distortions: DistortionInstance[]
}

export const EntryItemDistortions = ({ distortions }: EntryItemDistortionsProps) => {
  const { toggleDistortion, isDistortionExpanded } = useDistortions()

  if (!distortions || distortions.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h3 className="text-lg font-medium">Distortions</h3>
      </div>

      <div className="space-y-3 pl-7">
        {distortions.map((distortion, index) => {
          const isExpanded = isDistortionExpanded(distortion.type)

          return (
            <div key={index} className="border rounded-lg bg-red-50 dark:bg-red-950/10">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs" title={distortion.description}>
                      {distortion.label}
                    </Badge>
                  </div>
                  <button
                    onClick={() => toggleDistortion(distortion.type)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        Hide details
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-3 h-3" />
                        Show details
                      </>
                    )}
                  </button>
                </div>

                {!isExpanded && (
                  <p className="text-sm mt-3">{distortion.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}