import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance, ColorSchemeName } from 'react-native'
import { DEFAULT_THEME_TYPE } from './theme'

export enum ThemeOption {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export const THEME_STORAGE_KEY = 'user_theme_preference'

export function getAvailableThemes(): ThemeOption[] {
  return [ThemeOption.LIGHT, ThemeOption.DARK, ThemeOption.SYSTEM]
}

export function isValidTheme(theme: string | null | undefined): theme is ThemeOption {
  return theme === ThemeOption.LIGHT || theme === ThemeOption.DARK || theme === ThemeOption.SYSTEM
}

export function getSystemTheme(): ThemeOption {
  const scheme: ColorSchemeName = Appearance.getColorScheme?.() ?? 'light'
  if (scheme === 'dark') return ThemeOption.DARK
  return ThemeOption.LIGHT
}

export async function loadThemeSelection(): Promise<ThemeOption> {
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

export async function saveThemeSelection(theme: ThemeOption): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Optionally log error
  }
}

export async function clearThemeSelection(): Promise<void> {
  try {
    await AsyncStorage.removeItem(THEME_STORAGE_KEY)
  } catch {
    // Optionally log error
  }
}