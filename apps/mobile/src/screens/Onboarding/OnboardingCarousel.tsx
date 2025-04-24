import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view'
import { ONBOARDING_CARDS } from './constants'

const { width } = Dimensions.get('window')

export function OnboardingCarousel({ onCancel }: { onCancel?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  const handleSkip = async () => {
    if (onCancel) onCancel()
    else router.replace('/')
  }

  const handleStart = () => {
    router.replace('/')
  }

  return (
    <View style={styles.container}>
      <PagerView
        style={{ width: width * 0.9, height: 400, alignSelf: 'center' }}
        initialPage={0}
        onPageSelected={(e: PagerViewOnPageSelectedEvent) =>
          setCurrentIndex(e.nativeEvent.position)
        }
      >
        {ONBOARDING_CARDS.map((item, idx) => (
          <View key={idx} style={styles.card}>
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
        ))}
      </PagerView>
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
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 28,
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 340,
    width: '100%',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    // color: theme.colors.textOnBackground,
    marginBottom: 16,
    textAlign: 'left',
    // fontFamily: theme.fontFamilies.headerSerif,
  },
  text: {
    fontSize: 16,
    // color: theme.colors.textOnBackground,
    textAlign: 'left',
    marginBottom: 16,
    fontWeight: '400',
    lineHeight: 24,
    // fontFamily: theme.fontFamilies.bodySans,
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
    // backgroundColor: theme.colors.textOnBackground,
    opacity: 1,
  },
  dotInactive: {
    // backgroundColor: theme.colors.textOnBackground,
    opacity: 0.2,
  },
  skipButton: {
    position: 'absolute',
    top: 48,
    right: 24,
    padding: 8,
  },
  skipButtonText: {
    // color: theme.colors.textOnBackground,
    fontSize: 16,
    opacity: 0.7,
  },
  startButton: {
    marginTop: 24,
    // backgroundColor: theme.colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  startButtonText: {
    // color: theme.colors.textOnBackground,
    fontSize: 16,
    fontWeight: '700',
  },
})
