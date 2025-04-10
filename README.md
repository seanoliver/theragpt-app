# TheraGPT

A Cognitive Behavioral Therapy (CBT) application designed to help users identify cognitive distortions in their thoughts and reframe them in a more balanced way.

## Overview

TheraGPT leverages AI (specifically OpenAI's API) to analyze user-submitted thoughts, identify potential cognitive distortions, and suggest reframed perspectives. The application includes a spaced repetition system (SRS) to help users internalize healthier thought patterns over time.

## Project Structure

This project follows a monorepo architecture using Turborepo and PNPM workspaces:

```
theragpt-app/
├── apps/
│   ├── web/                 # Next.js web application
│   └── mobile/              # Expo mobile application
├── packages/
│   ├── logic/               # Shared business logic
│   ├── ui/                  # Shared UI components using Gluestack
│   └── config/              # Shared configuration
├── turbo.json               # Turborepo configuration
├── package.json             # Root package.json
└── pnpm-workspace.yaml      # PNPM workspace configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PNPM (v8 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/theragpt-app.git
   cd theragpt-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development servers:
   ```bash
   pnpm dev
   ```

## Available Scripts

- `pnpm build` - Build all applications and packages
- `pnpm dev` - Start all development servers
- `pnpm lint` - Run linting across the monorepo
- `pnpm test` - Run tests across the monorepo
- `pnpm clean` - Clean build artifacts
- `pnpm format` - Format code with Prettier

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.