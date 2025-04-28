import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../lib/theme/context';
import { FAB } from '../../shared/FAB';
import { useCardStore } from '../../store/useCardStore';
import { ArchiveEmptyState } from './components/ArchiveEmptyState';
import { ArchiveLineItem } from './components/ArchiveLineItem';

export const ArchiveScreen = () => {
  const { themeObject: theme } = useTheme()

  // Zustand store selectors
  const cards = useCardStore(state => state.cards)
  const isLoading = useCardStore(state => state.isLoading)
  const addCard = useCardStore(state => state.addCard)
  const updateCard = useCardStore(state => state.updateCard)
  const deleteCard = useCardStore(state => state.deleteCard)

  // Filter for archived cards (isActive === false)
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
          backgroundColor: theme.colors.background,
        }}
      >
        <Text>Loading...</Text>
      </View>
    )
  }

  const handleAddCard = async () => {
    const prevLength = cards.length
    await addCard({ text: '', isActive: false })
    // After addCard, the new card should be last in the array
    const updatedCards = useCardStore.getState().cards
    if (updatedCards.length > prevLength) {
      const lastCard = updatedCards[updatedCards.length - 1]
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {isEmpty ? (
        <ArchiveEmptyState />
      ) : (
        <ScrollView
          style={styles.cardsList}
          keyboardShouldPersistTaps="handled"
        >
          {archivedCards.map((card, index) => (
            <React.Fragment key={card.id}>
              <ArchiveLineItem
                card={card}
                onPublish={() => updateCard({ id: card.id, isActive: true })}
                onDelete={() => deleteCard(card.id)}
              />
              {index < archivedCards.length - 1 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: theme.colors.border,
                    width: '100%',
                    marginVertical: 8,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </ScrollView>
      )}

      <FAB onPress={handleAddCard}>
        <Ionicons name="add" size={32} color={theme.colors.background} />
      </FAB>
    </View>
  )
}

const styles = StyleSheet.create({
  cardsList: {
    flex: 1,
    paddingRight: 4,
  },
})
