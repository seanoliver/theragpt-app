import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { useTheme } from '../../../../lib/theme/context'
import { Theme } from '../../../../lib/theme/theme'

interface FABProps {
  style?: StyleProp<ViewStyle>
  onPress?: () => void
}

export const FAB = ({
  style,
  onPress = () => {},
}: FABProps) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  return (
    <View style={[styles.fabContainer, style]}>
      <TouchableOpacity
        onPress={onPress}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Ionicons name="add" size={24} color={theme.colors.primaryBackground} />
      </TouchableOpacity>
    </View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    fabContainer: {
      position: 'absolute',
      right: 24,
      bottom: 32,
      zIndex: 100,
      backgroundColor: theme.colors.textOnPrimary,
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
