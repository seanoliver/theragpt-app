'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from '../layout/theme/ThemeProvider'
import { EntryStoreProvider } from '../journal/store/EntryStoreProvider'
import { UserStoreProvider } from './UserStoreProvider'

interface ProvidersProps {
  children: ReactNode
  themeProps?: {
    attribute?: 'class' | 'data-theme'
    defaultTheme?: string
    enableSystem?: boolean
    disableTransitionOnChange?: boolean
  }
}

/**
 * Consolidated providers component that wraps all providers in the app
 * This ensures proper initialization order and clean component tree
 */
export const Providers = ({
  children,
  themeProps = {
    attribute: 'class',
    defaultTheme: 'system',
    enableSystem: true,
    disableTransitionOnChange: true,
  },
}: ProvidersProps) => {
  return (
    <ThemeProvider
      attribute={themeProps.attribute}
      defaultTheme={themeProps.defaultTheme}
      enableSystem={themeProps.enableSystem}
      disableTransitionOnChange={themeProps.disableTransitionOnChange}
    >
      <UserStoreProvider>
        <EntryStoreProvider>
          {children}
        </EntryStoreProvider>
      </UserStoreProvider>
    </ThemeProvider>
  )
}