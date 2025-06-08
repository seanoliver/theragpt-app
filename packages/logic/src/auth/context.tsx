import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAuthStore } from './auth.store'
import { AuthContextValue } from './types'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
  /** Whether to automatically initialize auth on mount. Default: true */
  autoInitialize?: boolean
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  autoInitialize = true 
}) => {
  const store = useAuthStore()

  useEffect(() => {
    if (autoInitialize && !store.isInitialized) {
      store.initialize()
    }
  }, [autoInitialize, store.isInitialized, store.initialize])

  const contextValue: AuthContextValue = {
    user: store.user,
    session: store.session,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    isAuthenticated: store.isAuthenticated,
    error: store.error,
    
    // Auth actions
    signUp: store.signUp,
    signIn: store.signIn,
    signOut: store.signOut,
    resetPassword: store.resetPassword,
    clearError: store.clearError,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}