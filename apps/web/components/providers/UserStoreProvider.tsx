'use client'

import { useUserStore } from '@theragpt/logic'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// Create a context to track initialization state
interface UserStoreContextType {
  initialized: boolean
}

const UserStoreContext = createContext<UserStoreContextType>({ initialized: false })

// Hook to consume the context
export const useUserStoreInitialized = () => useContext(UserStoreContext)

export const UserStoreProvider = ({ children }: { children: ReactNode }) => {
  const { initialize } = useUserStore()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initStore = async () => {
      try {
        await initialize()
        setInitialized(true)
        // User store initialized successfully
      } catch (error) {
        console.error('Failed to initialize user store:', error)
      }
    }

    initStore()
  }, [initialize])

  return (
    <UserStoreContext.Provider value={{ initialized }}>
      {children}
    </UserStoreContext.Provider>
  )
}