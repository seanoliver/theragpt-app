import React, { useRef, useEffect } from 'react'
import { View, TextInput } from 'react-native'
import { styles } from '../lib/styles'
import { TEST_IDS } from '../lib/constants'
import { MessageInputProps } from '../lib/types'

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSubmit,
}) => {
  const inputRef = useRef<TextInput>(null)

  // Focus the input when the component mounts
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }, [])

  return (
    <View style={styles.inputContainer}>
      <TextInput
        ref={inputRef}
        style={styles.thoughtInput}
        value={value}
        onChangeText={onChange}
        placeholder="I'm feeling..."
        placeholderTextColor="#999"
        multiline
        textAlignVertical="top"
        testID={TEST_IDS.thoughtInputField}
        accessibilityLabel="Enter any troubling thought or feeling"
        accessibilityHint="Type the thought that's bothering you and press return to submit"
        onSubmitEditing={onSubmit}
        returnKeyType="done"
        blurOnSubmit={true}
        enablesReturnKeyAutomatically={true}
      />
    </View>
  )
}
