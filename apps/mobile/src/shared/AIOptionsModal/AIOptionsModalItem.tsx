import React from 'react'
import { View, Text } from 'react-native'
import theme from '@/apps/mobile/lib/theme'
import AIOptionsModalActionButton from './AIOptionsModalActionButton'

interface Alternative {
  tone: string
  text: string
}

interface AIOptionsModalItem {
  variation: Alternative
  onReplace: () => void
  onAppend: () => void
  onRetry: (text: string, tone: string) => void
}

const AIOptionsModalItem: React.FC<AIOptionsModalItem> = ({
  variation,
  onReplace,
  onAppend,
  onRetry,
}) => (
  <View
    style={{
      backgroundColor: theme.colors.background,
      borderRadius: 10,
      padding: 14,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 4,
    }}
  >
    <Text
      style={{
        color: theme.colors.textOnBackground,
        fontWeight: '600',
        fontSize: 15,
        marginBottom: 6,
      }}
    >
      {variation.tone.charAt(0).toUpperCase() + variation.tone.slice(1)}
    </Text>
    <Text
      style={{
        color: theme.colors.textOnBackground,
        fontSize: 15,
        marginBottom: 10,
      }}
    >
      {variation.text}
    </Text>
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <AIOptionsModalActionButton
        icon="swap-horiz"
        label="Replace"
        onPress={onReplace}
      />
      <AIOptionsModalActionButton
        icon="note-add"
        label="Append"
        onPress={onAppend}
      />
      <AIOptionsModalActionButton
        icon="refresh"
        label="Retry"
        onPress={() => onRetry(variation.text, variation.tone)}
      />
    </View>
  </View>
)

export default AIOptionsModalItem
