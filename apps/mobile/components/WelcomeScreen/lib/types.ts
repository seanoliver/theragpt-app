/**
 * Types for the welcome screen
 */

/**
 * State for the thought entry process
 */
export interface ThoughtEntryState {
  currentThought: string
  isThoughtSubmitted: boolean
  additionalContext: string
  isAdditionalContextFocused: boolean
}

/**
 * Props for the HeaderComponent
 */
export interface HeaderComponentProps {
  // No props needed for now
}

/**
 * Props for the MessageInput
 */
export interface MessageInputProps {
  value: string
  onChange: (text: string) => void
  onSubmit: () => void
}

/**
 * Props for the SubmitButtonComponent
 */
export interface SubmitButtonComponentProps {
  onPress: () => void
  enabled: boolean
  text: string
  testID?: string
  accessibilityLabel?: string
}

/**
 * Props for the LockedThoughtDisplay
 */
export interface LockedThoughtDisplayProps {
  thought: string
}

/**
 * Props for the AdditionalContextInput
 */
export interface AdditionalContextInputProps {
  value: string
  onChange: (text: string) => void
  onFocus: () => void
}