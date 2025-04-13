# Still MVP Roadmap

## Phase 0: Setup & Infra

Goal: Get the dev environment ready and basic repo structure in place.

    •	Create /apps/still-app (Expo app)
    •	Create /apps/still-backend (Next.js API routes for OpenAI)
    •	Set up /packages/api-client, /utils/posthog.ts
    •	Install and configure PostHog
    •	Setup local data storage (AsyncStorage or SQLite)

⸻

## Phase 1: Core User Flow

Goal: Deliver the daily affirmation experience end-to-end.

    •	Build swipeable affirmation card view
    •	Local data rendering
    •	“Resonates with me today” toggle (dot → sunburst)
    •	Build Add/Edit screen
    •	Manual editing
    •	“Ask AI to rewrite” option
    •	Store affirmations locally and persist resonance state (reset daily)
    •	Add simple starter affirmation pack

⸻

## Phase 2: Support & Feedback Layer

Goal: Track usage and get early signals of user value.

    •	Trigger app_opened, affirmation_swiped, resonance_marked events
    •	Add in-app feedback prompt (after 5 opens)
    •	Add basic settings screen (e.g. clear data, view version, toggle dark mode placeholder)

⸻

## Phase 3: Polish & Prep for Share

Goal: Make it feel clean, stable, and shareable with testers.

    •	Add basic onboarding screen (welcome + optional skip)
    •	Add App Icon + splash screen
    •	Smooth animations for transitions + resonance tap
    •	Final QA pass
    •	TestFlight build (internal)

⸻

## Stretch Goals (Post-MVP)

• Text-to-speech
• Daily reminder notifications
• Quote-to-draft capture flow
• Light mode
• Supabase auth + cloud sync
