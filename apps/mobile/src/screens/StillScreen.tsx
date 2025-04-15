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
  const { statementId } = useLocalSearchParams<{ statementId: string }>()
  const [statement, setStatement] = useState<Affirmation | null>(null)
  const [favoriteCount, setFavoriteCount] = useState(0)

  useEffect(() => {
    loadStatement()
  }, [statementId])

  const loadStatement = async () => {
    if (!statementId) return

    try {
      const affirmations = await affirmationService.getAllAffirmations()
      const foundStatement = affirmations.find(a => a.id === statementId)
      if (foundStatement) {
        setStatement(foundStatement)
        // Count how many times this statement has been favorited
        const favorites = affirmations.filter(
          a => a.text === foundStatement.text && a.isFavorite,
        )
        setFavoriteCount(favorites.length)
      }
    } catch (error) {
      console.error('Error loading statement:', error)
    }
  }

  const handleDelete = async () => {
    if (!statement) return

    Alert.alert(
      'Delete Statement',
      'Are you sure you want to delete this statement?',
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
                id: statement.id,
                isActive: false,
              })
              router.back()
            } catch (error) {
              console.error('Error deleting statement:', error)
              Alert.alert('Error', 'Failed to delete statement')
            }
          },
        },
      ],
    )
  }

  if (!statement) {
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
          statement={statement}
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
              {statement.lastReviewed
                ? new Date(statement.lastReviewed).toLocaleDateString()
                : 'Never reviewed'}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/edit?statementId=${statement.id}`)}
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
