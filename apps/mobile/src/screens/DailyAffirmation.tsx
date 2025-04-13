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
import { StillCard } from '../shared/StillCard';

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
          <StillCard
            affirmation={affirmation}
            size="lg"
            showEdit={true}
            showFavorite={true}
            showProgress={true}
            containerStyle={styles.cardContainer}
            animatedStyle={animatedStyle}
          />
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
    width: '100%',
  },
  cardContainer: {
    width: '90%',
  },
  loadingText: {
    color: colors.text.primary,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 60,
  },
});