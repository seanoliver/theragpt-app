# Northstar

Northstar is a mobile-first app designed to help users start each day with clarity and confidence through personal affirmations. Users can swipe through affirmations, edit them with AI assistance, and mark the ones that resonate most each day. The goal is to foster a consistent, lightweight ritual that reinforces self-identity and emotional well-being.

## Overview

Northstar helps users establish an emotionally meaningful morning ritual for self-connection. The app simplifies the process of creating, editing, and evolving affirmations while encouraging daily reflection through gentle, user-driven engagement. Users can:

- Swipe through daily affirmation cards
- Create and edit affirmations manually
- Get AI-assisted affirmation rewriting
- Mark affirmations that resonate each day
- Access a library of saved affirmations

## Project Structure

This project follows a monorepo architecture using Turborepo and PNPM workspaces:

```
northstar-app/
├── apps/
│   ├── mobile/     # Expo mobile app
│   └── web/        # Next.js web app (frontend + API routes)
└── packages/
    ├── api-client/ # API client utilities
    └── utils/      # Shared utilities (e.g., PostHog)
```

## Tech Stack

- **Frontend**:
  - Mobile: Expo (React Native)
  - Web: Next.js
- **Backend**: Next.js API routes
- **AI Integration**: OpenAI API
- **Analytics**: PostHog
- **Local Storage**: AsyncStorage/SQLite
- **Package Manager**: PNPM
- **Monorepo**: Turborepo

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PNPM (v8 or later)
- Expo CLI (for mobile development)
- iOS Simulator or Android Emulator (for mobile testing)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/northstar-app.git
   cd northstar-app
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   - Create `.env` files in both `apps/mobile` and `apps/web`
   - Add required API keys and configuration

4. Start the development servers:

   ```bash
   # Start the mobile app
   cd apps/mobile
   pnpm start

   # Start the web app (frontend + API)
   cd apps/web
   pnpm dev
   ```

## Development Phases

### Phase 0: Setup & Infrastructure

- Basic repo structure
- Development environment setup
- PostHog configuration
- Local storage implementation

### Phase 1: Core User Flow

- Swipeable affirmation cards
- Local data management
- Resonance marking system
- Affirmation creation/editing
- AI-assisted rewriting

### Phase 2: Support & Feedback

- Analytics implementation
- In-app feedback system
- Basic settings

### Phase 3: Polish & Testing

- Onboarding experience
- App icon and splash screen
- Animation refinements
- QA and testing

## Analytics & Instrumentation

We use PostHog to track key user interactions:

- App opens
- Affirmation creation/editing
- Daily resonance marking
- User feedback

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

[Add your license information here]
