'use client'

import { useEffect } from 'react'
import { useTracking } from '@/apps/web/lib/analytics/useTracking'
import { useSearchParams } from 'next/navigation'

interface EntryPageTrackerProps {
  entryId: string
}

export const EntryPageTracker = ({ entryId }: EntryPageTrackerProps) => {
  const { track } = useTracking()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Determine view source based on referrer or URL params
    const getViewSource = (): 'direct_link' | 'journal_list' | 'post_analysis' => {
      // Check if this is a redirect from analysis
      if (searchParams.get('source') === 'analysis' || document.referrer.includes('/new-entry') || document.referrer.includes('/#')) {
        return 'post_analysis'
      }
      
      // Check if coming from journal
      if (document.referrer.includes('/journal')) {
        return 'journal_list'
      }
      
      // Default to direct link
      return 'direct_link'
    }

    track('entry_viewed', {
      entry_id: entryId,
      view_source: getViewSource(),
    })
  }, [entryId, track, searchParams])

  return null // This component only tracks, doesn't render anything
}