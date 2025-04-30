import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/apps/mobile/lib/theme/context'
import { useCardStore } from '@/apps/mobile/src/store/useCardStore'

type CardActionsProps = {
  cardId: string
}

export const CardActions: React.FC<CardActionsProps> = ({ cardId }) => {
  const { themeObject: theme } = useTheme()
  const heartCard = useCardStore(state => state.upvoteCard)

  const isHearted = false

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => heartCard(cardId)}
        accessibilityLabel="Heart"
      >
        <Ionicons
          name={isHearted ? 'heart' : 'heart-outline'}
          size={32}
          color={theme.colors.errorAccent}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  actionButton: {
    marginHorizontal: 24,
  },
})
