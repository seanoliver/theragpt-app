import React from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ThoughtInputComponent,
  Message,
} from './components';
import { useAnimations, useConversationThread, useWelcomeState } from './hooks';
import { styles } from './lib/styles';

/**
 * WelcomeScreen is the main component for the welcome screen
 */
export default function WelcomeScreen() {
  // State management
  const {
    state,
    updateThought,
    handleThoughtSubmission,
  } = useWelcomeState()

  const { conversationThread, addMessage } = useConversationThread()

  // Animation values
  const {
    thoughtInputOpacity,
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
          <Message message={{ id: '1', content: 'Hello', role: 'user' }} />

          <Animated.View
            style={[styles.inputContainer, { opacity: thoughtInputOpacity }]}
          >
            <ThoughtInputComponent
              value={state.currentThought}
              onChange={updateThought}
              onSubmit={onThoughtSubmit}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}