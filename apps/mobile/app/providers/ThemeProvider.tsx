import React from 'react'
import { GluestackUIProvider, createConfig } from '@gluestack-ui/themed'

// Create a basic config for the GluestackUIProvider
const config = createConfig({
  // You can customize the theme here if needed
  // For now, we'll use the default theme
})

export interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <GluestackUIProvider config={config}>
      {children}
    </GluestackUIProvider>
  )
}

export default ThemeProvider