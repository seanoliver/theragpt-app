import { useRef, useState, useEffect } from 'react'
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { colors } from '../../../../lib/theme'
import { InputMenuBar } from '../../../shared/InputMenuBar'
import {
  MarkdownTextInput,
  parseExpensiMark,
} from '@expensify/react-native-live-markdown'
import { markdownStyle } from '@/apps/mobile/lib/markdownStyle'
import Modal from 'react-native-modal'
import Markdown from 'react-native-markdown-display'
import { MaterialIcons } from '@expo/vector-icons'
import { apiService } from '@still/logic/src/api/service'
import { getStillApiBaseUrl } from '@still/config/src/api'
import AIModal from './AIModal'

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
  const [showAIModal, setShowAIModal] = useState(false)
  const [alternatives, setAlternatives] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  // Fetch alternatives from the API when the modal opens
  useEffect(() => {
    if (showAIModal) {
      setLoading(true)
      setError(null)
      setAlternatives([])
      apiService
        .generateAlternatives(value, [
          'Empowering',
          'Gentle',
          'Playful',
          'Pragmatic',
          'Inspirational',
          'Reassuring',
          'Bold',
          'Reflective',
          'Grateful',
          'Curious',
        ])
        .then(config =>
          fetch(`${getStillApiBaseUrl()}/api/rephrase`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config),
          }),
        )
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.alternatives)) {
            setAlternatives(data.alternatives)
          } else {
            setError(data.error || 'Failed to fetch alternatives')
          }
        })
        .catch(err => setError(err.message || 'Failed to fetch alternatives'))
        .finally(() => setLoading(false))
    }
  }, [showAIModal, value])

  const handleReplace = (text: string) => {
    onChange(text)
    setShowAIModal(false)
  }

  const handleAppend = (text: string) => {
    onChange(value + (value ? ' ' : '') + text)
    setShowAIModal(false)
  }

  const handleRetry = (text: string) => {
    onChange(value + (value ? ' ' : '') + text)
    setShowAIModal(false)
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
              onAIEnhance={() => setShowAIModal(true)}
            />
          )}
          <AIModal
            visible={showAIModal}
            value={value}
            alternatives={alternatives}
            loading={loading}
            error={error}
            onClose={() => setShowAIModal(false)}
            onReplace={handleReplace}
            onAppend={handleAppend}
            onRetry={handleRetry}
          />
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
