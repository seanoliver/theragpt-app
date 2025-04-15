import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { colors } from '../../lib/theme'
import { useState, useEffect } from 'react'
import { affirmationService } from '@still/logic/src/affirmation/service'
import { Affirmation } from '@still/logic/src/affirmation/types'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import { StillCard } from '../shared/StillCard'

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25

export function ReviewScreen() {
  const [statements, setStatements] = useState<Affirmation[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  useEffect(() => {
    loadStatements()
  }, [])

  const loadStatements = async () => {
    const allStatements = await affirmationService.getAllAffirmations()
    setStatements(allStatements)
  }

  const handleSwipe = (direction: number) => {
    const newIndex = currentIndex + direction
    if (newIndex >= 0 && newIndex < statements.length) {
      setCurrentIndex(newIndex)
    }
  }

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = event.translationX
      translateY.value = event.translationY
    })
    .onEnd(event => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? -1 : 1
        runOnJS(handleSwipe)(direction)
      }
      translateX.value = withSpring(0)
      translateY.value = withSpring(0)
    })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    }
  })

  if (statements.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.statementContainer}>
        <GestureDetector gesture={panGesture}>
          <StillCard
            statement={statements[currentIndex]}
            size="lg"
            showEdit={true}
            showFavorite={true}
            containerStyle={styles.cardContainer}
            animatedStyle={animatedStyle}
          />
        </GestureDetector>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentIndex + 1) / statements.length) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {statements.length}
          </Text>
        </View>
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charcoal[100],
    padding: 20,
  },
  statementContainer: {
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
  progressContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: '90%',
    height: 4,
    backgroundColor: colors.charcoal[300],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.text.primary,
    borderRadius: 2,
  },
  progressText: {
    color: colors.text.primary,
    fontSize: 16,
    opacity: 0.7,
  },
})
