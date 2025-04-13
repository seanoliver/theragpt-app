# Northstar

Northstar is a mobile-first app designed to help users start each day with clarity and confidence through personal affirmations. Users can swipe through affirmations, edit them with AI assistance, and mark the ones that resonate most each day. The goal is to foster a consistent, lightweight ritual that reinforces self-identity and emotional well-being.

## Overview

Northstar leverages AI to help users create and customize personal affirmations that resonate with their goals and values. The application includes features for daily affirmation review, AI-assisted editing, and tracking which affirmations resonate most strongly.

## Project Structure

This project follows a monorepo architecture using Turborepo and PNPM workspaces:

```
northstar-app/
├── apps/
│   ├── mobile/     # Expo mobile app
│   └── web/        # Next.js web app
└── packages/
    ├── config/     # Shared configuration
    ├── logic/      # Shared business logic
    └── ui/         # Shared UI components
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PNPM (v8 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/northstar-app.git
   cd northstar-app
   ```

2. Install dependencies:
   ```