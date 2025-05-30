# PostHog Analytics Implementation

This directory contains the analytics tracking implementation for TheraGPT using PostHog.

## Overview

The implementation provides comprehensive tracking of user interactions and key events throughout the application to help understand user behavior and improve the product.

## Key Features

### Core Tracking Events

1. **Thought Submission & Analysis**
   - `thought_submitted`: When a user submits a thought for analysis
   - `thought_analysis_started`: When AI analysis begins
   - `thought_analysis_completed`: When analysis completes successfully
   - `thought_analysis_failed`: When analysis encounters an error

2. **User Engagement**
   - `form_engagement`: Focus, blur, typing start/stop events
   - `thought_starter_used`: When users select a thought starter
   - `thought_starter_menu_opened`: When thought starters menu is opened

3. **Navigation & Discovery**
   - `page_visited`: Page view tracking with referrer information
   - `cta_clicked`: Call-to-action button clicks
   - `entry_viewed`: Journal entry viewing with view source

4. **Feature Interactions**
   - `theme_toggled`: Light/dark theme switching
   - `journal_filtered`: Journal list filtering
   - `entry_pinned`/`entry_unpinned`: Entry pinning actions

## Usage

### useTracking Hook

The main interface for tracking events:

```typescript
import { useTracking } from '@/apps/web/lib/analytics/useTracking'

const { track, identify, setUserProperties } = useTracking()

// Track an event
track('thought_submitted', {
  thought_length: 150,
  entry_method: 'homepage',
  thought_starter_used: false
})
```

### Event Properties

All events include:
- `timestamp`: Event timestamp
- `user_agent`: Browser user agent
- `viewport_width`/`viewport_height`: Screen dimensions

## Implementation Details

### Components with Tracking

1. **ThoughtEntryForm**: Form engagement and submission tracking
2. **AnalyzeThoughtButton**: Analysis initiation
3. **ThoughtStarters**: Thought starter usage
4. **Header Navigation**: Link clicks and theme toggling
5. **Entry Pages**: Entry viewing and interaction
6. **Page Tracker**: Automatic page visit tracking

### Tracking Strategy

- **High-value actions**: Focus on conversion funnel events
- **User experience**: Track engagement patterns and pain points
- **Feature adoption**: Monitor usage of key features
- **Performance**: Track analysis completion rates and timing

## Privacy & Compliance

- No PII (personally identifiable information) is tracked
- Thought content is measured by length only, not content
- All tracking respects user privacy and follows best practices
- Events focus on behavioral patterns, not personal data

## Testing

The implementation includes TypeScript types for all events to ensure consistency and prevent tracking errors during development.

## Future Enhancements

Potential additions:
- A/B testing event support
- Cohort analysis properties
- Performance timing metrics
- Error boundary tracking