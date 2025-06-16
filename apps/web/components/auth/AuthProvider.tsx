'use client'

import { AuthProvider as LogicAuthProvider } from '@theragpt/logic'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <LogicAuthProvider autoInitialize={true}>
      {children}
    </LogicAuthProvider>
  )
}