import { Affirmation } from '@still/logic/src/affirmation/types'
import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import Markdown from 'react-native-markdown-display'
import Animated from 'react-native-reanimated'
import { colors } from '../../lib/theme'

interface RenderedStatementProps {
  statement: Affirmation
  size?: 'sm' | 'lg'
  style?: ViewStyle
  animatedStyle?: any
  containerStyle?: ViewStyle
}

export function RenderedStatement({
  statement,
  size = 'sm',
  style,
  animatedStyle,
  containerStyle,
}: RenderedStatementProps) {
  const router = useRouter()
  const textSize = size === 'lg' ? 28 : 16
  const lineHeight = size === 'lg' ? 40 : 24

  const CardWrapper = animatedStyle ? Animated.View : View

  // Editable state
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(statement.text)
  const inputRef = useRef<any>(null)

  // Focus input when entering edit mode
  const handleTextPress = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus?.()
    }, 100)
  }

  const handleBlur = () => {
    setIsEditing(false)
    // Optionally: trigger save here
  }

  return (
    <CardWrapper style={[styles.container, containerStyle, animatedStyle]}>
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={() => {
          if (!isEditing) handleTextPress()
        }}
        activeOpacity={0.7}
        disabled={isEditing}
      >
        <View style={styles.contentContainer}>
          {isEditing ? (
            <View style={{ flex: 1 }}>
              <TextInput
                ref={inputRef}
                value={text}
                onChangeText={setText}
                multiline
                style={{
                  ...styles.text,
                  fontSize: textSize,
                  lineHeight,
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  padding: 0,
                  margin: 0,
                  minHeight: lineHeight + 8,
                }}
                selectionColor={colors.text.primary}
                autoFocus
                onBlur={handleBlur}
                blurOnSubmit
                returnKeyType="done"
                placeholder="Edit statement..."
                placeholderTextColor="#888"
              />
              {/* Live markdown preview below the input */}
              <Markdown
                style={{
                  text: {
                    ...styles.text,
                    fontSize: textSize,
                    lineHeight,
                    opacity: 0.7,
                  },
                  bullet_list: { marginLeft: 0 },
                  bullet_list_icon: {
                    marginLeft: 0,
                    marginRight: 8,
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: colors.text.primary,
                    marginTop: 10,
                  },
                  ordered_list: { marginLeft: 0 },
                  list_item: {
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: 10,
                  },
                }}
              >
                {text}
              </Markdown>
            </View>
          ) : (
            <Markdown
              key={statement.id}
              style={{
                text: {
                  ...styles.text,
                  fontSize: textSize,
                  lineHeight,
                },
                bullet_list: { marginLeft: 0 },
                bullet_list_icon: {
                  marginLeft: 0,
                  marginRight: 8,
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.text.primary,
                  marginTop: 10,
                },
                ordered_list: { marginLeft: 0 },
                list_item: {
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginBottom: 10,
                },
              }}
            >
              {text}
            </Markdown>
          )}
        </View>
      </TouchableOpacity>
    </CardWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // Remove card-like margin
    marginBottom: 0,
  },
  card: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderRadius: 0,
    marginBottom: 0,
    shadowColor: 'transparent',
    borderWidth: 0,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 8,
  },
  text: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'left',
  },
})
