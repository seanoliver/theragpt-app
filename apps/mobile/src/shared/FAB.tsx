import React, { useEffect } from 'react'
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { useSegments } from 'expo-router'
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native'
import { useTheme } from '../../lib/theme/context'

const ACTIVE_TAB = 'index'
const ARCHIVE_TAB = 'archive'

interface FABProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  onPress?: () => void
  backgroundColor?: string
}

export const FAB: React.FC<FABProps> = ({ children, style, onPress, backgroundColor }) => {
  const { themeObject: theme } = useTheme()
  const segments = useSegments() as any[] // To fix annoying type error

  const currentTab: string =
    segments.length === 0 ? 'index' : String(segments[0])
  const prevTab = usePrevious(currentTab)
  const visible = useSharedValue(1)

  const isActiveOrArchive =
    currentTab === ACTIVE_TAB || currentTab === ARCHIVE_TAB

  useEffect(() => {
    if (
      (prevTab === ACTIVE_TAB || prevTab === ARCHIVE_TAB) &&
      isActiveOrArchive
    ) {
      visible.value = withTiming(1)
    } else if (isActiveOrArchive) {
      visible.value = withTiming(1)
    } else {
      visible.value = withTiming(0)
    }
  }, [currentTab, prevTab])

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = visible.value === 1 ? 0 : 40
    return {
      opacity: visible.value,
      transform: [{ translateY }],
    }
  })

  return (
    <Animated.View style={[styles.fabContainer, animatedStyle, style]}>
      <View style={[styles.fabButton, backgroundColor ? { backgroundColor } : null]}>
        <TouchableOpacity
          onPress={onPress}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          {children}
        </TouchableOpacity>
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
    // backgroundColor: theme.colors.accent,
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
