import React from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import { Card } from './Card'
import { DisplayCard } from './useCardData'

interface CardListProps {
  cards: DisplayCard[]
}

export const CardList = ({ cards }: CardListProps) => {
  return (
    <FlatList
      data={cards}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <Card statement={item} />
        </View>
      )}
      contentContainerStyle={styles.listContent}
    />
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 120,
    paddingTop: 16,
  },
  cardWrapper: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
})
