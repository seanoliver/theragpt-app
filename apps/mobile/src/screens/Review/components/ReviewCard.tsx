import { Theme } from '@/apps/mobile/lib/theme'
import { Ionicons } from '@expo/vector-icons'
import { Card } from '@theragpt/logic'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CardActions } from './CardActions'
type ReviewCardProps = {
  card: Card
  onListen: () => void
  themeObject: Theme
}

export const ReviewCard = ({
  card,
  onListen,
  themeObject,
}: ReviewCardProps) => {
  const styles = makeStyles(themeObject)

  return (
    <View style={[styles.cardContainer]}>
      <View style={styles.textContainer}>
        <Text style={[styles.cardText]}>{card.text}</Text>
        <TouchableOpacity
          onPress={onListen}
          accessibilityLabel="Listen"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <Ionicons
            name="play"
            size={16}
            color={themeObject.colors.tertiaryText}
          />
          <Text
            style={{ marginLeft: 8, color: themeObject.colors.tertiaryText }}
          >
            Listen
          </Text>
        </TouchableOpacity>
      </View>
      <CardActions cardId={card.id} />
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
      backgroundColor: theme.colors.foregroundBackground,
      ...theme.rnShadows.subtle,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    cardText: {
      textAlign: 'left',
      fontWeight: '400',
      lineHeight: 32,
      color: theme.colors.primaryText,
      fontSize: theme.fontSizes.xxl,
    },
  })
