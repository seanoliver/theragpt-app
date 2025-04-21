import {
  InputAccessoryView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from 'react-native'
import theme, { getThemeByName } from '../../lib/theme'
import { Ionicons } from '@expo/vector-icons'

const sunsetTheme = getThemeByName('sunset')

export const InputMenuBar = ({
  inputRef,
  inputAccessoryViewID,
  onAIEnhance,
}: {
  inputRef: React.RefObject<TextInput>
  inputAccessoryViewID: string
  onAIEnhance?: () => void
}) => {
  const handleAIEnhance = () => {
    if (onAIEnhance) {
      onAIEnhance()
      return
    }
    const input = inputRef.current
    if (!input) return
    input.focus()
    input.setNativeProps({ text: (input.props.value || '') + ' ✨' })
  }

  return (
    <InputAccessoryView nativeID={inputAccessoryViewID}>
      <View style={[styles.accessoryContainer, { backgroundColor: sunsetTheme.colors.hoverBackground, borderColor: sunsetTheme.colors.border }]}>
        <View style={styles.leftButtonsContainer}>
          <TouchableOpacity
            style={[styles.aiActionButton, { backgroundColor: sunsetTheme.colors.accent }]}
            onPress={handleAIEnhance}
          >
            <Ionicons
              name="sparkles-outline"
              size={18}
              color={sunsetTheme.colors.textOnPrimary}
            />
            <Text style={[styles.aiActionButtonText, { color: sunsetTheme.colors.textOnPrimary }]}>Enhance</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: sunsetTheme.colors.background }]}
          onPress={() => inputRef.current?.blur()}
        >
          <Text style={[styles.doneButtonText, { color: sunsetTheme.colors.textOnBackground }]}>Done</Text>
        </TouchableOpacity>
      </View>
    </InputAccessoryView>
  )
}

const styles = StyleSheet.create({
  accessoryContainer: {
    backgroundColor: theme.colors.hoverBackground,
    padding: 8,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  doneButton: {
    backgroundColor: theme.colors.background,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: theme.colors.textOnBackground,
    fontWeight: '600',
    fontSize: 16,
  },
  aiActionButton: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
  },
  aiActionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textOnBackground,
  },
})
