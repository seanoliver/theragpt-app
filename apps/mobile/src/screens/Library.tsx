import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../lib/theme';

const SAMPLE_AFFIRMATIONS = [
  'I am finding meaning and purpose in my work',
  'Setbacks are a chance to learn and grow',
  'I have the power to create change in my life',
  'I am capable of achieving my goals',
  'I accept myself unconditionally',
];

export function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Library</Text>

      <ScrollView style={styles.scrollView}>
        {SAMPLE_AFFIRMATIONS.map((affirmation, index) => (
          <View key={index} style={styles.affirmationCard}>
            <Text style={styles.affirmationText}>{affirmation}</Text>
          </View>
        ))}
      </ScrollView>

      <Link href="/new" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </Link>
    </View>
  );
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
});