import { Theme } from '@/apps/mobile/lib/theme'
import React, { useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../../lib/theme/context'
import { FAB } from '../../shared/context/FAB/FAB'
import { useFABContext } from '../../shared/context/FAB/FABContext'
import { useCardStore } from '../../store/useCardStore'
import { CardList } from '../../shared/CardList/CardList'
import { filterCardData } from './filterCardData'

export const CardsScreen = () => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)
  const [searchQuery, _setSearchQuery] = useState('')

  const { cards, isLoading, error, addCard } = useCardStore()
  const { openFAB, setEditingCard } = useFABContext()

  const filteredCards = useMemo(
    () =>
      filterCardData(
        cards.filter(card => card.isActive),
        searchQuery,
      ),
    [cards, searchQuery],
  )

  const handleNew = async () => {
    const newCard = await addCard({ text: '', isActive: true })
    if (newCard) {
      setEditingCard(newCard)
      openFAB()
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        {/* Replace with a loading spinner if desired */}
      </View>
    )
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <CardList cards={filteredCards} />
      </View>
      <FAB onPress={handleNew} />
    </View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primaryBackground,
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
