# TheraGPT Config Package

This package provides centralized configuration management for the TheraGPT monorepo.

## Environment Variables

The config package provides a typed API for accessing environment variables with validation using Zod. This ensures that all parts of the application have access to properly validated environment variables.

### Usage

```typescript
import { getEnvironment } from '@theragpt/config'

// Get environment variables
const env = getEnvironment()

// Access typed environment variables
const supabaseUrl = env.SUPABASE_URL
const openaiApiKey = env.OPENAI_API_KEY
```

### Environment Variable Setup

Environment variables should be defined in app-specific `.env` files:

- `apps/web/.env` - For the Next.js web application
- `apps/mobile/.env` - For the React Native mobile application

This follows the principle of least privilege, where each app only has access to the environment variables it needs.

### Required Environment Variables

The following environment variables are required:

- `SUPABASE_URL` - The URL of your Supabase instance
- `SUPABASE_ANON_KEY` - The anonymous key for your Supabase instance

### Optional Environment Variables

The following environment variables are optional:

- `OPENAI_API_KEY` - The API key for OpenAI (only required on the server side)
- `SUPABASE_SERVICE_ROLE` - The service role key for your Supabase instance
- `SUPABASE_JWT_SECRET` - The JWT secret for your Supabase instance

## Constants

The config package also provides constants that are used throughout the application:

```typescript
import { constants } from '@theragpt/config'

// Access constants
const apiBaseUrl = constants.API_BASE_URL
```

## Features

The config package provides feature flags that can be used to enable or disable features:

```typescript
import { features } from '@theragpt/config'

// Check if a feature is enabled
if (features.isEnabled('darkMode')) {
  // Enable dark mode
}
```

## Best Practices

1. **Never hardcode secrets** - Always use environment variables for secrets
2. **Use the config package** - Always access environment variables through the config package
3. **Validate environment variables** - Always validate environment variables using Zod
4. **Follow the principle of least privilege** - Only expose the environment variables each app needs