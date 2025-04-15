import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../lib/theme'
import { Affirmation } from '@still/logic/src/affirmation/types'
import { affirmationService } from '@still/logic/src/affirmation/service'
import { useEffect, useState } from 'react'
import { StillCard } from '../shared/StillCard'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function StillScreen() {
  const router = useRouter()
  const { affirmationId } = useLocalSearchParams<{ affirmationId: string }>()
  const [affirmation, setAffirmation] = useState<Affirmation | null>(null)
  const [favoriteCount, setFavoriteCount] = useState(0)

  useEffect(() => {
    loadAffirmation()
  }, [affirmationId])

  const loadAffirmation = async () => {
    if (!affirmationId) return

    try {
      const affirmations = await affirmationService.getAllAffirmations()
      const foundAffirmation = affirmations.find(a => a.id === affirmationId)
      if (foundAffirmation) {
        setAffirmation(foundAffirmation)
        // Count how many times this affirmation has been favorited
        const favorites = affirmations.filter(
          a => a.text === foundAffirmation.text && a.isFavorite,
        )
        setFavoriteCount(favorites.length)
      }
    } catch (error) {
      console.error('Error loading affirmation:', error)
    }
  }

  const handleDelete = async () => {
    if (!affirmation) return

    Alert.alert(
      'Delete Affirmation',
      'Are you sure you want to delete this affirmation?',
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
              await affirmationService.updateAffirmation({
                id: affirmation.id,
                isActive: false,
              })
              router.back()
            } catch (error) {
              console.error('Error deleting affirmation:', error)
              Alert.alert('Error', 'Failed to delete affirmation')
            }
          },
        },
      ],
    )
  }

  if (!affirmation) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <StillCard
          affirmation={affirmation}
          size="lg"
          showEdit={false}
          showFavorite={false}
          style={styles.card}
        />

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={24} color={colors.text.primary} />
            <Text style={styles.statText}>{favoriteCount} favorites</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={24} color={colors.text.primary} />
            <Text style={styles.statText}>
              {affirmation.lastReviewed
                ? new Date(affirmation.lastReviewed).toLocaleDateString()
                : 'Never reviewed'}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/edit?affirmationId=${affirmation.id}`)}
          >
            <Ionicons
              name="create-outline"
              size={24}
              color={colors.text.primary}
            />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Ionicons
              name="trash-outline"
              size={24}
              color={colors.text.primary}
            />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charcoal[100],
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  statText: {
    color: colors.text.primary,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.charcoal[200],
    minWidth: 100,
  },
  deleteButton: {
    backgroundColor: colors.charcoal[300],
  },
  actionText: {
    color: colors.text.primary,
    marginTop: 4,
    fontSize: 14,
  },
  loadingText: {
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 32,
  },
})
