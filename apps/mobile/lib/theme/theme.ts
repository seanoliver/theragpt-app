import { PaletteName, palettes, ThemePalette } from './palettes'
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

export const DEFAULT_LIGHT_PALETTE: PaletteName = 'white'
export const DEFAULT_DARK_PALETTE: PaletteName = 'charcoal'

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
  const fallback = palettes['indigo']
  const base = palettes[paletteName as PaletteName] || fallback
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

export function getColor(theme: Theme, token: ThemeTokenKey): string {
  return theme.colors[token]
}

function luminance(hex: string): number {
  const c = hex.replace('#', '')
  const rgb = [
    parseInt(c.substring(0, 2), 16),
    parseInt(c.substring(2, 4), 16),
    parseInt(c.substring(4, 6), 16),
  ].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
}

export function contrastRatio(hex1: string, hex2: string): number {
  const lum1 = luminance(hex1)
  const lum2 = luminance(hex2)
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)
}

export function getAccessibleTextColor(theme: Theme, bg: string): string {
  const whiteContrast = contrastRatio(bg, theme.colors.text)
  const blackContrast = contrastRatio(bg, '#000000')
  // WCAG recommends at least 4.5:1 for normal text
  return whiteContrast >= blackContrast ? theme.colors.text : '#000000'
}

export const availablePalettes = Object.keys(palettes) as PaletteName[]

export type ThemeType = 'light' | 'dark' | 'system'
export const THEME_TYPES: ThemeType[] = ['light', 'dark', 'system']

export const themes: Record<ThemeType, Theme> = {
  light: getThemeByName(DEFAULT_LIGHT_PALETTE),
  dark: getThemeByName(DEFAULT_DARK_PALETTE),
  system: getThemeByName(DEFAULT_LIGHT_PALETTE),
}

export const DEFAULT_THEME_TYPE: ThemeType = 'dark'
export const DEFAULT_THEME: Theme = themes[DEFAULT_THEME_TYPE]
