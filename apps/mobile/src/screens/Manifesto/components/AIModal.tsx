import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Modal from 'react-native-modal';
import { colors } from '../../../../lib/theme';
import AlternativeItem from './AlternativeItem';

interface Alternative {
  tone: string
  text: string
}

interface AIModalProps {
  visible: boolean
  value: string
  alternatives: Alternative[]
  loading: boolean
  error: string | null
  onClose: () => void
  onReplace: (text: string) => void
  onAppend: (text: string) => void
  onRetry: (text: string) => void
}

const AIModal: React.FC<AIModalProps> = ({
  visible,
  value,
  alternatives,
  loading,
  error,
  onClose,
  onReplace,
  onAppend,
  onRetry,
}) => (
  <Modal
    isVisible={visible}
    onBackdropPress={onClose}
    onBackButtonPress={onClose}
    style={{ justifyContent: 'flex-end', margin: 0 }}
  >
    <View
      style={{
        backgroundColor: colors.charcoal[200],
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        padding: 0,
        minHeight: 340,
        maxHeight: '70%',
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          padding: 20,
          borderBottomWidth: 1,
          borderColor: colors.charcoal[300],
          backgroundColor: colors.charcoal[200],
          zIndex: 2,
        }}
      >
        <Text
          style={{
            color: colors.text.primary,
            fontSize: 13,
            fontWeight: '600',
            marginBottom: 4,
            opacity: 0.7,
            textAlign: 'left',
            letterSpacing: 0.5,
          }}
        >
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
      <ScrollView
        style={{
          marginBottom: 12,
          paddingHorizontal: 20,
          paddingTop: 12,
        }}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {loading && (
          <View style={{ alignItems: 'center', marginTop: 24 }}>
            <ActivityIndicator size="large" color={colors.text.primary} />
            <Text style={{ color: colors.text.primary, marginTop: 12 }}>
              Generating alternatives...
            </Text>
          </View>
        )}
        {error && (
          <Text style={{ color: 'red', marginTop: 12, textAlign: 'center' }}>
            {error}
          </Text>
        )}
        {!loading &&
          !error &&
          alternatives.map((variation) => (
            <AlternativeItem
              key={variation.tone}
              variation={variation}
              onReplace={() => onReplace(variation.text)}
              onAppend={() => onAppend(variation.text)}
              onRetry={() => onRetry(variation.text)}
            />
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
        onPress={onClose}
      >
        <Text
          style={{
            color: colors.text.primary,
            fontWeight: '600',
            fontSize: 16,
          }}
        >
          Close
        </Text>
      </TouchableOpacity>
    </View>
  </Modal>
)

export default AIModal