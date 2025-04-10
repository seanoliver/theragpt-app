// Re-export the tokens from the UI package
import { tokens } from '@theragpt/ui/src/theme'

// Define colors for the mobile app
export const colors = {
  primary: tokens.colors.primary500,
  secondary: tokens.colors.secondary500,
  background: '#ffffff',
  text: '#212121',
  headerBackground: '#f4f4f4',
  headerText: '#333333',
  tabBarActive: tokens.colors.primary500,
  tabBarInactive: tokens.colors.gray600,
  tabBarBackground: '#ffffff',
  tabBarBorder: tokens.colors.gray300,
}

// Export the tokens for direct use
export { tokens }