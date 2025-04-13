import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../lib/theme';
import { Affirmation } from '@still/logic/src/affirmation/types';

interface StillCardProps {
  affirmation: Affirmation;
  index: number;
  onPress?: (affirmation: Affirmation) => void;
}

export function StillCard({ affirmation, index, onPress }: StillCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(affirmation)}
      activeOpacity={0.7}
    >
      <Text style={styles.number}>{index + 1}.</Text>
      <Text style={styles.text}>{affirmation.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.charcoal[200],
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.charcoal[300],
  },
  number: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 12,
    minWidth: 28,
    opacity: 0.8,
  },
  text: {
    color: colors.text.primary,
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
});