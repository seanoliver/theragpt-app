import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Card } from '@still/logic/src/cards/service'
import { CardActions } from './CardActions'

type ReviewCardProps = {
  card: Card
  onListen: () => void
  onUpvote: () => void
  onDownvote: () => void
  themeObject: any
}

export const ReviewCard = ({
  card,
  onListen,
  onUpvote,
  onDownvote,
  themeObject,
}: ReviewCardProps) => {
  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: themeObject.colors.cardBackground },
      ]}
    >
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.cardText,
            {
              color: themeObject.colors.text,
              fontSize: themeObject.fontSizes.xxl,
            },
          ]}
        >
          {card.text}
        </Text>
      </View>
      <CardActions
        onListen={onListen}
        onUpvote={onUpvote}
        onDownvote={onDownvote}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardText: {
    textAlign: 'center',
    fontWeight: '600',
  },
})
