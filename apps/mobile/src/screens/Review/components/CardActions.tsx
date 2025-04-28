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
  const upvoteCard = useCardStore(state => state.upvoteCard)
  const downvoteCard = useCardStore(state => state.downvoteCard)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => downvoteCard(cardId)}
        accessibilityLabel="Downvote"
      >
        <Ionicons
          name="chevron-down-circle-outline"
          size={32}
          color={theme.colors.errorAccent + '99'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => upvoteCard(cardId)}
        accessibilityLabel="Upvote"
      >
        <Ionicons
          name="chevron-up-circle-outline"
          size={32}
          color={theme.colors.successAccent + '99'}
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
