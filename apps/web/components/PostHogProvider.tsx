'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from '@theragpt/logic'

export const PostHogProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { isInitialized } = useAuth()

  useEffect(() => {
    if (!isInitialized) return
    console.debug('Auth isInitialized', isInitialized)

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_API_HOST!,
      ui_host: 'https://us.posthog.com',
      capture_pageview: true,
      capture_pageleave: true,
      debug: process.env.NODE_ENV === 'development',
    })
  }, [isInitialized])

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

const PostHogPageView = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      const search = searchParams.toString()
      if (search) {
        url += '?' + search
      }
      posthog.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams, posthog])

  return null
}

const SuspendedPostHogPageView = () => {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
