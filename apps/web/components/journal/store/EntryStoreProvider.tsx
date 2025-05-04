'use client'

import { useEntryStore } from '@theragpt/logic'
import { useEffect, useState, createContext, useContext, ReactNode } from 'react'

// Create a context to track initialization state
interface EntryStoreContextType {
  initialized: boolean
}

const EntryStoreContext = createContext<EntryStoreContextType>({ initialized: false })

// Hook to consume the context
export const useEntryStoreInitialized = () => useContext(EntryStoreContext)

export const EntryStoreProvider = ({ children }: { children: ReactNode }) => {
  const { initialize } = useEntryStore()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initStore = async () => {
      try {
        await initialize()
        setInitialized(true)
        // Entry store initialized successfully
      } catch (error) {
        console.error('Failed to initialize entry store:', error)
      }
    }

    initStore()
  }, [initialize])

  return (
    <EntryStoreContext.Provider value={{ initialized }}>
      {children}
    </EntryStoreContext.Provider>
  )
}