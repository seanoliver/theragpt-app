import { createConfig, createTheme } from '@gluestack-ui/themed'

// Define our color palette
const colors = {
  primary50: '#E6F7FF',
  primary100: '#BAE7FF',
  primary200: '#91D5FF',
  primary300: '#69C0FF',
  primary400: '#40A9FF',
  primary500: '#1890FF', // Primary color
  primary600: '#096DD9',
  primary700: '#0050B3',
  primary800: '#003A8C',
  primary900: '#002766',

  secondary50: '#F6FFED',
  secondary100: '#D9F7BE',
  secondary200: '#B7EB8F',
  secondary300: '#95DE64',
  secondary400: '#73D13D',
  secondary500: '#52C41A', // Secondary color
  secondary600: '#389E0D',
  secondary700: '#237804',
  secondary800: '#135200',
  secondary900: '#092B00',

  error50: '#FFF1F0',
  error100: '#FFCCC7',
  error200: '#FFA39E',
  error300: '#FF7875',
  error400: '#FF4D4F',
  error500: '#F5222D', // Error color
  error600: '#CF1322',
  error700: '#A8071A',
  error800: '#820014',
  error900: '#5C0011',

  warning50: '#FFFBE6',
  warning100: '#FFF1B8',
  warning200: '#FFE58F',
  warning300: '#FFD666',
  warning400: '#FFC53D',
  warning500: '#FAAD14', // Warning color
  warning600: '#D48806',
  warning700: '#AD6800',
  warning800: '#874D00',
  warning900: '#613400',

  success50: '#F6FFED',
  success100: '#D9F7BE',
  success200: '#B7EB8F',
  success300: '#95DE64',
  success400: '#73D13D',
  success500: '#52C41A', // Success color
  success600: '#389E0D',
  success700: '#237804',
  success800: '#135200',
  success900: '#092B00',

  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  background: {
    light: '#FFFFFF',
    dark: '#121212',
  },

  text: {
    light: '#212121',
    dark: '#FFFFFF',
  },
}

// Create the theme configuration
const config = createConfig({
  theme: createTheme({
    colors,
    space: {
      px: '1px',
      0: 0,
      0.5: 2,
      1: 4,
      1.5: 6,
      2: 8,
      2.5: 10,
      3: 12,
      3.5: 14,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
      12: 48,
      16: 64,
      20: 80,
      24: 96,
      32: 128,
      40: 160,
      48: 192,
      56: 224,
      64: 256,
      72: 288,
      80: 320,
      96: 384,
    },
    fontSizes: {
      '2xs': 10,
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
      '6xl': 60,
      '7xl': 72,
      '8xl': 96,
      '9xl': 128,
    },
    fonts: {
      heading: 'System',
      body: 'System',
      mono: 'monospace',
    },
    fontWeights: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeights: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacings: {
      tighter: -0.8,
      tight: -0.4,
      normal: 0,
      wide: 0.4,
      wider: 0.8,
      widest: 1.6,
    },
    radii: {
      none: 0,
      xs: 2,
      sm: 4,
      md: 6,
      lg: 8,
      xl: 12,
      '2xl': 16,
      '3xl': 24,
      full: 9999,
    },
    breakpoints: {
      base: 0,
      sm: 480,
      md: 768,
      lg: 992,
      xl: 1280,
    },
    mediaQueries: {
      base: '@media screen and (min-width: 0)',
      sm: '@media screen and (min-width: 480px)',
      md: '@media screen and (min-width: 768px)',
      lg: '@media screen and (min-width: 992px)',
      xl: '@media screen and (min-width: 1280px)',
    },
    components: {
      // Component-specific theme customizations can be added here
    },
  }),
})

// Export the theme configuration
export const theme = config.theme

// Export the GluestackUIProvider props
export const gluestackUIConfig = {
  config,
}

// Export theme tokens for direct usage
export const tokens = {
  colors,
}

// Export a function to get theme values with proper typing
export function getThemeValue<T>(path: string): T {
  return config.theme[path] as T
}