import { useRef } from 'react'
import { Animated } from 'react-native'
import { ANIMATION_DURATION } from '../constants'

/**
 * Hook for managing animations in the welcome screen
 */
export const useAnimations = () => {
  // Animation values
  const thoughtInputOpacity = useRef(new Animated.Value(1)).current
  const lockedThoughtOpacity = useRef(new Animated.Value(0)).current
  const additionalContextTranslateY = useRef(new Animated.Value(20)).current
  const additionalContextOpacity = useRef(new Animated.Value(0)).current

  /**
   * Animate the transition from thought input to locked display
   */
  const animateThoughtSubmission = () => {
    Animated.parallel([
      // Fade out thought input
      Animated.timing(thoughtInputOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      // Fade in locked thought display
      Animated.timing(lockedThoughtOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      // Animate additional context input
      Animated.timing(additionalContextTranslateY, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(additionalContextOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start()
  }

  return {
    thoughtInputOpacity,
    lockedThoughtOpacity,
    additionalContextTranslateY,
    additionalContextOpacity,
    animateThoughtSubmission,
  }
}