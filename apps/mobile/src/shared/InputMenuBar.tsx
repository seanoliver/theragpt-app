import {
  InputAccessoryView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from 'react-native'
import theme from '../../lib/theme'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

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
      <View style={styles.accessoryContainer}>
        <View style={styles.leftButtonsContainer}>
          <LinearGradient
            colors={['#4F5BD5', '#8f5cff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.aiButtonGradient}
          >
            <TouchableOpacity
              style={styles.aiActionButton}
              onPress={handleAIEnhance}
            >
              <Ionicons
                name="sparkles-outline"
                size={18}
                color={theme.colors.textOnBackground}
                style={{
                  textShadowColor: '#8f5cff',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 4,
                }}
              />
              <Text style={styles.aiActionButtonText}>Enhance</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => inputRef.current?.blur()}
        >
          <Text style={styles.doneButtonText}>Done</Text>
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
  aiButtonGradient: {
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    padding: 2,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  aiActionButton: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#232946B3', // theme.colors.background with 70% opacity
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
