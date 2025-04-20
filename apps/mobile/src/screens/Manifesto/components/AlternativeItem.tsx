import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '../../../../lib/theme'

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

const AlternativeItem: React.FC<AlternativeItemProps> = ({ variation, onReplace, onAppend, onRetry }) => (
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
        onPress={onReplace}
      >
        <MaterialIcons
          name="swap-horiz"
          size={18}
          color={colors.text.primary}
          style={{ marginRight: 6 }}
        />
        <Text
          style={{
            color: colors.text.primary,
            fontWeight: '600',
            fontSize: 14,
          }}
        >
          Replace
        </Text>
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
        onPress={onAppend}
      >
        <MaterialIcons
          name="note-add"
          size={18}
          color={colors.text.primary}
          style={{ marginRight: 6 }}
        />
        <Text
          style={{
            color: colors.text.primary,
            fontWeight: '600',
            fontSize: 14,
          }}
        >
          Append
        </Text>
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
        onPress={onRetry}
      >
        <MaterialIcons
          name="refresh"
          size={18}
          color={colors.text.primary}
          style={{ marginRight: 6 }}
        />
        <Text
          style={{
            color: colors.text.primary,
            fontWeight: '600',
            fontSize: 14,
          }}
        >
          Retry
        </Text>
      </TouchableOpacity>
    </View>
  </View>
)

export default AlternativeItem