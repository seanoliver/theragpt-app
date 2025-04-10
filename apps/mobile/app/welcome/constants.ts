import { Dimensions } from 'react-native'

/**
 * Test IDs for component testing
 */
export const TEST_IDS = {
  headerComponent: "welcome-screen-header",
  thoughtInputField: "thought-input-field",
  submitThoughtButton: "submit-thought-button",
  lockedThoughtDisplay: "locked-thought-display",
  additionalContextField: "additional-context-field",
  skipContextButton: "skip-context-button",
  submitContextButton: "submit-context-button"
}

/**
 * Screen dimensions for responsive design
 */
export const { width: SCREEN_WIDTH } = Dimensions.get('window')

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINT_SMALL = 375
export const BREAKPOINT_MEDIUM = 768

/**
 * Animation durations
 */
export const ANIMATION_DURATION = 300

/**
 * Initial state for the thought entry process
 */
export const INITIAL_STATE = {
  currentThought: "",
  isThoughtSubmitted: false,
  additionalContext: "",
  isAdditionalContextFocused: false
}