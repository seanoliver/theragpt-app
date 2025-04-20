import { Statement } from '@still/logic/src/statement/statementService'
import { useMemo, useState } from 'react'
import { StyleSheet, View, ViewStyle, Text } from 'react-native'
import Animated from 'react-native-reanimated'
import { colors } from '../../../lib/theme'
import { SwipeMenu } from '../../shared/SwipeMenu'
import { ManifestoItemEditorWrapper } from './ManifestoItemEditorWrapper';
import { FontAwesome, Ionicons } from '@expo/vector-icons'

interface ManifestoItemProps {
  statement: Statement
  size?: 'sm' | 'lg'
  style?: ViewStyle
  animatedStyle?: any
  containerStyle?: ViewStyle
  editable?: boolean
  onSave?: (newText: string) => void
  onArchive: () => void
  onDelete: (id: string) => void
  autoFocus?: boolean
}

export const ManifestoItem = ({
  statement,
  size = 'sm',
  style,
  animatedStyle,
  containerStyle,
  onSave,
  onArchive,
  onDelete,
  autoFocus,
}: ManifestoItemProps) => {
  const textSize = size === 'lg' ? 28 : 16
  const lineHeight = size === 'lg' ? 40 : 24

  const CardWrapper = animatedStyle ? Animated.View : View

  const [text, setText] = useState(statement.text)

  const handleSave = (newText: string) => {
    if (onSave && newText !== statement.text) {
      onSave(newText)
    }
  }

  const previewText = useMemo(
    () => (
      <Text
        key={statement.id}
        style={{
          ...styles.text,
          fontSize: textSize,
          lineHeight,
        }}
      >
        {text}
      </Text>
    ),
    [statement.id, text, textSize, lineHeight],
  )

  return (
    <SwipeMenu
      actions={[
        {
          label: 'Archive',
          icon: <FontAwesome name="archive" size={20} color={colors.text.primary} />,
          backgroundColor: colors.charcoal[300],
          textColor: colors.text.primary,
          onPress: onArchive,
        },
        {
          label: 'Delete',
          icon: <Ionicons name="trash" size={20} color="#fff" />,
          backgroundColor: '#E57373',
          textColor: '#fff',
          onPress: () => onDelete(statement.id),
        },
      ]}
    >
      <CardWrapper style={[styles.container, containerStyle, animatedStyle]}>
        <View style={[styles.card, style]}>
          <View style={styles.contentContainer}>
            <ManifestoItemEditorWrapper
              value={text}
              onChange={setText}
              onSave={handleSave}
              autoFocus={autoFocus}
            >
              {previewText}
            </ManifestoItemEditorWrapper>
          </View>
        </View>
      </CardWrapper>
    </SwipeMenu>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // Remove card-like margin
    marginBottom: 0,
    backgroundColor: colors.charcoal[100],
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
