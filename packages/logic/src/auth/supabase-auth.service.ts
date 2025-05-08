import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js'
import { getEnvironment } from '@theragpt/config'

/**
 * Service for handling Supabase authentication
 */
export class SupabaseAuthService {
  private supabase: SupabaseClient
  private currentUser: User | null = null
  private currentSession: Session | null = null
  private authStateChangeCallbacks: ((user: User | null) => void)[] = []

  constructor() {
    const env = getEnvironment()

    if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
      throw new Error('Supabase URL and anon key must be provided in environment variables')
    }

    this.supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    })

    // Set up auth state change listener
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      this.currentSession = session
      this.currentUser = session?.user || null

      // Notify all listeners of the auth state change
      this.authStateChangeCallbacks.forEach(callback => callback(this.currentUser))
    })
  }

  /**
   * Sign up a new user with email and password
   * @param email User's email
   * @param password User's password
   * @returns The user object if successful
   */
  public async signUp(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error('Error signing up:', error.message)
        throw error
      }

      return data.user
    } catch (error) {
      console.error('Error in signUp:', error)
      return null
    }
  }

  /**
   * Sign in a user with email and password
   * @param email User's email
   * @param password User's password
   * @returns The user object if successful
   */
  public async signIn(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Error signing in:', error.message)
        throw error
      }

      return data.user
    } catch (error) {
      console.error('Error in signIn:', error)
      return null
    }
  }

  /**
   * Sign out the current user
   */
  public async signOut(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut()

      if (error) {
        console.error('Error signing out:', error.message)
        throw error
      }
    } catch (error) {
      console.error('Error in signOut:', error)
    }
  }

  /**
   * Get the current user
   * @returns The current user or null if not authenticated
   */
  public getCurrentUser(): User | null {
    return this.currentUser
  }

  /**
   * Get the current session
   * @returns The current session or null if not authenticated
   */
  public getCurrentSession(): Session | null {
    return this.currentSession
  }

  /**
   * Check if the user is authenticated
   * @returns True if authenticated, false otherwise
   */
  public isAuthenticated(): boolean {
    return !!this.currentUser
  }

  /**
   * Subscribe to auth state changes
   * @param callback Function to call when auth state changes
   * @returns Unsubscribe function
   */
  public onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authStateChangeCallbacks.push(callback)

    // Return unsubscribe function
    return () => {
      this.authStateChangeCallbacks = this.authStateChangeCallbacks.filter(cb => cb !== callback)
    }
  }

  /**
   * Get the Supabase client instance
   * @returns The Supabase client
   */
  public getSupabaseClient(): SupabaseClient {
    return this.supabase
  }
}

// Export a singleton instance for convenience
export const supabaseAuthService = new SupabaseAuthService()