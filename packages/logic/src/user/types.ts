/**
 * User interface representing a user in the system
 */
export interface User {
  id: string
  email: string
  createdAt: number
  updatedAt?: number
  displayName?: string
  photoURL?: string
  isAnonymous: boolean
  emailVerified: boolean
  metadata?: Record<string, any>
}

/**
 * User listener function type
 */
export type UserListener = (user: User | null) => void

/**
 * Auth state representing the current authentication state
 */
export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}