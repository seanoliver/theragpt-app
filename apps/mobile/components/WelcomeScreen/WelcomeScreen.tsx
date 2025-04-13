import React from 'react'
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Message } from './components/Message'
import { MessageInput } from './components/MessageInput'
import { useConversationThread, useWelcomeState } from './hooks'
import { styles } from './lib/styles'

const conversationConfig = {
  initialMessage: {
    content: "What's on your mind?",
    options: [],
  },
  followUpMessages: [
    {
      content:
        "Can you share any more context about what's causing you to feel this way?",
    },
  ],
}

const options = conversationConfig?.initialMessage?.options

export default function WelcomeScreen() {
  const { state, updateThought } = useWelcomeState()

  const { conversationThread, addMessage, addFollowUpMessage } =
    useConversationThread(conversationConfig)

  const onThoughtSubmit = () => {
    if (state.currentThought.trim()) {
      addMessage({
        id: Date.now().toString(),
        content: state.currentThought,
        role: 'user',
      })
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
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 100 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {conversationThread.map(message => (
            <Message key={message.id} message={message} />
          ))}
        </ScrollView>

        <Animated.View
          style={styles.inputContainer}
        >
          <MessageInput
            value={state.currentThought}
            onChange={updateThought}
            onSubmit={onThoughtSubmit}
            options={options}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
