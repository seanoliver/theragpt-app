import React, { useMemo } from 'react'
import { Text, View } from 'react-native'
import { useTheme } from '../../../lib/theme/context'
import { CardList } from '../../shared/CardList/CardList'
import { useCardStore } from '../../store/useCardStore'
import { ArchiveEmptyState } from './ArchiveEmptyState'

export const ArchiveScreen = () => {
  const { themeObject: theme } = useTheme()

  const cards = useCardStore(state => state.cards)
  const isLoading = useCardStore(state => state.isLoading)

  const archivedCards = useMemo(
    () => cards.filter(card => !card.isActive),
    [cards],
  )
  const isEmpty = archivedCards.length === 0

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.foregroundBackground,
        }}
      >
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primaryBackground }}>
      {isEmpty ? <ArchiveEmptyState /> : <CardList cards={archivedCards} />}
    </View>
  )
}
