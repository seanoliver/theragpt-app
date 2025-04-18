import { useRef, useState, useEffect } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { colors } from '../../../../lib/theme'
import { InputMenuBar } from '../../../shared/InputMenuBar'
import {
  MarkdownTextInput,
  parseExpensiMark,
} from '@expensify/react-native-live-markdown'
import { markdownStyle } from '@/apps/mobile/lib/markdownStyle';

const TEXT_SIZE = 16
const LINE_HEIGHT = 24

interface EditableOnTapProps {
  value: string
  onChange: (text: string) => void
  children: React.ReactNode
  autoFocus?: boolean
  multiline?: boolean
  onSave?: (newText: string) => void
}

export function EditableOnTap({
  value,
  onChange,
  children,
  autoFocus = true,
  multiline = true,
  onSave,
}: EditableOnTapProps) {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<any>(null)
  const inputAccessoryViewID = 'uniqueID-TapEditorWrapper'

  useEffect(() => {
    if (autoFocus) {
      setIsEditing(true)
      setTimeout(() => {
        inputRef.current?.focus?.()
      }, 100)
    }
  }, [autoFocus])

  const handleTextPress = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus?.()
    }, 100)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (onSave) onSave(value)
  }

  const handleSubmitEditing = () => {
    setIsEditing(false)
    if (onSave) onSave(value)
  }

  return (
    <View style={[styles.container]}>
      {isEditing ? (
        <View style={{ flex: 1 }}>
          <MarkdownTextInput
            ref={inputRef}
            value={value}
            onChangeText={onChange}
            style={[styles.text]}
            markdownStyle={markdownStyle}
            autoFocus={autoFocus}
            onBlur={handleBlur}
            multiline={multiline}
            onSubmitEditing={handleSubmitEditing}
            selectionColor={colors.text.primary}
            returnKeyType="default"
            placeholder="Edit statement..."
            placeholderTextColor="#888"
            keyboardAppearance="dark"
            inputAccessoryViewID={
              Platform.OS === 'ios' ? inputAccessoryViewID : undefined
            }
            parser={parseExpensiMark}
          />
          {Platform.OS === 'ios' && (
            <InputMenuBar
              inputRef={inputRef}
              inputAccessoryViewID={inputAccessoryViewID}
            />
          )}
        </View>
      ) : (
        <TouchableOpacity onPress={handleTextPress} activeOpacity={0.7}>
          {children}
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: TEXT_SIZE,
    lineHeight: LINE_HEIGHT,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    minHeight: LINE_HEIGHT + 8,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'left',
  },
})
