import { useRef, useState, useEffect } from 'react'
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { colors } from '../../../../lib/theme'
import { InputMenuBar } from '../../../shared/InputMenuBar'

const TEXT_SIZE = 16
const LINE_HEIGHT = 24

interface EditableOnTapProps {
  value: string
  onChange: (text: string) => void
  children: React.ReactNode
  autoFocus?: boolean
  multiline?: boolean
  markdownPreview?: React.ReactNode
  onSave?: (newText: string) => void
}

export function EditableOnTap({
  value,
  onChange,
  children,
  autoFocus = true,
  multiline = true,
  markdownPreview,
  onSave,
}: EditableOnTapProps) {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<TextInput>(null)
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
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChange}
            style={[styles.text]}
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
          />
          {Platform.OS === 'ios' && (
            <InputMenuBar
              inputRef={inputRef}
              inputAccessoryViewID={inputAccessoryViewID}
            />
          )}
          {markdownPreview && (
            <View style={{ opacity: 0.6, marginTop: 8 }}>
              {markdownPreview}
            </View>
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
