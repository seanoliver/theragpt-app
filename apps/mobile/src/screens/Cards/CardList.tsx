import React, { useState } from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import { Card } from './Card'
import { Card as CardType } from '@still/logic'
import { SwipeAction, SwipeMenu } from '../../shared/SwipeMenu'
import { useTheme } from '@/apps/mobile/lib/theme/context'
import { Theme } from '@/apps/mobile/lib/theme'
import { Ionicons } from '@expo/vector-icons'
import { useCardStore } from '../../store/useCardStore'
import Animated, {
  Layout,
  LinearTransition,
  SlideOutLeft,
  runOnJS,
} from 'react-native-reanimated'

interface CardListProps {
  cards: CardType[]
  onCardPress?: (card: CardType) => void
}

type RemovingCard = { id: string; action: 'archive' | 'delete' }

export const CardList = ({ cards, onCardPress }: CardListProps) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  const handleArchive = (cardId: string) => {
    useCardStore.getState().updateCard({ id: cardId, isActive: false })
  }
  const handleDelete = (cardId: string) => {
    useCardStore.getState().deleteCard(cardId)
  }

  const getSwipeActions = (card: CardType): SwipeAction[] => [
    {
      label: 'archive',
      icon: (
        <Ionicons name="archive-outline" size={24} color={theme.colors.white} />
      ),
      backgroundColor: theme.colors.accent,
      textColor: theme.colors.white,
      onPress: () => handleArchive(card.id),
    },
    {
      label: 'delete',
      icon: (
        <Ionicons name="trash-outline" size={24} color={theme.colors.white} />
      ),
      backgroundColor: theme.colors.errorAccent,
      textColor: theme.colors.white,
      onPress: () => handleDelete(card.id),
    },
  ]

  return (
    <FlatList
      data={cards}
      keyExtractor={item => item.id}
      renderItem={({ item }) => {
        return (
          <SwipeMenu actions={getSwipeActions(item)}>
            <Animated.View
              exiting={SlideOutLeft}
              layout={LinearTransition}
              style={styles.cardWrapper}
            >
              <Card card={item} onPress={() => onCardPress?.(item)} />
            </Animated.View>
          </SwipeMenu>
        )
      }}
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
