import theme from '@/apps/mobile/lib/theme'
import { InputMenuBar } from '@/apps/mobile/src/shared/InputMenuBar'
import { getEnvironment } from '@still/config'
import { apiService } from '@still/logic/src/api/service'
import { useEffect, useRef, useState } from 'react'
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native'
import AIOptionsModal from '../../shared/AIOptionsModal/AIOptionsModal'
import { useFetchAlternatives } from '../../shared/hooks/useFetchAlternatives'

const TEXT_SIZE = 16
const LINE_HEIGHT = 24

interface ManifestoItemEditorWrapperProps {
  value: string
  onChange: (text: string) => void
  children: React.ReactNode
  autoFocus?: boolean
  multiline?: boolean
  onSave?: (newText: string) => void
}

export const ManifestoItemEditorWrapper = ({
  value,
  onChange,
  children,
  autoFocus = true,
  multiline = true,
  onSave,
}: ManifestoItemEditorWrapperProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const {
    alternatives,
    loading,
    error,
    fetchAlternatives,
    setError,
    setAlternatives,
  } = useFetchAlternatives()
  const inputRef = useRef<any>(null)
  const inputAccessoryViewID = 'uniqueID-TapEditorWrapper'

  const env = getEnvironment(true)

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

  useEffect(() => {
    if (showAIModal) {
      fetchAlternatives(value)
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

  const handleRetry = async (text: string, tone: string) => {
    setError(null)
    try {
      const config = await apiService.generateAlternative(value, tone)
      const response = await fetch(`${env.STILL_API_BASE_URL}/api/rephrase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      const data = await response.json()
      if (data.success && data.tone && data.text) {
        onChange(value + (value ? ' ' : '') + data.text)
        setShowAIModal(false)
      } else {
        setError(data.error || 'Failed to fetch alternative')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch alternative')
    }
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
            selectionColor={theme.colors.textOnBackground}
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
              onAIEnhance={() => setShowAIModal(true)}
            />
          )}
          <AIOptionsModal
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
    color: theme.colors.textOnBackground,
    flex: 1,
    top: -2,
    textAlign: 'left',
  },
})
