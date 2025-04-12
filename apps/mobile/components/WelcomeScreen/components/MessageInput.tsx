import { tokens } from '@/apps/mobile/lib/theme'
import React, { useEffect, useRef } from 'react'
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from 'react-native'
import { TEST_IDS } from '../lib/constants'
import { componentSpacing, fontSize, inputMaxHeight } from '../lib/styles'

export interface MessageInputProps {
  value: string
  onChange: (text: string) => void
  onSubmit: () => void
  options?: string[]
}

export const MessageInput = ({
  value,
  onChange,
  onSubmit,
  options,
}: MessageInputProps) => {
  const inputRef = useRef<TextInput>(null)

  // Focus the input when the component mounts
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }, [])

  const onOptionPress = (option: string) => {
    onSubmit()
  }

  return (
    <View style={styles.inputContainer}>
      {!options || options.length === 0 ? (
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
      ) : (
        <View style={styles.buttonsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onOptionPress(option)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

export const styles = StyleSheet.create({
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: componentSpacing,
    backgroundColor: '#ffffff',
  },
  thoughtInput: {
    borderWidth: 0,
    padding: 0,
    maxHeight: inputMaxHeight,
    fontSize: fontSize,
    color: '#212121',
    fontFamily: tokens.fontFamilies.serif,
    lineHeight: fontSize * 1.5,
    textAlignVertical: 'top',
    paddingTop: 0,
    paddingBottom: 0,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: tokens.space.sm,
  },
  button: {
    paddingVertical: tokens.space.md,
    paddingHorizontal: tokens.space.lg,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#000000',
    marginTop: tokens.space.sm,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: tokens.fontSizes.md,
  },
})
