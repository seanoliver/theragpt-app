# User Service

This directory contains the user service implementations for TheraGPT.

## Overview

The user service provides a unified interface for managing user authentication and profiles, including:

1. User sign-up, sign-in, and sign-out
2. User profile management
3. Authentication state management

## Architecture

The user service follows a clean architecture pattern with:

1. **BaseUserService** - Abstract base class defining the interface for user services
2. **SupabaseUserService** - Implementation using Supabase for authentication
3. **UserServiceProvider** - Provider that manages the user service instance
4. **UserStore** - Zustand store for state management in React components

## Supabase User Service

The `SupabaseUserService` provides a cloud-based implementation of the user service using Supabase as the backend.

### Features

- User authentication with email and password
- User profile management
- Authentication state change notifications
- Automatic token refresh

## User Service Provider

The `UserServiceProvider` is a singleton that manages the user service instance. It:

1. Initializes the user service
2. Provides access to the current user service
3. Allows subscribing to service changes

## User Store

The `useUserStore` is a Zustand store that provides a convenient way to access and manage user state in React components. It wraps the user service and provides:

- Authentication state (user, isAuthenticated, isLoading, error)
- Authentication actions (signUp, signIn, signOut)
- Profile management (updateProfile)

## Usage

### Initializing the User Service

The user service is automatically initialized when imported:

```typescript
import { userServiceProvider } from '@theragpt/logic'

// The user service is already initialized
const userService = userServiceProvider.getCurrentService()
```

### Using the User Store in Components

```typescript
import { useUserStore } from '@theragpt/logic'

const AuthComponent = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    initialize,
    signIn,
    signUp,
    signOut
  } = useUserStore()

  // Initialize the store on component mount
  useEffect(() => {
    initialize()
  }, [initialize])

  // Handle sign in
  const handleSignIn = async (email: string, password: string) => {
    await signIn(email, password)
  }

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {isAuthenticated ? (
        <div>
          <h2>Welcome, {user?.email}</h2>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          {/* Sign in/sign up form */}
        </div>
      )}
    </div>
  )
}
```

### Integration with Entry Service

The entry service provider automatically uses the appropriate entry service based on the authentication state. When a user signs in, the entry service provider switches to the Supabase entry service, and when a user signs out, it switches back to the local entry service.

This ensures that entries are stored in the appropriate location based on the user's authentication state.