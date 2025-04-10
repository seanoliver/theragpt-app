import React, { useRef, useEffect } from 'react'
import { View, TextInput } from 'react-native'
import { styles } from '../styles'
import { TEST_IDS } from '../constants'
import { AdditionalContextInputProps } from '../types'

/**
 * AdditionalContextInput for entering optional context
 * Uses a minimalist design with serif font for a clean, elegant look
 */
const AdditionalContextInput: React.FC<AdditionalContextInputProps> = ({
  value,
  onChange,
  onFocus,
}) => {
  const inputRef = useRef<TextInput>(null)

  // Focus the input when the component mounts
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }, [])

  return (
    <View style={styles.additionalContextContainer}>
      <TextInput
        ref={inputRef}
        style={styles.additionalContextInput}
        value={value}
        onChangeText={onChange}
        onFocus={onFocus}
        placeholder="Any additional context? (optional)"
        placeholderTextColor="#999"
        multiline
        textAlignVertical="top"
        testID={TEST_IDS.additionalContextField}
        accessibilityLabel="Enter additional context"
        accessibilityHint="Optional field to provide more details about your thought"
      />
    </View>
  )
}

export default AdditionalContextInput