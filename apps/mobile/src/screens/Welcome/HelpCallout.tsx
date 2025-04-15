import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../lib/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HelpCalloutProps {
  onClose: () => void;
}

export function HelpCallout({ onClose }: HelpCalloutProps) {
  return (
    <View style={styles.helpContainer}>
      <View style={styles.helpHeader}>
        <Text style={styles.helpTitle}>Welcome to Still</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.helpText}>
        This is your personal manifesto - a collection of affirmations to
        guide your daily practice. View active ones in Manifesto, review
        them daily, and store others in Backlog.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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