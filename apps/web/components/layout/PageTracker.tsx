'use client'

import { useEffect } from 'react'
import { useTracking } from '@/lib/analytics/useTracking'
import { usePathname } from 'next/navigation'

export const PageTracker = () => {
  const { track } = useTracking()
  const pathname = usePathname()

  useEffect(() => {
    track('page_visited', {
      page: pathname,
      referrer: document.referrer || undefined,
    })
  }, [pathname, track])

  return null // This component only tracks, doesn't render anything
}