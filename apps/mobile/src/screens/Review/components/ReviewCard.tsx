import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Card } from '@still/logic/src/cards/service'
import { CardActions } from './CardActions'
import { Theme } from '@/apps/mobile/lib/theme'

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
  const styles = makeStyles(themeObject)

  return (
    <View style={[styles.cardContainer]}>
      <View style={styles.textContainer}>
        <Text style={[styles.cardText]}>{card.text}</Text>
      </View>
      <CardActions
        onListen={onListen}
        onUpvote={onUpvote}
        onDownvote={onDownvote}
      />
    </View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    cardContainer: {
      flex: 1,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 8,
      padding: 24,
      backgroundColor: theme.colors.background,
      ...theme.rnShadows.subtle,
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
      color: theme.colors.text,
      fontSize: theme.fontSizes.xxl,
    },
  })
