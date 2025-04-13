import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../lib/theme';

export function DailyAffirmationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Start Daily Affirmations</Text>

      <View style={styles.affirmationContainer}>
        <Text style={styles.affirmationText}>
          I am worthy of love and respect
        </Text>
      </View>

      <View style={styles.actions}>
        <Link href="/edit" asChild>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/library" asChild>
          <TouchableOpacity style={styles.likeButton}>
            <Ionicons name="heart-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charcoal[100],
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 60,
  },
  affirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  affirmationText: {
    fontSize: 32,
    color: colors.text.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'column',
    gap: 20,
    marginBottom: 40,
  },
  editButton: {
    backgroundColor: colors.charcoal[200],
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  likeButton: {
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text.primary,
    fontSize: 16,
  },
});