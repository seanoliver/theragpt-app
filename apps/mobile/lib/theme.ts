// Define colors for the mobile app
export const colors = {
  charcoal: {
    100: '#121212', // Main background - deep dark
    200: '#1E1E1E', // Cards - slightly lighter
    300: '#2D2D2D', // Hover states
    400: '#3D3D3D', // Borders
    500: '#4D4D4D',
  },
  green: {
    100: '#2E7D32',
    200: '#388E3C',
    300: '#4CAF50',
    400: '#81C784',
    500: '#69F0AE',
  },
  red: {
    100: '#B71C1C',
    200: '#D32F2F',
    300: '#E57373',
    400: '#EF5350',
    500: '#FF5252',
  },
  blue: {
    100: '#0097A7',
    200: '#00ACC1',
    300: '#00BCD4',
    400: '#03A9F4',
    500: '#2196F3',
  },
  yellow: {
    100: '#F57F17',
    200: '#FFC107',
    300: '#FFCA28',
    400: '#FFD54F',
    500: '#FFEB3B',
  },
  orange: {
    100: '#E65100',
    200: '#FF9800',
    300: '#FFA726',
    400: '#FFB74D',
    500: '#FFC145',
  },
  purple: {
    100: '#4A148C',
    200: '#7B1FA2',
    300: '#9C27B0',
    400: '#AB47BC',
    500: '#7B61FF',
  },
  pink: {
    100: '#880E4F',
    200: '#C2185B',
    300: '#D81B60',
    400: '#E91E63',
    500: '#EC407A',
  },
  gray: {
    100: '#212121',
    200: '#666666',
    300: '#B3B3B3',
    400: '#E0E0E0',
    500: '#FFFFFF',
  },
  indigo: {
    100: '#1A237E',
    200: '#303F9F',
    300: '#3949AB',
    400: '#3949AB',
    500: '#303F9F',
  },
  text: {
    primary: '#FFFFFF', // White for primary text
    secondary: '#B3B3B3', // Light gray for secondary text
    placeholder: '#666666', // Medium gray for placeholders
  },
  accent: {
    primary: '#7B61FF', // Modern purple
    secondary: '#6C757D', // Neutral gray
  },
  header: {
    background: '#1E1E1E',
    text: '#FFFFFF',
  },
  tabBar: {
    active: '#7B61FF',
    inactive: '#6C757D',
    background: '#1E1E1E',
    border: '#2D2D2D',
  }
}

// Define tokens for consistent styling
export const tokens = {
  colors: {
    primary500: '#7B61FF',
    secondary500: '#6C757D',
    gray300: '#2D2D2D',
    gray600: '#6C757D',
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
    // fallback
    serifAlt: 'Times New Roman',
    sansAlt: 'System',
  }
}