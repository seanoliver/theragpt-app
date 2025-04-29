import { Ionicons } from '@expo/vector-icons'
import React, { useEffect } from 'react'
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { useTheme } from '../../../../lib/theme/context'
import { Theme } from '../../../../lib/theme/theme'
import { useFABContext } from './FABContext'

interface FABProps {
  style?: StyleProp<ViewStyle>
  onPress?: () => void
  backgroundColor?: string
}

export const FAB = ({ style, onPress = () => {}, backgroundColor }: FABProps) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)
  const { editingCard } = useFABContext()

  if (editingCard) return null

  return (
    <View style={[styles.fabContainer, style]}>
      <TouchableOpacity
        onPress={onPress}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Ionicons name="add" size={24} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  )
}

function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    fabContainer: {
      position: 'absolute',
      right: 24,
      bottom: 32,
      zIndex: 100,
      backgroundColor: theme.colors.accent,
      width: 48,
      height: 48,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fabButton: {
      backgroundColor: theme.colors.accent,
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
