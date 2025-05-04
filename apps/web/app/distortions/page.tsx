// Add a client directive to prevent hydration issues with scroll behavior
'use client'

import { Header } from '@/apps/web/components/layout/Header'
import { DistortionsList } from '@/apps/web/components/distortions/DistortionsList'
import { useEffect } from 'react'

export default function CognitiveDistortionsPage() {
  // Prevent auto-scrolling on page load by resetting scroll position
  useEffect(() => {
    // Only scroll to top if there's no hash in the URL
    if (!window.location.hash) {
      window.scrollTo(0, 0)
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Header />
      <DistortionsList />
    </main>
  )
}
