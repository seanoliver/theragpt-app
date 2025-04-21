// Indigo palette and theme system for the mobile app

// Centralized indigo palette with variants
export const indigoPalette = {
  background: '#232946',
  primary: '#3e4a89',
  accent: '#5f6caf',
  hover: {
    background: '#2d3560',
    primary: '#4957a6',
    accent: '#6d7bbf',
  },
  disabled: {
    background: '#23294680', // 50% opacity
    primary: '#3e4a8980',
    accent: '#5f6caf80',
  },
  white: '#FFFFFF',
  black: '#000000',
};

// Theme tokens for consistent usage
export const theme = {
  colors: {
    background: indigoPalette.background,
    primary: indigoPalette.primary,
    accent: indigoPalette.accent,
    hoverBackground: indigoPalette.hover.background,
    hoverPrimary: indigoPalette.hover.primary,
    hoverAccent: indigoPalette.hover.accent,
    disabledBackground: indigoPalette.disabled.background,
    disabledPrimary: indigoPalette.disabled.primary,
    disabledAccent: indigoPalette.disabled.accent,
    textOnBackground: indigoPalette.white,
    textOnPrimary: indigoPalette.white,
    textOnAccent: indigoPalette.white,
    textDisabled: '#B3B3B3',
    border: '#3e4a89',
    // legacy support
    white: indigoPalette.white,
    black: indigoPalette.black,
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
};

// Utility to get color by token name
export function getColor(token: keyof typeof theme.colors): string {
  return theme.colors[token];
}

// Accessibility/contrast helpers

// Calculate luminance for a hex color
function luminance(hex: string): number {
  const c = hex.replace('#', '');
  const rgb = [
    parseInt(c.substring(0, 2), 16),
    parseInt(c.substring(2, 4), 16),
    parseInt(c.substring(4, 6), 16),
  ].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

// Calculate contrast ratio between two hex colors
export function contrastRatio(hex1: string, hex2: string): number {
  const lum1 = luminance(hex1);
  const lum2 = luminance(hex2);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

// Returns best text color (white or black) for given background
export function getAccessibleTextColor(bg: string): string {
  const whiteContrast = contrastRatio(bg, indigoPalette.white);
  const blackContrast = contrastRatio(bg, indigoPalette.black);
  // WCAG recommends at least 4.5:1 for normal text
  return whiteContrast >= blackContrast ? indigoPalette.white : indigoPalette.black;
}

// Export all theme tokens for use in components
export default theme;