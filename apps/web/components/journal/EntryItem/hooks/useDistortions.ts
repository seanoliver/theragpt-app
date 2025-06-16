'use client'

import { useState } from 'react'

export const useDistortions = () => {
  const [expandedDistortions, setExpandedDistortions] = useState<string[]>([])

  const toggleDistortion = (distortionType: string) => {
    setExpandedDistortions((prev) =>
      prev.includes(distortionType) 
        ? prev.filter((d) => d !== distortionType) 
        : [...prev, distortionType],
    )
  }

  const isDistortionExpanded = (distortionType: string) => {
    return expandedDistortions.includes(distortionType)
  }

  return {
    expandedDistortions,
    toggleDistortion,
    isDistortionExpanded,
  }
}