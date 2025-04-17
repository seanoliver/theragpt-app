import React from 'react'
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
  return (
    <View style={[styles.fabContainer, style]}>
      <View style={styles.fabButton}>
        {children}
      </View>
    </View>
  )
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
