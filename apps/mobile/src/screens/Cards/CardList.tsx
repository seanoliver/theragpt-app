import React from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import { Card } from './Card'
import { Card as CardType } from '@still/logic'
import { SwipeAction, SwipeMenu } from '../../shared/SwipeMenu'
import { useTheme } from '@/apps/mobile/lib/theme/context'
import { Theme } from '@/apps/mobile/lib/theme'
import { Ionicons } from '@expo/vector-icons'
import { useCardStore } from '../../store/useCardStore'

interface CardListProps {
  cards: CardType[]
}

export const CardList = ({ cards }: CardListProps) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  const getSwipeActions = (card: CardType): SwipeAction[] => [
    {
      label: 'archive',
      icon: (
        <Ionicons name="archive-outline" size={24} color={theme.colors.white} />
      ),
      backgroundColor: theme.colors.accent,
      textColor: theme.colors.white,
      onPress: () => useCardStore.getState().updateCard({ id: card.id, isActive: false }),
    },
    {
      label: 'delete',
      icon: (
        <Ionicons name="trash-outline" size={24} color={theme.colors.white} />
      ),
      backgroundColor: theme.colors.errorAccent,
      textColor: theme.colors.white,
      onPress: () => useCardStore.getState().deleteCard(card.id),
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
