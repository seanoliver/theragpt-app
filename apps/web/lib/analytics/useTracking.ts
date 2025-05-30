'use client'

import { usePostHog } from 'posthog-js/react'
import { useCallback } from 'react'

export interface TrackingEvent {
  // Core user actions
  'thought_submitted': {
    thought_length: number
    entry_method: 'homepage' | 'new_entry_page'
    thought_starter_used?: boolean
  }
  'thought_analysis_started': {
    entry_id: string
    thought_length: number
  }
  'thought_analysis_completed': {
    entry_id: string
    analysis_duration_ms: number
    distortions_found: number
    has_reframe: boolean
  }
  'thought_analysis_failed': {
    entry_id: string
    error_type: string
    analysis_duration_ms: number
  }
  'entry_viewed': {
    entry_id: string
    view_source: 'direct_link' | 'journal_list' | 'post_analysis'
  }
  
  // Feature interactions
  'thought_starter_used': {
    starter_text: string
    starter_position: number
  }
  'thought_starter_menu_opened': Record<string, never>
  'theme_toggled': {
    new_theme: 'light' | 'dark' | 'system'
    previous_theme: 'light' | 'dark' | 'system'
  }
  
  // Navigation and discovery
  'page_visited': {
    page: string
    referrer?: string
  }
  'cta_clicked': {
    cta_text: string
    cta_location: string
    destination: string
  }
  'journal_filtered': {
    filter_type: 'all' | 'pinned' | 'recent'
  }
  'entry_pinned': {
    entry_id: string
  }
  'entry_unpinned': {
    entry_id: string
  }
  
  // User engagement metrics
  'session_started': Record<string, never>
  'time_on_page': {
    page: string
    duration_seconds: number
  }
  'form_engagement': {
    form_type: 'thought_entry'
    action: 'focus' | 'blur' | 'typing_started' | 'typing_stopped'
    character_count?: number
  }
}

export type TrackingEventName = keyof TrackingEvent

export const useTracking = () => {
  const posthog = usePostHog()

  const track = useCallback(
    <T extends TrackingEventName>(
      eventName: T,
      properties: TrackingEvent[T] & { timestamp?: number }
    ) => {
      if (!posthog) return

      const eventProperties = {
        ...properties,
        timestamp: Date.now(),
        // Add default context properties
        user_agent: navigator.userAgent,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
      }

      posthog.capture(eventName, eventProperties)
    },
    [posthog]
  )

  const identify = useCallback(
    (userId: string, traits?: Record<string, any>) => {
      if (!posthog) return
      posthog.identify(userId, traits)
    },
    [posthog]
  )

  const setUserProperties = useCallback(
    (properties: Record<string, any>) => {
      if (!posthog) return
      posthog.setPersonProperties(properties)
    },
    [posthog]
  )

  return {
    track,
    identify,
    setUserProperties,
  }
}