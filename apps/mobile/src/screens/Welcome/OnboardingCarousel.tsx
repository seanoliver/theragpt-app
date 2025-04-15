import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import { colors } from '../../../lib/theme'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')

const ONBOARDING_CARDS = [
  {
    title: '👋 Welcome to Still',
    text: 'This is your space to reconnect with who you are, one thought at a time.',
    image: null,
  },
  {
    title: 'What This Is',
    text: "Still is not just another affirmation app. It's a ritual—grounded in your values, intentions, and personal truth.",
    image: null,
  },
  {
    title: 'The Difference',
    text: 'Unlike short, generic mantras, the affirmations here are thoughtful, specific, and deeply personal—like a living personal manifesto.',
    image: null,
  },
  {
    title: 'Why It Matters',
    text: 'The words you repeat shape your focus. The more clearly they reflect you, the more powerfully they guide your day.',
    image: null,
  },
  {
    title: "What You'll Do",
    text: 'Write or refine affirmations over time\n\nSwipe through them each morning\n\nMark the ones that resonate most today',
    image: null,
  },
  {
    title: 'Need Help Writing?',
    text: 'You can start from scratch or use AI to help wordsmith your ideas into affirmations that feel real.',
    image: null,
  },
  {
    title: '✨ Ready?',
    text: "Let's build your personal manifesto. Start with a few affirmations that reflect what matters to you right now.",
    image: null,
    isFinal: true,
  },
]

export function OnboardingCarousel({ onCancel }: { onCancel?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  const handleSkip = () => {
    if (onCancel) onCancel()
    else router.replace('/')
  }

  const handleStart = () => {
    router.replace('/')
  }

  return (
    <View style={styles.container}>
      <Carousel
        width={width * 0.9}
        height={400}
        data={ONBOARDING_CARDS}
        scrollAnimationDuration={500}
        onSnapToItem={setCurrentIndex}
        style={{ alignSelf: 'center' }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image && (
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
              />
            )}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>
            {item.isFinal && (
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStart}
              >
                <Text style={styles.startButtonText}>
                  Start My Daily Practice →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      <View style={styles.dotsContainer}>
        {ONBOARDING_CARDS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charcoal[100],
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.charcoal[200],
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 340,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.text.primary,
    opacity: 1,
  },
  dotInactive: {
    backgroundColor: colors.text.primary,
    opacity: 0.2,
  },
  skipButton: {
    position: 'absolute',
    top: 48,
    right: 24,
    padding: 8,
  },
  skipButtonText: {
    color: colors.text.secondary,
    fontSize: 16,
    opacity: 0.7,
  },
  startButton: {
    marginTop: 24,
    backgroundColor: colors.text.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  startButtonText: {
    color: colors.charcoal[100],
    fontSize: 16,
    fontWeight: '700',
  },
})
