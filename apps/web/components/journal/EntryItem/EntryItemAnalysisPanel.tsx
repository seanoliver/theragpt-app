import React from 'react'
import { Entry } from '@theragpt/logic'
import { Badge } from '../../ui/badge'

interface EntryItemAnalysisPanelProps {
  entry: Entry
  isExpanded: boolean
}

export const EntryItemAnalysisPanel = ({
  entry,
  isExpanded,
}: EntryItemAnalysisPanelProps) => {
  return (
    <div
      style={{
        height: isExpanded ? 'auto' : '0',
        overflow: 'hidden',
        transition: 'height 300ms ease-in-out, margin 300ms ease-in-out',
        marginTop: isExpanded ? '0.5rem' : 0,
      }}
    >
      <div
        className="pt-2 space-y-6 text-sm"
        style={{
          opacity: isExpanded ? 1 : 0,
          transition: 'opacity 300ms ease-in-out',
        }}
      >
        {/* Why the positive thought is realistic */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-700">
            Why the reframed thought is realistic
          </h4>
          <div className="pl-4 border-l-2 border-green-100 bg-green-50 p-3 rounded">
            <p className="text-slate-700">{entry.reframes?.[0]?.explanation}</p>
          </div>
        </div>

        {/* Cognitive Distortions Section */}
        {entry.distortions && entry.distortions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700">
              Distortions found in your original thought
            </h4>
            <div className="space-y-4 pl-3">
              {entry.distortions?.map((distortion, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start">
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      {distortion.label}
                    </Badge>
                  </div>
                  <div className="pl-4 border-l-2 border-slate-100 space-y-2">
                    <p className="text-slate-600">{distortion.explanation}</p>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                      <p className="text-slate-500 text-xs">
                        <span className="font-medium">
                          Evidence in thought:
                        </span>{' '}
                        {distortion.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
