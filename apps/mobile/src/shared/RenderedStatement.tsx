import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { colors, tokens } from '../../lib/theme'
import { Affirmation } from '@still/logic/src/affirmation/types'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import Animated from 'react-native-reanimated'
import Markdown from 'react-native-markdown-display'

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

  return (
    <CardWrapper style={[styles.container, containerStyle, animatedStyle]}>
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={() => router.push(`/still?statementId=${statement.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.contentContainer}>
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
            {statement.text}
          </Markdown>
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
