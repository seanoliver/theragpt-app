import React from 'react'
import { AuthProvider as LogicAuthProvider } from '@theragpt/logic'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <LogicAuthProvider autoInitialize={true}>
      {children}
    </LogicAuthProvider>
  )
}