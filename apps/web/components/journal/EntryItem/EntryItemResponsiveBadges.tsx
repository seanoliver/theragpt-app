import { DistortionInstance } from '@theragpt/logic'
import React from 'react'
import { DistortionBadge } from '../../shared/DistortionBadge'

interface EntryItemResponsiveBadgesProps {
  distortions: DistortionInstance[]
}

export const EntryItemResponsiveBadges = ({
  distortions,
}: EntryItemResponsiveBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Always show the first badge */}
      {distortions.slice(0, 1).map((distortion, index) => (
        <DistortionBadge key={index} distortion={distortion.label} />
      ))}

      {/* Show the second badge on md+ screens */}
      {distortions.length > 1 && (
        <span className="hidden md:inline">
          <DistortionBadge
            key={distortions[1].label}
            distortion={distortions[1].label}
          />
        </span>
      )}

      {/* Show the third badge on lg+ screens */}
      {distortions.length > 2 && (
        <span className="hidden lg:inline">
          <DistortionBadge
            key={distortions[2].label}
            distortion={distortions[2].label}
          />
        </span>
      )}

      {/* Show +N indicator for hidden badges */}
      {(() => {
        const total = distortions.length
        // On mobile: show +N if more than 1
        // On md: show +N if more than 2
        // On lg: show +N if more than 3
        return (
          <>
            {/* Mobile: show +N if more than 1 */}
            {total > 1 && (
              <span className="inline md:hidden text-xs text-slate-500 px-1">
                +{total - 1}
              </span>
            )}
            {/* md: show +N if more than 2 */}
            {total > 2 && (
              <span className="hidden md:inline lg:hidden text-xs text-slate-500 px-1">
                +{total - 2}
              </span>
            )}
            {/* lg: show +N if more than 3 */}
            {total > 3 && (
              <span className="hidden lg:inline text-xs text-slate-500 px-1">
                +{total - 3}
              </span>
            )}
          </>
        )
      })()}
    </div>
  )
}
