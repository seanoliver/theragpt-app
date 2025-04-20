import {
  InputAccessoryView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from 'react-native'
import { colors } from '../../lib/theme'
import { Ionicons } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
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
  const handleFormat = (type: 'bold' | 'italic' | 'highlight') => {
    const input = inputRef.current
    if (!input) return
    input.focus()
    if (type === 'bold') {
      input.setNativeProps({ text: (input.props.value || '') + '**bold**' })
    } else if (type === 'italic') {
      input.setNativeProps({ text: (input.props.value || '') + '*italic*' })
    } else if (type === 'highlight') {
      input.setNativeProps({
        text: (input.props.value || '') + '==highlight==',
      })
    }
  }

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
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleFormat('bold')}
          >
            <FontAwesome name="bold" size={16} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleFormat('italic')}
          >
            <FontAwesome name="italic" size={16} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleFormat('highlight')}
          >
            <MaterialCommunityIcons
              name="format-color-highlight"
              size={16}
              color={colors.text.primary}
            />
          </TouchableOpacity>
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
                color={colors.text.primary}
                style={{
                  textShadowColor: '#8f5cff',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 4,
                }}
              />
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
    backgroundColor: colors.charcoal[200],
    padding: 8,
    borderTopWidth: 1,
    borderColor: colors.charcoal[300],
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    backgroundColor: colors.charcoal[100],
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  actionButtonText: {
    color: colors.text.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  doneButton: {
    backgroundColor: colors.charcoal[100],
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  aiButtonGradient: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    shadowColor: '#8f5cff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  aiActionButton: {
    width: 34,
    height: 34,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30,30,40,0.7)',
  },
})
