import React from 'react'
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThoughtInputComponent, Message } from './components'
import { useAnimations, useConversationThread, useWelcomeState } from './hooks'
import { styles } from './lib/styles'

const conversationConfig = {
  initialMessage: {
    content: "What's on your mind?",
  },
  followUpMessages: [
    {
      content:
        "Can you share any more context about what's causing you to feel this way?",
    },
    // Add more follow-up messages here as needed
  ],
}

/**
 * WelcomeScreen is the main component for the welcome screen
 */
export default function WelcomeScreen() {
  // State management
  const { state, updateThought, handleThoughtSubmission } = useWelcomeState()

  const { conversationThread, addMessage, addFollowUpMessage } =
    useConversationThread(conversationConfig)

  // Animation values
  const { thoughtInputOpacity, animateThoughtSubmission } = useAnimations()

  // Handle thought submission with animation
  const onThoughtSubmit = () => {
    if (state.currentThought.trim()) {
      addMessage({
        id: Date.now().toString(),
        content: state.currentThought,
        role: 'user',
      })
      // handleThoughtSubmission()
      // animateThoughtSubmission()
      // Add a slight delay before showing the follow-up message
      setTimeout(addFollowUpMessage, 1000)
    }
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
          {conversationThread.map(message => (
            <Message key={message.id} message={message} />
          ))}

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
