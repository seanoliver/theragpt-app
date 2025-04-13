import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../lib/theme';
import { useState, useEffect } from 'react';
import { affirmationService } from '@still/logic/src/affirmation/service';
import { Affirmation } from '@still/logic/src/affirmation/types';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export function DailyAffirmationScreen() {
  const { affirmationId } = useLocalSearchParams<{ affirmationId: string }>();
  const [affirmation, setAffirmation] = useState<Affirmation | null>(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    loadAffirmation();
  }, [affirmationId]);

  const loadAffirmation = async () => {
    if (affirmationId) {
      const affirmations = await affirmationService.getAllAffirmations();
      const foundAffirmation = affirmations.find(a => a.id === affirmationId);
      if (foundAffirmation) {
        setAffirmation(foundAffirmation);
      }
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? -1 : 1;
        // TODO: Load next/previous affirmation
      }
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  if (!affirmation) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.affirmationContainer}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={styles.affirmationText}>{affirmation.text}</Text>

            <View style={styles.cardFooter}>
              <View style={styles.progressContainer}>
                <View style={[styles.progressDot, styles.activeDot]} />
              </View>

              <View style={styles.actions}>
                <Link href={`/edit?affirmationId=${affirmation.id}`} asChild>
                  <Ionicons name="create-outline" size={20} color={colors.text.primary} />
                </Link>
                <Link href="/library" asChild>
                  <Ionicons name="heart-outline" size={20} color={colors.text.primary} />
                </Link>
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charcoal[100],
    padding: 20,
  },
  affirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    padding: 20,
    backgroundColor: colors.charcoal[200],
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  affirmationText: {
    fontSize: 28,
    color: colors.text.primary,
    textAlign: 'left',
    fontWeight: '300',
    marginBottom: 20,
    letterSpacing: 0.5,
    lineHeight: 40,
    fontFamily: 'System',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.charcoal[300],
  },
  activeDot: {
    backgroundColor: colors.text.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  loadingText: {
    color: colors.text.primary,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 60,
  },
});