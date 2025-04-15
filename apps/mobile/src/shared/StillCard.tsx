import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../lib/theme';
import { Affirmation } from '@still/logic/src/affirmation/types';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';

interface StillCardProps {
  affirmation: Affirmation;
  index?: number;
  size?: 'sm' | 'lg';
  showEdit?: boolean;
  showFavorite?: boolean;
  style?: ViewStyle;
  animatedStyle?: any;
  containerStyle?: ViewStyle;
}

export function StillCard({
  affirmation,
  index,
  size = 'sm',
  showEdit = true,
  showFavorite = true,
  style,
  animatedStyle,
  containerStyle
}: StillCardProps) {
  const router = useRouter();
  const textSize = size === 'lg' ? 28 : 16;
  const lineHeight = size === 'lg' ? 40 : 24;

  const CardWrapper = animatedStyle ? Animated.View : View;

  return (
    <CardWrapper style={[styles.container, containerStyle, animatedStyle]}>
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={() => router.push(`/still?affirmationId=${affirmation.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.contentContainer}>
          {index !== undefined && (
            <Text style={styles.number}>{index + 1}.</Text>
          )}
          <Text style={[styles.text, { fontSize: textSize, lineHeight }]}>
            {affirmation.text}
          </Text>
        </View>

        {(showEdit || showFavorite) && (
          <View style={styles.cardFooter}>
            <View style={styles.actions}>
              {showEdit && (
                <Link href={`/edit?affirmationId=${affirmation.id}`} asChild>
                  <Ionicons name="create-outline" size={20} color={colors.text.primary} />
                </Link>
              )}
              {showFavorite && (
                <Link href="/library" asChild>
                  <Ionicons name="heart-outline" size={20} color={colors.text.primary} />
                </Link>
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  card: {
    backgroundColor: colors.charcoal[200],
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
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
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    flex: 1,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
});