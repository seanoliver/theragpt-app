import { useState } from 'react'
import { ThoughtEntryState } from '../types'
import { INITIAL_STATE } from '../constants'

/**
 * Hook for managing the welcome screen state
 */
export const useWelcomeState = () => {
  // State management
  const [state, setState] = useState<ThoughtEntryState>(INITIAL_STATE)

  // Update thought
  const updateThought = (text: string) => {
    setState(prevState => ({
      ...prevState,
      currentThought: text,
    }))
  }

  // Handle thought submission
  const handleThoughtSubmission = () => {
    setState(prevState => ({
      ...prevState,
      isThoughtSubmitted: true,
    }))
  }

  // Update additional context
  const updateAdditionalContext = (text: string) => {
    setState(prevState => ({
      ...prevState,
      additionalContext: text,
    }))
  }

  // Handle additional context focus
  const handleAdditionalContextFocus = () => {
    setState(prevState => ({
      ...prevState,
      isAdditionalContextFocused: true,
    }))
  }

  // Handle additional context submission
  const handleAdditionalContextSubmission = () => {
    // Here you would typically navigate to the next screen or process the data
    console.log('Submitted thought:', state.currentThought)
    console.log('Additional context:', state.additionalContext)
  }

  // Handle skip
  const handleSkip = () => {
    // Here you would typically navigate to the next screen or process the data
    console.log('Submitted thought:', state.currentThought)
    console.log('Skipped additional context')
  }

  return {
    state,
    updateThought,
    handleThoughtSubmission,
    updateAdditionalContext,
    handleAdditionalContextFocus,
    handleAdditionalContextSubmission,
    handleSkip,
  }
}