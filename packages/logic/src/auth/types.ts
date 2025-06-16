import type { User, Session } from '@supabase/supabase-js'

export type AuthUser = User

export type AuthSession = Session

export interface AuthContextValue {
  user: AuthUser | null
  session: AuthSession | null
  isLoading: boolean
  isInitialized: boolean
  isAuthenticated: boolean
  error: string | null
  
  // Auth actions
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: any }>
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  clearError: () => void
}

export interface SignUpData {
  email: string
  password: string
  confirmPassword?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface ResetPasswordData {
  email: string
}

export type AuthError = {
  message: string
  status?: number
}

export type AuthEvent = 
  | 'SIGNED_IN' 
  | 'SIGNED_OUT' 
  | 'SIGNED_UP' 
  | 'PASSWORD_RECOVERY'
  | 'TOKEN_REFRESHED'