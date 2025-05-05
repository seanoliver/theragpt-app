import React from 'react'
import { Badge } from '../ui/badge'

interface DistortionBadgeProps {
  distortion: string
}

export const DistortionBadge = ({ distortion }: DistortionBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/20"
    >
      {distortion}
    </Badge>
  )
}
