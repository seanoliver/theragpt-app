import React from 'react'
import { View, Text } from 'react-native'
import { colors } from '@/apps/mobile/lib/theme'
import ActionButton from './ActionButton'

interface Alternative {
  tone: string
  text: string
}

interface AlternativeItemProps {
  variation: Alternative
  onReplace: () => void
  onAppend: () => void
  onRetry: () => void
}

const AlternativeItem: React.FC<AlternativeItemProps> = ({
  variation,
  onReplace,
  onAppend,
  onRetry,
}) => (
  <View
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
    <Text
      style={{
        color: colors.text.primary,
        fontWeight: '600',
        fontSize: 15,
        marginBottom: 6,
      }}
    >
      {variation.tone.charAt(0).toUpperCase() + variation.tone.slice(1)}
    </Text>
    <Text
      style={{
        color: colors.text.primary,
        fontSize: 15,
        marginBottom: 10,
      }}
    >
      {variation.text}
    </Text>
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <ActionButton
        icon="swap-horiz"
        label="Replace"
        onPress={onReplace}
      />
      <ActionButton
        icon="note-add"
        label="Append"
        onPress={onAppend}
      />
      <ActionButton
        icon="refresh"
        label="Retry"
        onPress={onRetry}
      />
    </View>
  </View>
)

export default AlternativeItem
