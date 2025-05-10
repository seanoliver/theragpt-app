import { User, UserListener } from './types'

/**
 * Base abstract class for user services
 */
export abstract class BaseUserService {
  protected listeners: UserListener[] = []

  /**
   * Subscribe to user changes
   * @param listener Function to call when user changes
   * @returns Unsubscribe function
   */
  subscribe(listener: UserListener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  /**
   * Notify all listeners of user changes
   * @param user Updated user or null if signed out
   */
  protected notifyListeners(user: User | null) {
    this.listeners.forEach(listener => listener(user))
  }

  /**
   * Initialize the service
   * @returns The current user or null if not authenticated
   */
  abstract init(): Promise<User | null>

  /**
   * Sign up a new user with email and password
   * @param email User's email
   * @param password User's password
   * @returns The user object if successful
   */
  abstract signUp(email: string, password: string): Promise<User | null>

  /**
   * Sign in a user with email and password
   * @param email User's email
   * @param password User's password
   * @returns The user object if successful
   */
  abstract signIn(email: string, password: string): Promise<User | null>

  /**
   * Sign out the current user
   */
  abstract signOut(): Promise<void>

  /**
   * Get the current user
   * @returns The current user or null if not authenticated
   */
  abstract getCurrentUser(): User | null

  /**
   * Check if the user is authenticated
   * @returns True if authenticated, false otherwise
   */
  abstract isAuthenticated(): boolean

  /**
   * Update the current user's profile
   * @param profile Profile data to update
   * @returns The updated user
   */
  abstract updateProfile(profile: Partial<User>): Promise<User | null>
}