import { useRef, useState, useEffect } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View, Text, ScrollView } from 'react-native'
import { colors } from '../../../../lib/theme'
import { InputMenuBar } from '../../../shared/InputMenuBar'
import {
  MarkdownTextInput,
  parseExpensiMark,
} from '@expensify/react-native-live-markdown'
import { markdownStyle } from '@/apps/mobile/lib/markdownStyle';
import Modal from 'react-native-modal'
import Markdown from 'react-native-markdown-display'
import { MaterialIcons } from '@expo/vector-icons'

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
              onAIEnhance={() => setShowAIModal(true)}
            />
          )}
          <Modal
            isVisible={showAIModal}
            onBackdropPress={() => setShowAIModal(false)}
            onBackButtonPress={() => setShowAIModal(false)}
            style={{ justifyContent: 'flex-end', margin: 0 }}
          >
            <View style={{
              backgroundColor: colors.charcoal[200],
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              padding: 0,
              minHeight: 340,
              maxHeight: '70%',
              overflow: 'hidden',
            }}>
              <View
                style={{
                  padding: 20,
                  borderBottomWidth: 1,
                  borderColor: colors.charcoal[300],
                  backgroundColor: colors.charcoal[200],
                  zIndex: 2,
                }}
              >
                <Text style={{
                  color: colors.text.primary,
                  fontSize: 13,
                  fontWeight: '600',
                  marginBottom: 4,
                  opacity: 0.7,
                  textAlign: 'left',
                  letterSpacing: 0.5,
                }}>
                  Original Statement
                </Text>
                <Markdown
                  style={{
                    text: {
                      color: colors.text.primary,
                      fontSize: 16,
                      textAlign: 'left',
                    },
                    body: {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  {value}
                </Markdown>
              </View>
              <ScrollView style={{ marginBottom: 12, paddingHorizontal: 20, paddingTop: 12 }} contentContainerStyle={{ paddingBottom: 24 }}>
                {[
                  { tone: 'Realistic', text: 'This is a realistic version of your statement.' },
                  { tone: 'Grounded', text: 'This is a grounded version of your statement.' },
                  { tone: 'Inspirational', text: 'This is an inspirational version of your statement.' },
                  { tone: 'Motivational', text: 'This is a motivational version of your statement.' },
                ].map((variation, idx) => (
                  <View
                    key={variation.tone}
                    style={{
                      backgroundColor: colors.charcoal[100],
                      borderRadius: 10,
                      padding: 14,
                      marginBottom: 12,
                      shadowColor: '#000',
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                    }}
                  >
                    <Text style={{
                      color: colors.text.primary,
                      fontWeight: '600',
                      fontSize: 15,
                      marginBottom: 6,
                    }}>{variation.tone}</Text>
                    <Text style={{
                      color: colors.text.primary,
                      fontSize: 15,
                      marginBottom: 10,
                    }}>{variation.text}</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: colors.charcoal[300],
                          borderRadius: 6,
                          paddingVertical: 6,
                          paddingHorizontal: 0,
                          marginRight: 0,
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          onChange(variation.text)
                          setShowAIModal(false)
                        }}
                      >
                        <MaterialIcons name="swap-horiz" size={18} color={colors.text.primary} style={{ marginRight: 6 }} />
                        <Text style={{ color: colors.text.primary, fontWeight: '600', fontSize: 14 }}>Replace</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          backgroundColor: colors.charcoal[300],
                          borderRadius: 6,
                          paddingVertical: 6,
                          paddingHorizontal: 0,
                          marginRight: 0,
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          onChange(value + (value ? ' ' : '') + variation.text)
                          setShowAIModal(false)
                        }}
                      >
                        <MaterialIcons name="note-add" size={18} color={colors.text.primary} style={{ marginRight: 6 }} />
                        <Text style={{ color: colors.text.primary, fontWeight: '600', fontSize: 14 }}>Append</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          backgroundColor: colors.charcoal[300],
                          borderRadius: 6,
                          paddingVertical: 6,
                          paddingHorizontal: 0,
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          onChange(value + (value ? ' ' : '') + variation.text)
                          setShowAIModal(false)
                        }}
                      >
                        <MaterialIcons name="refresh" size={18} color={colors.text.primary} style={{ marginRight: 6 }} />
                        <Text style={{ color: colors.text.primary, fontWeight: '600', fontSize: 14 }}>Refresh</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  marginTop: 0,
                  marginBottom: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 24,
                  backgroundColor: colors.charcoal[300],
                  borderRadius: 8,
                }}
                onPress={() => setShowAIModal(false)}
              >
                <Text style={{ color: colors.text.primary, fontWeight: '600', fontSize: 16 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
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
