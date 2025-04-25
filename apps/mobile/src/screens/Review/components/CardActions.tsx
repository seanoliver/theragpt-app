import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type CardActionsProps = {
  onListen: () => void
  onUpvote: () => void
  onDownvote: () => void
}

export const CardActions: React.FC<CardActionsProps> = ({
  onListen,
  onUpvote,
  onDownvote,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onListen}
        accessibilityLabel="Listen"
      >
        <Ionicons name="play-circle-outline" size={32} color="#4F8EF7" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onUpvote}
        accessibilityLabel="Upvote"
      >
        <Ionicons name="arrow-up-circle-outline" size={32} color="#4CAF50" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onDownvote}
        accessibilityLabel="Downvote"
      >
        <Ionicons name="arrow-down-circle-outline" size={32} color="#F44336" />
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
