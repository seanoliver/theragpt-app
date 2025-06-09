import { create } from 'zustand'
import { getSupabaseClient } from '@theragpt/config'
import type { User, Session, AuthError } from '@supabase/supabase-js'

export interface AuthStore {
  // State
  user: User | null
  session: Session | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null

  // Auth actions
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>

  // State management
  initialize: () => Promise<void>
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Helpers
  get isAuthenticated(): boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  isAuthenticated: false,

  // Initialize auth state and listen for changes
  initialize: async () => {
    set({ isLoading: true })

    try {
      // Get initial session
      const { data: { session }, error } = await getSupabaseClient().auth.getSession()

      if (error) {
        set({ error: error.message })
      } else {
        set({
          session,
          user: session?.user || null,
        })
      }

      // Listen for auth changes
      getSupabaseClient().auth.onAuthStateChange((event, session) => {
        const isAuthenticated = !!session?.user

        set({
          session,
          user: session?.user || null,
          isAuthenticated,
          error: null,
        })

        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          set({ user: null, session: null, isAuthenticated: false })
        }
      })

      set({ isInitialized: true })
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ error: 'Failed to initialize authentication' })
    } finally {
      set({ isLoading: false })
    }
  },

  // Sign up with email/password
  signUp: async (email: string, password: string) => {
    set({ isLoading: true, error: null })

    try {
      const { data, error } = await getSupabaseClient().auth.signUp({
        email,
        password,
      })

      if (error) {
        set({ error: error.message })
        return { user: null, error }
      }

      // Supabase will trigger onAuthStateChange if signup is successful
      return { user: data.user, error: null }
    } catch {
      const errorMessage = 'An unexpected error occurred during sign up'
      set({ error: errorMessage })
      return { user: null, error: { message: errorMessage } as AuthError }
    } finally {
      set({ isLoading: false })
    }
  },

  // Sign in with email/password
  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null })

    try {
      const { data, error } = await getSupabaseClient().auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        set({ error: error.message })
        return { user: null, error }
      }

      // Supabase will trigger onAuthStateChange if signin is successful
      return { user: data.user, error: null }
    } catch {
      const errorMessage = 'An unexpected error occurred during sign in'
      set({ error: errorMessage })
      return { user: null, error: { message: errorMessage } as AuthError }
    } finally {
      set({ isLoading: false })
    }
  },

  // Sign out
  signOut: async () => {
    set({ isLoading: true, error: null })

    try {
      const { error } = await getSupabaseClient().auth.signOut()

      if (error) {
        set({ error: error.message })
        console.error('Error signing out:', error)
      }

      // onAuthStateChange will handle clearing user/session state
    } catch (error) {
      console.error('Error signing out:', error)
      set({ error: 'An unexpected error occurred during sign out' })
    } finally {
      set({ isLoading: false })
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null })

    try {
      const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        set({ error: error.message })
        return { error }
      }

      return { error: null }
    } catch {
      const errorMessage = 'An unexpected error occurred during password reset'
      set({ error: errorMessage })
      return { error: { message: errorMessage } as AuthError }
    } finally {
      set({ isLoading: false })
    }
  },

  // State setters
  setUser: (user: User | null) => set({ user }),
  setSession: (session: Session | null) => set({ session }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}))