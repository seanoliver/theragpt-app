'use client'

import { useState } from 'react'
import { useAuth } from './context'

/**
 * Hook to check if user is authenticated
 * Returns boolean immediately (no loading state)
 */
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated
}

/**
 * Hook to get current user
 * Returns user object or null
 */
export const useUser = () => {
  const { user } = useAuth()
  return user
}

/**
 * Hook to get current session
 * Returns session object or null
 */
export const useSession = () => {
  const { session } = useAuth()
  return session
}

/**
 * Hook for authentication loading states
 * Useful for showing spinners during auth operations
 */
export const useAuthLoading = () => {
  const { isLoading, isInitialized } = useAuth()
  return {
    isLoading,
    isInitialized,
    isInitializing: !isInitialized,
  }
}

/**
 * Hook for authentication errors
 * Provides error state and clear function
 */
export const useAuthError = () => {
  const { error, clearError } = useAuth()
  return {
    error,
    clearError,
    hasError: !!error,
  }
}

/**
 * Hook for sign up functionality with form state management
 */
export const useSignUp = () => {
  const { signUp } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signUp(email, password)
      if (result.error) {
        setError(result.error.message)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed'
      setError(errorMessage)
      return { user: null, error: { message: errorMessage } }
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    signUp: handleSignUp,
    isLoading,
    error,
    clearError,
  }
}

/**
 * Hook for sign in functionality with form state management
 */
export const useSignIn = () => {
  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn(email, password)
      if (result.error) {
        setError(result.error.message)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed'
      setError(errorMessage)
      return { user: null, error: { message: errorMessage } }
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    signIn: handleSignIn,
    isLoading,
    error,
    clearError,
  }
}

/**
 * Hook for sign out functionality
 */
export const useSignOut = () => {
  const { signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
    } finally {
      setIsLoading(false)
    }
  }

  return {
    signOut: handleSignOut,
    isLoading,
  }
}

/**
 * Hook for password reset functionality
 */
export const usePasswordReset = () => {
  const { resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePasswordReset = async (email: string) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      const result = await resetPassword(email)
      if (result.error) {
        setError(result.error.message)
      } else {
        setIsSuccess(true)
      }
      return result
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Password reset failed'
      setError(errorMessage)
      return { error: { message: errorMessage } }
    } finally {
      setIsLoading(false)
    }
  }

  const clearState = () => {
    setError(null)
    setIsSuccess(false)
  }

  return {
    resetPassword: handlePasswordReset,
    isLoading,
    error,
    isSuccess,
    clearState,
  }
}
