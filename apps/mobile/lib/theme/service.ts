import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance, ColorSchemeName } from 'react-native'
import { DEFAULT_THEME_TYPE } from './theme'

export enum ThemeOption {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export const THEME_STORAGE_KEY = 'user_theme_preference'

export const getAvailableThemes = function(): ThemeOption[] {
  return [ThemeOption.LIGHT, ThemeOption.DARK, ThemeOption.SYSTEM]
}

export const isValidTheme = function(
  theme: string | null | undefined,
): theme is ThemeOption {
  return (
    theme === ThemeOption.LIGHT ||
    theme === ThemeOption.DARK ||
    theme === ThemeOption.SYSTEM
  )
}

export const getSystemTheme = function(): ThemeOption {
  const scheme: ColorSchemeName = Appearance.getColorScheme?.() ?? 'light'
  if (scheme === 'dark') return ThemeOption.DARK
  return ThemeOption.LIGHT
}

export const loadThemeSelection = async function(): Promise<ThemeOption> {
  try {
    const value = await AsyncStorage.getItem(THEME_STORAGE_KEY)
    if (isValidTheme(value)) {
      return value as ThemeOption
    }
    return DEFAULT_THEME_TYPE as ThemeOption
  } catch {
    return DEFAULT_THEME_TYPE as ThemeOption
  }
}

export const saveThemeSelection = async function(theme: ThemeOption): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Optionally log error
  }
}

export const clearThemeSelection = async function(): Promise<void> {
  try {
    await AsyncStorage.removeItem(THEME_STORAGE_KEY)
  } catch {
    // Optionally log error
  }
}
