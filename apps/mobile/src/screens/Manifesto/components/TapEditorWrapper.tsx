import { useRef, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { colors } from '../../../../lib/theme'

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
            blurOnSubmit
            multiline={multiline}
            onSubmitEditing={handleSubmitEditing}
            selectionColor={colors.text.primary}
            returnKeyType="done"
            placeholder="Edit statement..."
            placeholderTextColor="#888"
          />
          {markdownPreview && (
            <View style={{ opacity: 0.9, marginTop: 8 }}>
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
