# Still — Product Requirements Document (PRD) v1.2

⸻

1. Overview

Still is a mobile-first app designed to help users start each day with clarity and confidence through personal affirmations. Users can swipe through affirmations, edit them with AI assistance, and mark the ones that resonate most each day. The goal is to foster a consistent, lightweight ritual that reinforces self-identity and emotional well-being.

⸻

2. Goals
   • Establish an emotionally meaningful morning ritual for self-connection.
   • Simplify the process of creating, editing, and evolving affirmations.
   • Encourage daily reflection through gentle, user-driven engagement.

⸻

3. Target Users
   • Individuals who use or are interested in using affirmations.
   • Users seeking daily intention-setting or emotional clarity.
   • Primary persona: Reflective, self-motivated individuals interested in wellness tools.

⸻

4. Core User Story

"As someone who wants to feel anchored each morning, I want an app that presents me with affirmations I've refined over time, so I can reconnect with who I am—and mark the ones that resonate most in the moment."

⸻

5. Features

Must-Have (MVP)
• Swipe-through daily affirmation cards
• Create/edit affirmations manually
• AI-assisted affirmation rewriting
• View all saved affirmations (library)
• Daily "resonance" marker (dot → sunburst interaction)
• Starter affirmation pack for new users
• Local data storage (persisted across app sessions)

Nice-to-Have (Post-MVP)
• Text-to-speech functionality
• Quote-to-draft capture flow
• Streak tracking
• Light mode theme
• Onboarding questions with AI-generated starter affirmations
• Daily reminder notifications

⸻

6. Success Metrics
   • Engagement: User opens app 5+ times per week
   • Emotional Resonance: At least one affirmation marked as "resonated" each day
   • Personalization: 50%+ of users create or edit at least one affirmation
   • Qualitative Feedback: Positive user feedback regarding clarity and mood improvement

⸻

7. Assumptions & Constraints
   • Built with Expo (React Native) for mobile platforms
   • Lightweight Next.js backend for secure OpenAI API calls
   • No user authentication or cloud syncing in MVP
   • Dark mode only for initial release
   • Minimal first-time user experience (FTUE) with a starter affirmation deck

⸻

8. Analytics & Instrumentation

Using PostHog to track product usage and engagement.

Tracked Events
• app_opened
• affirmation_created
• affirmation_edited
• daily_resonance_marked
• affirmation_swiped (optional)
• feedback_response (after 5+ opens)

Event Properties
• affirmation_id
• timestamp or date
• (Optional) day_of_week, is_first_time_user, etc.

⸻

9. Open Questions (Resolved)
   • Resonance Selection: Users can mark multiple affirmations per day
   • Affirmation Rotation: Persistent swipeable list for now
   • Cross-Device Sync: Future support via Supabase + user accounts
