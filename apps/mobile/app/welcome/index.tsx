import React from 'react'
import { Animated, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from './styles'
import { useWelcomeState, useAnimations } from './hooks'
import {
  HeaderComponent,
  ThoughtInputComponent,
  LockedThoughtDisplay,
  AdditionalContextInput,
  SubmitButtonComponent,
} from './components'

/**
 * WelcomeScreen is the main component for the welcome screen
 */
export default function WelcomeScreen() {
  // State management
  const {
    state,
    updateThought,
    handleThoughtSubmission,
    updateAdditionalContext,
    handleAdditionalContextFocus,
    handleAdditionalContextSubmission,
    handleSkip,
  } = useWelcomeState()

  // Animation values
  const {
    thoughtInputOpacity,
    lockedThoughtOpacity,
    additionalContextTranslateY,
    additionalContextOpacity,
    animateThoughtSubmission,
  } = useAnimations()

  // Handle thought submission with animation
  const onThoughtSubmit = () => {
    handleThoughtSubmission()
    animateThoughtSubmission()
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <HeaderComponent />

          {!state.isThoughtSubmitted ? (
            <Animated.View style={[styles.inputContainer, { opacity: thoughtInputOpacity }]}>
              <ThoughtInputComponent
                value={state.currentThought}
                onChange={updateThought}
                onSubmit={onThoughtSubmit}
              />
            </Animated.View>
          ) : (
            <>
              <Animated.View style={{ opacity: lockedThoughtOpacity }}>
                <LockedThoughtDisplay thought={state.currentThought} />
              </Animated.View>

              <Animated.View
                style={{
                  opacity: additionalContextOpacity,
                  transform: [{ translateY: additionalContextTranslateY }],
                }}
              >
                <AdditionalContextInput
                  value={state.additionalContext}
                  onChange={updateAdditionalContext}
                  onFocus={handleAdditionalContextFocus}
                />

                {state.additionalContext.length > 0 ? (
                  <SubmitButtonComponent
                    onPress={handleAdditionalContextSubmission}
                    enabled={true}
                    text="Submit"
                    testID="submit-context-button"
                    accessibilityLabel="Submit additional context"
                  />
                ) : (
                  <SubmitButtonComponent
                    onPress={handleSkip}
                    enabled={true}
                    text="Skip"
                    testID="skip-context-button"
                    accessibilityLabel="Skip providing additional context"
                  />
                )}
              </Animated.View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}