import { Ionicons } from '@expo/vector-icons';
import { Statement } from '@still/logic/src/statement/statementService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../lib/theme.context';
import { useStatementService } from '../../hooks/useStatementService';
import { StatementCard } from '../../shared/StatementCard';

export default function StatementView() {
  const router = useRouter()
  const { statementId } = useLocalSearchParams<{ statementId: string }>()
  const [statement, setStatement] = useState<Statement | null>(null)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const { service, statements } = useStatementService()
  const { themeObject: theme } = useTheme()

  useEffect(() => {
    if (!statementId || !statements) return
    const foundStatement = statements.find(
      a => a.id === statementId)
    if (foundStatement) {
      setStatement(foundStatement)

      const favorites = statements.filter(
        a => a.text === foundStatement.text && a.isFavorite,
      )
      setFavoriteCount(favorites.length)
    }
  }, [statementId, statements])

  const handleDelete = async () => {
    if (!statement || !service) return

    Alert.alert(
      'Delete Statement',
      'Are you sure you want to delete this statement? This action cannot be undone.',
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

  const handleSaveStatement = async (newText: string) => {
    if (service && statement && newText !== statement.text) {
      await service.update({ id: statement.id, text: newText })
    }
  }

  if (!service || !statements) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }
  if (!statementId || !statement) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <Text style={styles.loadingText}>
          No statement ID provided in the route.
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.content}>
        <View style={[styles.stillCardContainer, styles.card]}>
          <StatementCard statement={statement} />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons
              name="heart"
              size={24}
              color={theme.colors.textOnBackground}
            />
            <Text style={styles.statText}>{favoriteCount} favorites</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="calendar"
              size={24}
              color={theme.colors.textOnBackground}
            />
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
              color={theme.colors.textOnBackground}
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
              color={theme.colors.textOnBackground}
            />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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
    // color: theme.colors.textOnBackground,
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
    // backgroundColor: theme.colors.hoverBackground,
    minWidth: 100,
  },
  deleteButton: {
    // backgroundColor: theme.colors.accent,
  },
  actionText: {
    // color: theme.colors.textOnBackground,
    marginTop: 4,
    fontSize: 14,
  },
  loadingText: {
    // color: theme.colors.textOnBackground,
    textAlign: 'center',
    marginTop: 32,
  },
  stillCardContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderRadius: 0,
    marginBottom: 0,
    shadowColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 1,
    // borderBottomColor: theme.colors.border,
    width: '100%',
  },
})
