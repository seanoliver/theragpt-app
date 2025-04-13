import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../lib/theme';
import { useState } from 'react';
import { SAMPLE_AFFIRMATIONS } from './Library';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? -1 : 1;
        const newIndex = currentIndex + direction;

        if (newIndex >= 0 && newIndex < SAMPLE_AFFIRMATIONS.length) {
          runOnJS(setCurrentIndex)(newIndex);
        }
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

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.affirmationContainer}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={styles.affirmationText}>
              {SAMPLE_AFFIRMATIONS[currentIndex]}
            </Text>

            <View style={styles.cardFooter}>
              <View style={styles.progressContainer}>
                {SAMPLE_AFFIRMATIONS.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.progressDot,
                      index === currentIndex && styles.activeDot,
                    ]}
                  />
                ))}
              </View>

              <View style={styles.actions}>
                <Link href="/edit" asChild>
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
});