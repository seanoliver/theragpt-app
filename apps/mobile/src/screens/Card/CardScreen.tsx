import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../../lib/theme/context'
import { InstructionalFooterText } from '../../shared/InstructionalFooterText'
import { useCardStore } from '../../store/useCardStore'
import { CardScreenEdit } from './CardEdit'
import { CardScreenAIVariations } from './CardScreenAIVariations'
import { CardScreenStats } from './CardScreenStats'
import { Theme } from '@/apps/mobile/lib/theme/theme'

export const CardScreen = () => {
  const { cardId } = useLocalSearchParams<{ cardId: string }>()
  const { themeObject: theme } = useTheme()
  const cards = useCardStore(state => state.cards)
  const isLoading = useCardStore(state => state.isLoading)

  const card = cardId ? cards.find(card => card.id === cardId) : null

  const styles = makeStyles(theme)

  if (isLoading || !cards) {
    // Keep existing loading indicator for when card data is not yet available
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  if (!cardId || !card) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Card not found.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
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
    </View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
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
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      color: theme.colors.textOnBackground,
      marginTop: 16,
    },
    errorText: {
      color: theme.colors.errorText
    },
  })
