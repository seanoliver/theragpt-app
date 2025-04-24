import React, { useMemo, useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { useTheme } from '../../../lib/theme/context'
import { FAB } from '../../shared/FAB'
// TODO: Placeholder imports for new components to be implemented
// import { SearchBar } from './SearchBar';
// import { NewCardButton } from './NewCardButton';
import { CardList } from './CardList'
// import { EmptyState } from './EmptyState';
import { filterCardData } from './filterCardData'
import { useCardData } from './useCardData'
import { Theme } from '@/apps/mobile/lib/theme'

export const CardsScreen = () => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)
  const [searchQuery, setSearchQuery] = useState('')
  const { data: cards, loading, error, createCard } = useCardData()

  // Filtered data based on search query
  const filteredCards = useMemo(
    () => filterCardData(cards, searchQuery),
    [cards, searchQuery],
  )

  // Handler for creating a new card
  const handleNew = async () => {
    await createCard()
    // Optionally scroll to top or show feedback
  }

  // TODO: Render loading or error state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          {/* Replace with a loading spinner if desired */}
        </View>
      </SafeAreaView>
    )
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>{/* TODO: Replace with error UI */}</View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* TODO: <SearchBar value={searchQuery} onChange={setSearchQuery} /> */}
        <CardList cards={filteredCards} />
        {/* TODO: {filteredCards.length === 0 && <EmptyState />} */}
      </View>
      <FAB onPress={handleNew} backgroundColor={theme.colors.accent}>
        {/* TODO: Use Ionicons or similar for "+" icon */}
      </FAB>
    </SafeAreaView>
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
