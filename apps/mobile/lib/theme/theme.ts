import { ThemeMode, themes, ThemePalette } from './palettes'
import { ThemeTokenKey } from './tokens'

export interface Theme {
  colors: ThemePalette
  space: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
  }
  fontSizes: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    xxl: number
    xxxl: number
  }
  fontFamilies: {
    headerSerif: string
    bodySans: string
    bodySansBold: string
    serifAlt: string
    sansAlt: string
  }
  rnShadows: {
    subtle: {
      shadowColor: string
      shadowOffset: { width: number; height: number }
      shadowOpacity: number
      shadowRadius: number
      elevation: number
    }
    medium: {
      shadowColor: string
      shadowOffset: { width: number; height: number }
      shadowOpacity: number
      shadowRadius: number
      elevation: number
    }
    visible: {
      shadowColor: string
      shadowOffset: { width: number; height: number }
      shadowOpacity: number
      shadowRadius: number
      elevation: number
    }
  }
}

export const DEFAULT_LIGHT_PALETTE: ThemeMode = 'light'
export const DEFAULT_DARK_PALETTE: ThemeMode = 'dark'

function completePalette(
  palette: Partial<ThemePalette>,
  fallback: ThemePalette,
): ThemePalette {
  const completed: Partial<ThemePalette> = { ...palette }
  ;(Object.keys(fallback) as ThemeTokenKey[]).forEach(key => {
    if (!completed[key]) {
      completed[key] = fallback[key]
    }
  })
  return completed as ThemePalette
}

export function getThemeByName(paletteName: string): Theme {
  const fallback = themes['light']
  const base = themes[paletteName as ThemeMode] || fallback
  const colors = completePalette(base, fallback)

  return {
    colors,
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
    rnShadows: {
      subtle: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
      },
      visible: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 12,
      },
    },
  }
}

export const defaultTheme = getThemeByName(DEFAULT_LIGHT_PALETTE)

export type ThemeType = 'light' | 'dark' | 'system'
export const THEME_TYPES: ThemeType[] = ['light', 'dark', 'system']

export const appThemes: Record<ThemeType, Theme> = {
  light: getThemeByName(DEFAULT_LIGHT_PALETTE),
  dark: getThemeByName(DEFAULT_DARK_PALETTE),
  system: getThemeByName(DEFAULT_LIGHT_PALETTE),
}

export const DEFAULT_THEME_TYPE: ThemeType = 'light'
export const DEFAULT_THEME: Theme = appThemes[DEFAULT_THEME_TYPE]
