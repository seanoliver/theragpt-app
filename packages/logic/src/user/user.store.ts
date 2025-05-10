import { create } from 'zustand'
import { User, AuthState } from './types'
import { supabaseUserService } from './supabase-user.service'

export interface UserStore extends AuthState {
  // Actions
  initialize: () => Promise<void>
  signUp: (email: string, password: string) => Promise<User | null>
  signIn: (email: string, password: string) => Promise<User | null>
  signOut: () => Promise<void>
  updateProfile: (profile: Partial<User>) => Promise<User | null>

  // State setters
  setUser: (user: User | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

let unsubscribe: (() => void) | undefined

export const useUserStore = create<UserStore>((set, get) => ({
  // State
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  // Initialize the store
  initialize: async () => {
    set({ isLoading: true })
    try {
      const user = await supabaseUserService.init()

      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      })

      // Set up subscription to auth state changes
      unsubscribe?.()
      unsubscribe = supabaseUserService.subscribe((user) => {
        set({
          user,
          isAuthenticated: !!user,
        })
      })
    } catch (error) {
      console.error('Failed to initialize user store', error)
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to initialize user',
      })
    }
  },

  // Sign up a new user
  signUp: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const user = await supabaseUserService.signUp(email, password)
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      })
      return user
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign up'
      set({
        isLoading: false,
        error: errorMessage,
      })
      return null
    }
  },

  // Sign in an existing user
  signIn: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const user = await supabaseUserService.signIn(email, password)
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      })
      return user
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in'
      set({
        isLoading: false,
        error: errorMessage,
      })
      return null
    }
  },

  // Sign out the current user
  signOut: async () => {
    set({ isLoading: true, error: null })
    try {
      await supabaseUserService.signOut()
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out'
      set({
        isLoading: false,
        error: errorMessage,
      })
    }
  },

  // Update the current user's profile
  updateProfile: async (profile) => {
    set({ isLoading: true, error: null })
    try {
      const user = await supabaseUserService.updateProfile(profile)
      set({
        user,
        isLoading: false,
      })
      return user
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      set({
        isLoading: false,
        error: errorMessage,
      })
      return null
    }
  },

  // State setters
  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}))