import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { colors } from '../../lib/theme'
import { useStatementService } from '../hooks/useStatementService'

export function LibraryScreen() {
  const { service, statements } = useStatementService()

  if (!service || !statements) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Library</Text>

      <ScrollView style={styles.scrollView}>
        {statements.map(statement => (
          <View key={statement.id} style={styles.statementCard}>
            <Text style={styles.statementText}>{statement.text}</Text>
            <View style={styles.statementFooter}>
              <Text style={styles.statementStatus}>
                {statement.isActive ? 'Active' : 'Inactive'}
              </Text>
              {statement.isFavorite && (
                <Ionicons name="heart" size={16} color={colors.text.primary} />
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <Link href="/new" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charcoal[100],
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: colors.text.primary,
    marginTop: 60,
    marginBottom: 20,
    fontFamily: require('../../lib/theme').tokens.fontFamilies.headerSerif,
  },
  scrollView: {
    flex: 1,
  },
  statementCard: {
    backgroundColor: colors.charcoal[200],
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  statementText: {
    color: colors.text.primary,
    fontSize: 16,
    marginBottom: 10,
    fontFamily: require('../../lib/theme').tokens.fontFamilies.bodySans,
  },
  statementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statementStatus: {
    color: colors.text.primary,
    fontSize: 14,
    opacity: 0.7,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: colors.charcoal[200],
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
