import { Ionicons } from '@expo/vector-icons'
import { Card } from '@still/logic/src/cards/service'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../lib/theme/context'
import { useCardService } from '../../hooks/useCardService'
import { InstructionalFooterText } from '../../shared/InstructionalFooterText'

export const CardScreen = () => {
  const router = useRouter()
  const { cardId } = useLocalSearchParams<{ cardId: string }>()
  const [card, setCard] = useState<Card | null>(null)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const { service, cards } = useCardService()
  const { themeObject: theme } = useTheme()

  useEffect(() => {
    if (!cardId || !cards) return
    const foundCard = cards.find(a => a.id === cardId)
    if (foundCard) {
      setCard(foundCard)
      const favorites = cards.filter(
        a => a.text === foundCard.text && a.isFavorite,
      )
      setFavoriteCount(favorites.length)
    }
  }, [cardId, cards])

  const handleDelete = async () => {
    if (!card || !service) return

    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await service.update({
                id: card.id,
                isActive: false,
              })
              router.back()
            } catch (error) {
              console.error('Error deleting card:', error)
              Alert.alert('Error', 'Failed to delete card')
            }
          },
        },
      ],
    )
  }

  const handleSaveCard = async (newText: string) => {
    if (service && card && newText !== card.text) {
      await service.update({ id: card.id, text: newText })
    }
  }

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

  // --- UI Layout ---
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Main Content (starts below the existing header) */}
      <View style={styles.content}>
        {/* Affirmation Card */}
        <View
          style={[
            styles.affirmationCard,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          <Text
            style={[
              styles.affirmationText,
              { color: theme.colors.textOnBackground },
            ]}
          >
            {foundCard.text}
          </Text>
          <View style={styles.affirmationActionsRow}>
            <TouchableOpacity
              style={[
                styles.affirmationActionButton,
                { backgroundColor: theme.colors.hoverBackground },
              ]}
            >
              <Ionicons
                name="volume-high-outline"
                size={18}
                color={theme.colors.textOnBackground}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.affirmationActionText,
                  { color: theme.colors.textOnBackground },
                ]}
              >
                Read Aloud
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.affirmationActionButton,
                { backgroundColor: theme.colors.hoverBackground },
              ]}
            >
              <Ionicons
                name="bookmark-outline"
                size={18}
                color={theme.colors.textOnBackground}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.affirmationActionText,
                  { color: theme.colors.textOnBackground },
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {/* Last Reviewed */}
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.borderSubtle,
              },
            ]}
          >
            <Ionicons
              name="calendar"
              size={22}
              color={theme.colors.textOnBackground}
              style={styles.statIcon}
            />
            <Text
              style={[
                styles.statValue,
                { color: theme.colors.textOnBackground },
              ]}
            >
              {foundCard.lastReviewed
                ? new Date(foundCard.lastReviewed).toLocaleDateString()
                : 'Never'}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: theme.colors.textOnBackground },
              ]}
            >
              Last Reviewed
            </Text>
          </View>
          {/* Favorites */}
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.borderSubtle,
              },
            ]}
          >
            <Ionicons
              name="heart"
              size={22}
              color={theme.colors.textOnBackground}
              style={styles.statIcon}
            />
            <Text
              style={[
                styles.statValue,
                { color: theme.colors.textOnBackground },
              ]}
            >
              {favoriteCount}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: theme.colors.textOnBackground },
              ]}
            >
              Favorites
            </Text>
          </View>
          {/* Reviews */}
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.borderSubtle,
              },
            ]}
          >
            <Ionicons
              name="time-outline"
              size={22}
              color={theme.colors.textOnBackground}
              style={styles.statIcon}
            />
            <Text
              style={[
                styles.statValue,
                { color: theme.colors.textOnBackground },
              ]}
            >
              0
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: theme.colors.textOnBackground },
              ]}
            >
              Reviews
            </Text>
          </View>
        </View>

        {/* AI Variations Section */}
        <View
          style={[
            styles.variationSection,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          <View style={styles.variationHeaderRow}>
            <Text
              style={[
                styles.variationTitle,
                { color: theme.colors.textOnBackground },
              ]}
            >
              AI Variations
            </Text>
            <TouchableOpacity
              style={[
                styles.generateButton,
                { backgroundColor: theme.colors.hoverBackground },
              ]}
            >
              <Text
                style={[
                  styles.generateButtonText,
                  { color: theme.colors.textOnBackground },
                ]}
              >
                Generate
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.variationPlaceholder}>
            <Text
              style={[
                styles.variationPlaceholderText,
                { color: theme.colors.textOnBackground, opacity: 0.6 },
              ]}
            >
              Generate AI variations of your affirmation to discover new
              perspectives and wording.
            </Text>
          </View>
        </View>

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

// --- Styles ---
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
  affirmationCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  affirmationText: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '500',
    marginBottom: 18,
    textAlign: 'left',
  },
  affirmationActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  affirmationActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  affirmationActionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginHorizontal: 2,
    minWidth: 0,
  },
  statIcon: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.7,
    textAlign: 'center',
  },
  variationSection: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
  },
  variationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  variationTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  generateButton: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  generateButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  variationPlaceholder: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  variationPlaceholderText: {
    fontSize: 14,
    textAlign: 'center',
  },
  footerInstructions: {
    marginTop: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
})
