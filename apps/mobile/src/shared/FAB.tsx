import React, { useEffect } from 'react'
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated'
import { useSegments } from 'expo-router'
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native'
import { colors } from '../../lib/theme'

interface FABProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export const FAB: React.FC<FABProps> = ({ children, style }) => {
  const segments = useSegments()
  const currentTab = segments[0]
  const prevTab = usePrevious(currentTab)
  const MANIFESTO_TAB = 'index'
  const ARCHIVE_TAB = 'archive'
  const visible = useSharedValue(1)

  useEffect(() => {
    if (
      (prevTab === MANIFESTO_TAB || prevTab === ARCHIVE_TAB) &&
      (currentTab === MANIFESTO_TAB || currentTab === ARCHIVE_TAB)
    ) {
      visible.value = withTiming(1)
    } else if (currentTab === MANIFESTO_TAB || currentTab === ARCHIVE_TAB) {
      visible.value = withTiming(1)
    } else {
      visible.value = withTiming(0)
    }
  }, [currentTab, prevTab])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: visible.value,
    transform: [
      {
        translateY: visible.value ? withTiming(0) : withTiming(40),
      },
    ],
  }))

  return (
    <Animated.View style={[styles.fabContainer, animatedStyle, style]}>
      <View style={styles.fabButton}>
        {children}
      </View>
    </Animated.View>
  )
}

function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    zIndex: 10,
  },
  fabButton: {
    backgroundColor: colors.text.primary,
    width: 48,
    height: 48,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})
