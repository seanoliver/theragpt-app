import React, { useRef, useEffect } from 'react'
import { View, TextInput } from 'react-native'
import { styles } from '../styles'
import { TEST_IDS } from '../constants'
import { ThoughtInputComponentProps } from '../types'
import SubmitButtonComponent from './SubmitButtonComponent'

/**
 * ThoughtInputComponent for entering the user's thought
 */
const ThoughtInputComponent: React.FC<ThoughtInputComponentProps> = ({
  value,
  onChange,
  onSubmit,
  isSubmitEnabled,
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
        placeholder="Type your thought here..."
        placeholderTextColor="#999"
        multiline
        textAlignVertical="top"
        testID={TEST_IDS.thoughtInputField}
        accessibilityLabel="Enter your troubling thought"
        accessibilityHint="Type the thought that's bothering you and press submit when done"
      />

      <SubmitButtonComponent
        onPress={onSubmit}
        enabled={isSubmitEnabled}
        text="Submit"
      />
    </View>
  )
}

export default ThoughtInputComponent
