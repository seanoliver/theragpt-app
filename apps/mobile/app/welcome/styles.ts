import { StyleSheet } from 'react-native'
import { tokens } from '../theme'
import { SCREEN_WIDTH, BREAKPOINT_SMALL, BREAKPOINT_MEDIUM } from './constants'

/**
 * Get responsive spacing based on screen width
 */
export const getResponsiveSpacing = () => {
  if (SCREEN_WIDTH < BREAKPOINT_SMALL) {
    return {
      componentSpacing: tokens.space.md,
      inputMaxHeight: 120 // Fixed height instead of percentage
    }
  } else if (SCREEN_WIDTH < BREAKPOINT_MEDIUM) {
    return {
      componentSpacing: tokens.space.lg,
      inputMaxHeight: 160 // Fixed height instead of percentage
    }
  } else {
    return {
      componentSpacing: tokens.space.xl,
      inputMaxHeight: 200 // Fixed height instead of percentage
    }
  }
}

const { componentSpacing, inputMaxHeight } = getResponsiveSpacing()

/**
 * Styles for the welcome screen components
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  keyboardAvoidingView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    padding: tokens.space.lg
  },
  headerContainer: {
    marginBottom: componentSpacing
  },
  headerText: {
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center'
  },
  inputContainer: {
    marginBottom: componentSpacing
  },
  thoughtInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: tokens.space.md,
    minHeight: 120,
    maxHeight: inputMaxHeight,
    marginBottom: tokens.space.md,
    fontSize: tokens.fontSizes.md,
    color: '#212121',
    backgroundColor: '#f9f9f9'
  },
  button: {
    paddingVertical: tokens.space.md,
    paddingHorizontal: tokens.space.lg,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: tokens.space.sm
  },
  buttonEnabled: {
    backgroundColor: tokens.colors.primary500
  },
  buttonDisabled: {
    backgroundColor: tokens.colors.gray300
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: tokens.fontSizes.md
  },
  lockedThoughtContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: tokens.space.md,
    minHeight: 120,
    marginBottom: componentSpacing,
    backgroundColor: '#f5f5f5'
  },
  lockedThoughtText: {
    fontSize: tokens.fontSizes.md,
    color: '#212121'
  },
  additionalContextContainer: {
    marginBottom: componentSpacing
  },
  additionalContextInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: tokens.space.md,
    minHeight: 100,
    marginBottom: tokens.space.md,
    fontSize: tokens.fontSizes.md,
    color: '#212121',
    backgroundColor: '#f9f9f9'
  }
})