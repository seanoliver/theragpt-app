import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { colors } from '../../../../lib/theme'

interface ActionButtonProps {
  onPress: () => void
  children: React.ReactNode
  style?: ViewStyle | ViewStyle[]
  textStyle?: TextStyle | TextStyle[]
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onPress,
  children,
  style,
  textStyle,
}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={[styles.text, textStyle]}>{children}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: colors.charcoal[300],
    borderRadius: 8,
  },
  text: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 16,
  },
})

export default ActionButton
