/**
 * Modular Theme Definitions for the Mobile App
 * Supports runtime selection of pre-defined color palettes.
 * Extensible, type-safe, and <500 lines.
 */

import { Theme, ThemePalette, ThemeTokenKey, PaletteName } from '../theme'

export type ThemeType = 'light' | 'dark' | 'system'
export const THEME_TYPES: ThemeType[] = ['light', 'dark', 'system']

// Theme definitions (can be extended)
export const themes: Record<ThemeType, Theme> = {
  light: {
    colors: {
      ...require('../theme').palettes.sunset,
    },
    space: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    fontFamilies: {
      headerSerif: 'PlayfairDisplay_700Bold',
      bodySans: 'Inter_400Regular',
      bodySansBold: 'Inter_700Bold',
      serifAlt: 'Times New Roman',
      sansAlt: 'System',
    },
  },
  dark: {
    colors: {
      ...require('../theme').palettes.indigo,
    },
    space: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    fontFamilies: {
      headerSerif: 'PlayfairDisplay_700Bold',
      bodySans: 'Inter_400Regular',
      bodySansBold: 'Inter_700Bold',
      serifAlt: 'Times New Roman',
      sansAlt: 'System',
    },
  },
  system: {
    // System will be resolved at runtime, fallback to light
    colors: {
      ...require('../theme').palettes.sunset,
    },
    space: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    fontFamilies: {
      headerSerif: 'PlayfairDisplay_700Bold',
      bodySans: 'Inter_400Regular',
      bodySansBold: 'Inter_700Bold',
      serifAlt: 'Times New Roman',
      sansAlt: 'System',
    },
  },
}

export const DEFAULT_THEME_TYPE: ThemeType = 'system'
export const DEFAULT_THEME: Theme = themes[DEFAULT_THEME_TYPE]