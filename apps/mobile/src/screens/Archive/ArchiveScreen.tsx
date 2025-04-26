import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../../lib/theme/context'
import { useCardService } from '../../hooks/useCardService'
import { FAB } from '../../shared/FAB'
import { ArchiveEmptyState } from './components/ArchiveEmptyState'
import { ArchiveLineItem } from './components/ArchiveLineItem'

export const ArchiveScreen = () => {
  const { service, cards } = useCardService(true)
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null)

  const { themeObject: theme } = useTheme()

  if (!service || !cards) {
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

  const isEmpty = cards.length === 0

  const handleAddCard = async () => {
    if (!service) return
    const newCard = await service.create({ text: '', isActive: false })
    setNewlyCreatedId(newCard.id)
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
          {cards.map((card, index) => (
            <React.Fragment key={card.id}>
              <ArchiveLineItem
                card={card}
                onPublish={() => service.update({ id: card.id, isActive: true })}
                onDelete={() => service.deleteCard(card.id)}
              />
              {index < cards.length - 1 && (
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
