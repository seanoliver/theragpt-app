import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../lib/theme'
import { useEffect, useState } from 'react'
import { affirmationService } from '@still/logic/src/affirmation/service'
import { Affirmation } from '@still/logic/src/affirmation/types'

export function LibraryScreen() {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([])

  useEffect(() => {
    loadAffirmations()
  }, [])

  const loadAffirmations = async () => {
    const allAffirmations = await affirmationService.getAllAffirmations()
    setAffirmations(allAffirmations)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Library</Text>

      <ScrollView style={styles.scrollView}>
        {affirmations.map(affirmation => (
          <View key={affirmation.id} style={styles.affirmationCard}>
            <Text style={styles.affirmationText}>{affirmation.text}</Text>
            <View style={styles.affirmationFooter}>
              <Text style={styles.affirmationStatus}>
                {affirmation.isActive ? 'Active' : 'Inactive'}
              </Text>
              {affirmation.isFavorite && (
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
  affirmationCard: {
    backgroundColor: colors.charcoal[200],
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  affirmationText: {
    color: colors.text.primary,
    fontSize: 16,
    marginBottom: 10,
    fontFamily: require('../../lib/theme').tokens.fontFamilies.bodySans,
  },
  affirmationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  affirmationStatus: {
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
