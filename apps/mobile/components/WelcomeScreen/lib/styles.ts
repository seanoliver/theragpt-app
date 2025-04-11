import { StyleSheet } from 'react-native'
import { tokens } from '../../../lib/theme'
import { SCREEN_WIDTH, BREAKPOINT_SMALL, BREAKPOINT_MEDIUM } from './constants'

/**
 * Get responsive spacing based on screen width
 */
export const getResponsiveSpacing = () => {
  if (SCREEN_WIDTH < BREAKPOINT_SMALL) {
    return {
      componentSpacing: tokens.space.md,
      inputMaxHeight: 120, // Fixed height instead of percentage
      fontSize: tokens.fontSizes.lg,
      headerFontSize: tokens.fontSizes.lg,
    }
  } else if (SCREEN_WIDTH < BREAKPOINT_MEDIUM) {
    return {
      componentSpacing: tokens.space.lg,
      inputMaxHeight: 160, // Fixed height instead of percentage
      fontSize: tokens.fontSizes.xl,
      headerFontSize: tokens.fontSizes.xl,
    }
  } else {
    return {
      componentSpacing: tokens.space.xl,
      inputMaxHeight: 200, // Fixed height instead of percentage
      fontSize: tokens.fontSizes.xxl,
      headerFontSize: tokens.fontSizes.xxl,
    }
  }
}

export const { componentSpacing, inputMaxHeight, fontSize, headerFontSize } = getResponsiveSpacing()

/**
 * Styles for the welcome screen components
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: tokens.space.lg,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  headerContainer: {
    marginBottom: componentSpacing,
  },
  headerText: {
    fontFamily: tokens.fontFamilies.serif,
    fontWeight: '400',
    color: '#212121',
    fontSize: headerFontSize,
    letterSpacing: 0.5,
  },
  inputContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: tokens.space.lg,
    backgroundColor: '#ffffff',
  },
  thoughtInput: {
    borderWidth: 0,
    padding: 0,
    maxHeight: inputMaxHeight,
    fontSize: fontSize,
    color: '#212121',
    fontFamily: tokens.fontFamilies.serif,
    lineHeight: fontSize * 1.5,
    textAlignVertical: 'top',
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    paddingVertical: tokens.space.md,
    paddingHorizontal: tokens.space.lg,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: tokens.space.sm,
  },
  buttonEnabled: {
    backgroundColor: tokens.colors.primary500,
  },
  buttonDisabled: {
    backgroundColor: tokens.colors.gray300,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: tokens.fontSizes.md,
  },
  lockedThoughtContainer: {
    borderWidth: 0, // Remove border for a cleaner look
    padding: tokens.space.md,
    minHeight: 120,
    marginBottom: componentSpacing,
    backgroundColor: '#fafafa', // Very light gray background
  },
  lockedThoughtText: {
    fontSize: fontSize,
    color: '#212121',
    fontFamily: tokens.fontFamilies.serif,
    lineHeight: fontSize * 1.5,
  },
  additionalContextContainer: {
    marginBottom: componentSpacing,
  },
  additionalContextInput: {
    borderWidth: 0, // Remove border for a cleaner look
    padding: tokens.space.md,
    minHeight: 100,
    marginBottom: tokens.space.md,
    fontSize: fontSize,
    color: '#212121',
    fontFamily: tokens.fontFamilies.serif,
    lineHeight: fontSize * 1.5,
  },
  chatBubbleContainer: {
    marginTop: componentSpacing,
    marginBottom: componentSpacing,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  chatBubble: {
    backgroundColor: tokens.colors.primary500,
    padding: tokens.space.md,
    borderRadius: 20,
    borderTopLeftRadius: 4,
  },
  chatBubbleText: {
    color: '#ffffff',
    fontSize: fontSize,
    fontFamily: tokens.fontFamilies.serif,
    lineHeight: fontSize * 1.5,
  },
})