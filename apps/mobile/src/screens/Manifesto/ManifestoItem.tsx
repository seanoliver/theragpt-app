import { Statement } from '@still/logic/src/statement/statementService'
import { useMemo, useState } from 'react'
import { StyleSheet, View, ViewStyle, Text } from 'react-native'
import Animated from 'react-native-reanimated'
import theme from '../../../lib/theme'
import { SwipeMenu } from '../../shared/SwipeMenu'
import { ManifestoItemEditorWrapper } from './ManifestoItemEditorWrapper'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { MANIFESTO_ITEM_TEXT_SIZE } from './constants'
import { MANIFESTO_ITEM_LINE_HEIGHT } from './constants'

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
        }}
      >
        {text}
      </Text>
    ),
    [statement.id, text],
  )

  return (
    <SwipeMenu
      actions={[
        {
          label: 'Archive',
          icon: (
            <FontAwesome
              name="archive"
              size={20}
              color={theme.colors.textOnBackground}
            />
          ),
          backgroundColor: theme.colors.accent,
          textColor: theme.colors.textOnBackground,
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
    backgroundColor: 'transparent',
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
    color: theme.colors.textOnBackground,
    flex: 1,
    fontSize: MANIFESTO_ITEM_TEXT_SIZE,
    lineHeight: MANIFESTO_ITEM_LINE_HEIGHT,
    textAlign: 'left',
  },
})
