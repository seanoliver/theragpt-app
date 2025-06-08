'use client'

import { AuthProvider as LogicAuthProvider } from '@theragpt/logic'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <LogicAuthProvider autoInitialize={true}>
      {children}
    </LogicAuthProvider>
  )
}