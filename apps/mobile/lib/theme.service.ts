/**
 * ThemeService: Handles persistence of theme selection using AsyncStorage.
 * Modular, extensible, and <500 lines.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance, ColorSchemeName } from 'react-native'

/**
 * ThemeOption enum for theme selection
 */
export enum ThemeOption {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export const THEME_STORAGE_KEY = 'user_theme_preference'

/**
 * Returns all available theme options
 */
export function getAvailableThemes(): ThemeOption[] {
  return [ThemeOption.LIGHT, ThemeOption.DARK, ThemeOption.SYSTEM]
}

/**
 * Validates if a string is a valid ThemeOption
 */
export function isValidTheme(theme: string | null | undefined): theme is ThemeOption {
  return theme === ThemeOption.LIGHT || theme === ThemeOption.DARK || theme === ThemeOption.SYSTEM
}

/**
 * Gets the current system theme (LIGHT or DARK)
 */
export function getSystemTheme(): ThemeOption {
  const scheme: ColorSchemeName = Appearance.getColorScheme?.() ?? 'light'
  if (scheme === 'dark') return ThemeOption.DARK
  return ThemeOption.LIGHT
}

/**
 * Loads the user's theme selection from AsyncStorage
 */
export async function loadThemeSelection(): Promise<ThemeOption> {
  try {
    const value = await AsyncStorage.getItem(THEME_STORAGE_KEY)
    if (isValidTheme(value)) {
      return value as ThemeOption
    }
    return ThemeOption.SYSTEM
  } catch {
    return ThemeOption.SYSTEM
  }
}

/**
 * Saves the user's theme selection to AsyncStorage
 */
export async function saveThemeSelection(theme: ThemeOption): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Optionally log error
  }
}

/**
 * Clears the user's theme selection from AsyncStorage
 */
export async function clearThemeSelection(): Promise<void> {
  try {
    await AsyncStorage.removeItem(THEME_STORAGE_KEY)
  } catch {
    // Optionally log error
  }
}