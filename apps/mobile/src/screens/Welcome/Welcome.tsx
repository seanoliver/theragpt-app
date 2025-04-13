import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { BeginButton } from './BeginButton';
import { colors } from '../../../lib/theme';
import { useEffect, useState } from 'react';
import { Affirmation } from '@still/logic/src/affirmation/types';
import { affirmationService } from '@still/logic/src/affirmation/service';
import { Ionicons } from '@expo/vector-icons';

export function WelcomeScreen() {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    loadAffirmations();
  }, []);

  const loadAffirmations = async () => {
    const activeAffirmations = await affirmationService.getActiveAffirmations();
    setAffirmations(activeAffirmations);
  };

  const handleAffirmationPress = (affirmation: Affirmation) => {
    router.push(`/daily?affirmationId=${affirmation.id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Still</Text>
      </View>

      {showHelp && (
        <View style={styles.helpContainer}>
          <View style={styles.helpHeader}>
            <Text style={styles.helpTitle}>Welcome to Still</Text>
            <TouchableOpacity onPress={() => setShowHelp(false)}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.helpText}>
            This is your personal manifesto, a collection of affirmations that guide your daily practice.
            {'\n\n'}
            • The Manifesto page shows your active affirmations
            • The Review page is where you go through them daily
            • The Backlog page stores affirmations you're working on
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.subtitle}>Your Manifesto</Text>
        <ScrollView style={styles.affirmationsList}>
          {affirmations.map((affirmation, index) => (
            <TouchableOpacity
              key={affirmation.id}
              style={styles.affirmationCard}
              onPress={() => handleAffirmationPress(affirmation)}
            >
              <Text style={styles.affirmationNumber}>{index + 1}.</Text>
              <Text style={styles.affirmationText}>{affirmation.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <BeginButton />
      </View>
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
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    fontSize: 32,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    gap: 20,
  },
  subtitle: {
    fontSize: 24,
    color: colors.text.primary,
    fontWeight: '600',
  },
  affirmationsList: {
    flex: 1,
  },
  affirmationCard: {
    backgroundColor: colors.charcoal[200],
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  affirmationNumber: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    minWidth: 25,
  },
  affirmationText: {
    color: colors.text.primary,
    fontSize: 16,
    flex: 1,
  },
  helpContainer: {
    backgroundColor: colors.charcoal[200],
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  helpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  helpTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  helpText: {
    color: colors.text.primary,
    fontSize: 16,
    lineHeight: 24,
  },
});