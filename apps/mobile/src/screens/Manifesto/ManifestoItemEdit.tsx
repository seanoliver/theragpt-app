import theme from '@/apps/mobile/lib/theme'
import { InputMenuBar } from '@/apps/mobile/src/shared/InputMenuBar'
import { Statement } from '@/packages/logic/src/statement/statementService'
import { useEffect, useRef, useState } from 'react'
import { Platform, StyleSheet, TextInput, View } from 'react-native'
import {
  MANIFESTO_ITEM_LINE_HEIGHT,
  MANIFESTO_ITEM_TEXT_SIZE,
} from './constants'
import { ManifestoItemAIOpptions } from './ManifestoItemAIOpptions'

interface ManifestoItemEditProps {
  currentStatement: Statement
  setCurrentStatement: (statement: Statement) => void
  setIsEditing: (isEditing: boolean) => void
  autoFocus?: boolean
  multiline?: boolean
  onSave?: (newText: string) => void
}

export const ManifestoItemEdit = ({
  setIsEditing,
  currentStatement,
  setCurrentStatement,
  autoFocus = true,
  multiline = true,
  onSave,
}: ManifestoItemEditProps) => {
  const [showAIModal, setShowAIModal] = useState(false)

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


  const handleSubmit = () => {
    setIsEditing(false)
    if (onSave) onSave(currentStatement.text)
  }

  return (
    <>
      <TextInput
        ref={inputRef}
        value={currentStatement.text}
        onChangeText={text =>
          setCurrentStatement({ ...currentStatement, text })
        }
        style={[styles.text]}
        autoFocus={autoFocus}
        onBlur={handleSubmit}
        multiline={multiline}
        onSubmitEditing={handleSubmit}
        selectionColor={theme.colors.textOnBackground}
        returnKeyType="default"
        placeholder="Edit statement..."
        placeholderTextColor="#333"
        // keyboardAppearance="dark"
        inputAccessoryViewID={
          Platform.OS === 'ios' ? inputAccessoryViewID : undefined
        }
      />
      {/* Only iOS supports the input accessory view */}
      {Platform.OS === 'ios' && (
        <InputMenuBar
          inputRef={inputRef}
          inputAccessoryViewID={inputAccessoryViewID}
          onAIEnhance={() => setShowAIModal(true)}
        />
      )}
      {showAIModal && (
        <ManifestoItemAIOpptions
          currentStatement={currentStatement}
          setCurrentStatement={setCurrentStatement}
          showAIModal={showAIModal}
          setShowAIModal={setShowAIModal}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  text: {
    color: theme.colors.black,
    fontFamily: theme.fontFamilies.bodySans,
    fontWeight: '500',
    fontSize: 20,
    letterSpacing: 0.15,
    textShadowColor: 'rgba(44,44,44,0.10)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
})
