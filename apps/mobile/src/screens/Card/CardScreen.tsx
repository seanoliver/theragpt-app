import { Card } from '@still/logic'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../lib/theme/context'
import { useCardService } from '../../hooks/useCardService'
import { InstructionalFooterText } from '../../shared/InstructionalFooterText'
import { CardScreenEdit } from './CardEdit'
import { CardScreenStats } from './CardScreenStats'
import { CardScreenAIVariations } from './CardScreenAIVariations'

export const CardScreen = () => {
  const { cardId } = useLocalSearchParams<{ cardId: string }>()
  const [card, setCard] = useState<Card | null>(null)
  const { service, cards } = useCardService()
  const { themeObject: theme } = useTheme()

  useEffect(() => {
    if (!cardId || !cards) return
    const foundCard = cards.find(a => a.id === cardId)
    if (foundCard) {
      setCard(foundCard)
    }
  }, [cardId, cards])

  if (!service || !cards || !card) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={{ color: theme.colors.textOnBackground, marginTop: 16 }}>
          Loading...
        </Text>
      </View>
    )
  }

  const foundCard = cards.find(a => a.id === cardId)

  if (!cardId || !foundCard) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <Text style={{ color: 'red' }}>Card not found.</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.content}>
        {/* Card Editor + Audio Playback */}
        <CardScreenEdit card={card} />

        {/* Stats Row */}
        <CardScreenStats card={card} />

        {/* AI Variations Section */}
        <CardScreenAIVariations card={card} />

        {/* Footer Instructions */}
        <InstructionalFooterText
          text={[
            'Tap "Read Aloud" to hear your affirmation.',
            'Use "Generate" to create AI variations.',
          ]}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
})
