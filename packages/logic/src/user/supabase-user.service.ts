import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js'
import { getEnvironment } from '@theragpt/config'
import { BaseUserService } from './base-user.service'
import { User } from './types'

/**
 * Service for handling user authentication with Supabase
 */
export class SupabaseUserService extends BaseUserService {
  private supabase: SupabaseClient
  private currentUser: User | null = null

  constructor() {
    super()
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
      if (session?.user) {
        this.currentUser = this.mapSupabaseUser(session.user)
      } else {
        this.currentUser = null
      }

      // Notify all listeners of the auth state change
      this.notifyListeners(this.currentUser)
    })
  }

  /**
   * Initialize the service
   * @returns The current user or null if not authenticated
   */
  async init(): Promise<User | null> {
    try {
      const { data, error } = await this.supabase.auth.getSession()

      if (error || !data.session?.user) {
        this.currentUser = null
        return null
      }

      this.currentUser = this.mapSupabaseUser(data.session.user)
      return this.currentUser
    } catch (error) {
      console.error('Error initializing user service', error)
      return null
    }
  }

  /**
   * Sign up a new user with email and password
   * @param email User's email
   * @param password User's password
   * @returns The user object if successful
   */
  async signUp(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error('Error signing up:', error.message)
        throw error
      }

      if (data.user) {
        this.currentUser = this.mapSupabaseUser(data.user)
        return this.currentUser
      }

      return null
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
  async signIn(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Error signing in:', error.message)
        throw error
      }

      if (data.user) {
        this.currentUser = this.mapSupabaseUser(data.user)
        return this.currentUser
      }

      return null
    } catch (error) {
      console.error('Error in signIn:', error)
      return null
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut()

      if (error) {
        console.error('Error signing out:', error.message)
        throw error
      }

      this.currentUser = null
      this.notifyListeners(null)
    } catch (error) {
      console.error('Error in signOut:', error)
    }
  }

  /**
   * Get the current user
   * @returns The current user or null if not authenticated
   */
  getCurrentUser(): User | null {
    return this.currentUser
  }

  /**
   * Check if the user is authenticated
   * @returns True if authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    return !!this.currentUser
  }

  /**
   * Update the current user's profile
   * @param profile Profile data to update
   * @returns The updated user
   */
  async updateProfile(profile: Partial<User>): Promise<User | null> {
    try {
      if (!this.currentUser) {
        throw new Error('User must be authenticated to update profile')
      }

      const { data, error } = await this.supabase.auth.updateUser({
        data: profile,
      })

      if (error) {
        console.error('Error updating profile:', error.message)
        throw error
      }

      if (data.user) {
        this.currentUser = this.mapSupabaseUser(data.user)
        this.notifyListeners(this.currentUser)
        return this.currentUser
      }

      return null
    } catch (error) {
      console.error('Error in updateProfile:', error)
      return null
    }
  }

  /**
   * Get the Supabase client instance
   * @returns The Supabase client
   */
  getSupabaseClient(): SupabaseClient {
    return this.supabase
  }

  /**
   * Map a Supabase user to our User interface
   * @param supabaseUser Supabase user object
   * @returns Mapped User object
   */
  private mapSupabaseUser(supabaseUser: SupabaseUser): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      createdAt: new Date(supabaseUser.created_at || Date.now()).getTime(),
      updatedAt: supabaseUser.updated_at
        ? new Date(supabaseUser.updated_at).getTime()
        : undefined,
      displayName: supabaseUser.user_metadata?.full_name,
      photoURL: supabaseUser.user_metadata?.avatar_url,
      isAnonymous: false,
      emailVerified: supabaseUser.email_confirmed_at !== null,
      metadata: supabaseUser.user_metadata,
    }
  }
}

// Export a singleton instance for convenience
export const supabaseUserService = new SupabaseUserService()