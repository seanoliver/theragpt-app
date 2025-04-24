import React, { createContext, useContext, useEffect, useState } from 'react'
import { Appearance } from 'react-native'
import {
  ThemeOption,
  getSystemTheme,
  loadThemeSelection,
  saveThemeSelection,
} from './service'
import { themes, ThemeType, DEFAULT_THEME_TYPE, Theme } from '../theme'

interface ThemeContextType {
  theme: ThemeOption
  effectiveTheme: ThemeOption
  setTheme: (theme: ThemeOption) => void
  themeObject: Theme
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: ThemeOption.SYSTEM,
  effectiveTheme: ThemeOption.LIGHT,
  setTheme: () => {},
  themeObject: themes.light,
})

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeOption>(ThemeOption.SYSTEM)
  const [effectiveTheme, setEffectiveTheme] = useState<ThemeOption>(getSystemTheme())

  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await loadThemeSelection()
        if (savedTheme) {
          setThemeState(savedTheme)
        }
      } catch (error) {
        // Optionally log error
      }
    }
    loadSavedTheme()
  }, [])

  useEffect(() => {
    const updateEffectiveTheme = () => {
      if (theme === ThemeOption.SYSTEM) {
        setEffectiveTheme(getSystemTheme())
      } else {
        setEffectiveTheme(theme)
      }
    }
    updateEffectiveTheme()
    if (theme === ThemeOption.SYSTEM) {
      const subscription = Appearance.addChangeListener(() => {
        updateEffectiveTheme()
      })
      return () => {
        subscription.remove()
      }
    }
  }, [theme])

  const setTheme = async (newTheme: ThemeOption) => {
    setThemeState(newTheme)
    await saveThemeSelection(newTheme)
  }

  const contextValue: ThemeContextType = {
    theme,
    effectiveTheme,
    setTheme,
    themeObject: themes[effectiveTheme],
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}