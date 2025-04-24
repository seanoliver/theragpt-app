import React, { useMemo } from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import { Card } from './Card'
import { DisplayCard } from './useCardData'
import { SwipeAction, SwipeMenu } from '../../shared/SwipeMenu'
import { useTheme } from '@/apps/mobile/lib/theme/context'
import { Theme } from '@/apps/mobile/lib/theme'
import { Ionicons } from '@expo/vector-icons'
import { useCardService } from '../../hooks/useCardService'
interface CardListProps {
  cards: DisplayCard[]
}

export const CardList = ({ cards }: CardListProps) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  const { service } = useCardService()

  const handleArchive = (card: DisplayCard) => {
    service?.update({ id: card.id, isActive: false })
  }

  const handleDelete = (card: DisplayCard) => {
    service?.deleteCard(card.id)
  }

  const getSwipeActions = (card: DisplayCard): SwipeAction[] => [
    {
      label: 'archive',
      icon: (
        <Ionicons name="archive-outline" size={24} color={theme.colors.white} />
      ),
      backgroundColor: theme.colors.accent,
      textColor: theme.colors.white,
      onPress: () => handleArchive(card),
    },
    {
      label: 'delete',
      icon: (
        <Ionicons name="trash-outline" size={24} color={theme.colors.white} />
      ),
      backgroundColor: theme.colors.errorAccent,
      textColor: theme.colors.white,
      onPress: () => handleDelete(card),
    },
  ]

  return (
    <FlatList
      data={cards}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <SwipeMenu actions={getSwipeActions(item)}>
          <View style={styles.cardWrapper}>
            <Card card={item} />
          </View>
        </SwipeMenu>
      )}
      contentContainerStyle={styles.listContent}
    />
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    listContent: {
      paddingBottom: 120,
      paddingTop: 16,
    },
    cardWrapper: {
      marginBottom: 16,
      marginHorizontal: 16,
    },
  })
