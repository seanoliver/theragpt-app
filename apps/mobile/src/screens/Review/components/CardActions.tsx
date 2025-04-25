import React, { useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/apps/mobile/lib/theme/context'
import { useCardInteractionService } from '@still/logic/src/card-interaction/useCardInteractionService'
type CardActionsProps = {
  cardId: string
}

export const CardActions: React.FC<CardActionsProps> = ({ cardId }) => {
  const { themeObject: theme } = useTheme()
  const { handleUpvote, handleDownvote } = useCardInteractionService(cardId)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleDownvote}
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
        onPress={handleUpvote}
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
