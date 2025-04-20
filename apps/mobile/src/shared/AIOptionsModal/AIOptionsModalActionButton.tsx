import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '@/apps/mobile/lib/theme'

interface AIOptionsModalActionButtonProps {
  onPress: () => void
  icon: keyof typeof MaterialIcons.glyphMap
  label: string
}

const AIOptionsModalActionButton: React.FC<AIOptionsModalActionButtonProps> = ({
  onPress,
  icon,
  label,
}) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <View style={styles.content}>
      <MaterialIcons
        name={icon}
        size={18}
        color={colors.text.primary}
        style={{ marginRight: 6 }}
      />
      <Text style={styles.text}>{label}</Text>
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.charcoal[300],
    borderRadius: 6,
    paddingVertical: 6,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 14,
  },
})

export default AIOptionsModalActionButton
