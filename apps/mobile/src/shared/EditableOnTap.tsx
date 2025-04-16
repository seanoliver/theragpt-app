import { useRef, useState } from 'react'
import { TextInput, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native'

interface EditableOnTapProps {
  value: string
  onChange: (text: string) => void
  children: React.ReactNode // Rendered when not editing
  inputStyle?: TextStyle
  containerStyle?: ViewStyle
  inputProps?: Partial<React.ComponentProps<typeof TextInput>>
  autoFocus?: boolean
  multiline?: boolean
  markdownPreview?: React.ReactNode // Optional: live preview below input
}

export function EditableOnTap({
  value,
  onChange,
  children,
  inputStyle,
  containerStyle,
  inputProps = {},
  autoFocus = true,
  multiline = true,
  markdownPreview,
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
  }

  return (
    <View style={containerStyle}>
      {isEditing ? (
        <View style={{ flex: 1 }}>
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChange}
            style={inputStyle}
            autoFocus={autoFocus}
            onBlur={handleBlur}
            blurOnSubmit
            multiline={multiline}
            {...inputProps}
          />
          {markdownPreview && (
            <View style={{ opacity: 0.7, marginTop: 8 }}>
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