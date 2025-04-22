/**
 * Multi-Palette Theme System for the Mobile App
 * Supports runtime selection of pre-defined color palettes.
 * Modular, type-safe, and <500 lines.
 */

// 1. Types & Interfaces

export type ThemeTokenKey =
  | 'primary'
  | 'background'
  | 'text'
  | 'accent'
  | 'border'
  | 'error'
  | 'success'
  | 'warning'
  | 'textOnBackground'
  | 'textOnPrimary'
  | 'textOnAccent'
  | 'textDisabled'
  | 'hoverBackground'
  | 'hoverPrimary'
  | 'hoverAccent'
  | 'disabledBackground'
  | 'disabledPrimary'
  | 'disabledAccent'
  | 'white'
  | 'black'

export type ThemePalette = Record<ThemeTokenKey, string>
export type PaletteName = 'indigo' | 'forest' | 'sunset'
export type ThemePalettes = Record<PaletteName, ThemePalette>

// 2. Palette Definitions

const palettes: ThemePalettes = {
  indigo: {
    primary: '#3e4a89',
    background: '#232946',
    text: '#FFFFFF',
    accent: '#5f6caf',
    border: '#3e4a89',
    error: '#FF4C4C',
    success: '#4CAF50',
    warning: '#FFC107',
    textOnBackground: '#FFFFFF',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#FFFFFF',
    textDisabled: '#B3B3B3',
    hoverBackground: '#2d3560',
    hoverPrimary: '#4957a6',
    hoverAccent: '#6d7bbf',
    disabledBackground: '#23294680',
    disabledPrimary: '#3e4a8980',
    disabledAccent: '#5f6caf80',
    white: '#FFFFFF',
    black: '#000000',
  },
  forest: {
    primary: '#2e7d32',
    background: '#1b2e1b',
    text: '#FFFFFF',
    accent: '#66bb6a',
    border: '#388e3c',
    error: '#e57373',
    success: '#81c784',
    warning: '#ffd54f',
    textOnBackground: '#FFFFFF',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#1b2e1b',
    textDisabled: '#B3B3B3',
    hoverBackground: '#244422',
    hoverPrimary: '#388e3c',
    hoverAccent: '#81c784',
    disabledBackground: '#1b2e1b80',
    disabledPrimary: '#2e7d3280',
    disabledAccent: '#66bb6a80',
    white: '#FFFFFF',
    black: '#000000',
  },
  sunset: {
    primary: '#ff7043',
    background: '#fff3e0',
    text: '#232946',
    accent: '#ffa726',
    border: '#ff7043',
    error: '#d32f2f',
    success: '#388e3c',
    warning: '#fbc02d',
    textOnBackground: '#232946',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#232946',
    textDisabled: '#B3B3B3',
    hoverBackground: '#ffe0b2',
    hoverPrimary: '#ff8a65',
    hoverAccent: '#ffb74d',
    disabledBackground: '#fff3e080',
    disabledPrimary: '#ff704380',
    disabledAccent: '#ffa72680',
    white: '#FFFFFF',
    black: '#000000',
  },
}

// 3. Theme Tokens for Consistent Usage

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
}

// 4. Consistency Enforcement: Fallback for missing tokens

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

// 5. Theme Retrieval Logic

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
  }
}

export const defaultTheme = getThemeByName('indigo')
// Backward compatibility: default export for legacy imports
const theme = defaultTheme
export default theme

// 6. Utility to get color by token name for a given theme

export function getColor(theme: Theme, token: ThemeTokenKey): string {
  return theme.colors[token]
}

// 7. Accessibility/contrast helpers

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

// 8. Export default theme (indigo) and palettes

export const availablePalettes = Object.keys(palettes) as PaletteName[]

export { palettes }
