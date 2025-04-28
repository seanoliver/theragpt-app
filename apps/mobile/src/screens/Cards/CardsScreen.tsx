import React, { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from '../../../lib/theme/context'
import { FAB } from '../../shared/FAB'
import { CardList } from './CardList'
import { filterCardData } from './filterCardData'
import { useCardStore } from '../../store/useCardStore'
import { Theme } from '@/apps/mobile/lib/theme'
import { Ionicons } from '@expo/vector-icons'

export const CardsScreen = () => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)
  const [searchQuery, setSearchQuery] = useState('')

  // Use Zustand store
  const { cards, isLoading, error, addCard } = useCardStore()

  // Filtered data based on search query
  const filteredCards = useMemo(
    () => filterCardData(cards, searchQuery),
    [cards, searchQuery],
  )

  // Handler for creating a new card
  const handleNew = async () => {
    await addCard({ text: '', isActive: true })
    // Optionally scroll to top or show feedback
  }

  // TODO: Render loading or error state
  if (isLoading) {
    return (
      <View style={styles.centered}>
        {/* Replace with a loading spinner if desired */}
      </View>
    )
  }
  if (error) {
    return (
      <View style={styles.centered}>{/* TODO: Replace with error UI */}</View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {/* TODO: <SearchBar value={searchQuery} onChange={setSearchQuery} /> */}
        <CardList cards={filteredCards} />
        {/* TODO: {filteredCards.length === 0 && <EmptyState />} */}
      </View>
      <FAB onPress={handleNew}>
        <Ionicons name="add" size={24} color={theme.colors.white} />
      </FAB>
    </View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    inner: {
      flex: 1,
      paddingHorizontal: 0,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
