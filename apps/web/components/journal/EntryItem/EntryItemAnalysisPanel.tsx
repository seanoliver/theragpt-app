import React from 'react'
import { DISTORTIONS, Entry } from '@theragpt/logic'
import { Badge } from '../../ui/badge'
import { Loader2 } from 'lucide-react'

interface EntryItemAnalysisPanelProps {
  entry: Entry
  isExpanded: boolean
  isStreaming?: boolean
}

export const EntryItemAnalysisPanel = ({
  entry,
  isExpanded,
  isStreaming = false,
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
        {isStreaming ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500 mb-3" />
            <p className="text-md text-slate-600">Analyzing your thought pattern...</p>
          </div>
        ) : (
          <>
            {/* Why the positive thought is realistic */}
            <div className="space-y-3">
              <h4 className="font-medium text-slate-700 subheading">Rationale</h4>
              <div className="pl-4 border-l-2 border-green-100 bg-green-50 p-3 rounded">
                <p className="text-slate-700 text-lg">
                  {entry.reframe?.explanation}
                </p>
              </div>
            </div>

            {/* Strategies Section */}
            {entry.strategies && entry.strategies.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-slate-700 subheading">
                  Strategies
                </h4>
                <div className="space-y-4 pl-3">
                  {entry.strategies?.map((strategy, index) => (
                    <p key={index} className="text-slate-600 text-lg">
                      {strategy}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Cognitive Distortions Section */}
            {entry.distortions && entry.distortions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-slate-700 subheading">
                  Distortions
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
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <p className="text-slate-500 text-md">
                            {
                              DISTORTIONS.find(
                                d => d.id === distortion.distortionId,
                              )?.description
                            }
                          </p>
                        </div>
                        <p className="text-slate-600 text-lg">
                          {distortion.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
