import { Statement } from '@still/logic/src/statement/statementService'
import { useMemo, useState } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import Markdown from 'react-native-markdown-display'
import Animated from 'react-native-reanimated'
import { colors } from '../../../../lib/theme'
import { SwipeMenu } from './SwipeMenuWrapper'
import { EditableOnTap } from './TapEditorWrapper';

interface StatementLineItemProps {
  statement: Statement
  size?: 'sm' | 'lg'
  style?: ViewStyle
  animatedStyle?: any
  containerStyle?: ViewStyle
  editable?: boolean
  onSave?: (newText: string) => void
  onArchive: () => void
  onDelete: (id: string) => void
}

export const StatementLineItem = ({
  statement,
  size = 'sm',
  style,
  animatedStyle,
  containerStyle,
  editable = true,
  onSave,
  onArchive,
  onDelete,
}: StatementLineItemProps) => {
  const textSize = size === 'lg' ? 28 : 16
  const lineHeight = size === 'lg' ? 40 : 24

  const CardWrapper = animatedStyle ? Animated.View : View

  const [text, setText] = useState(statement.text)

  const handleSave = (newText: string) => {
    if (onSave && newText !== statement.text) {
      onSave(newText)
    }
  }

  const markdownPreview = useMemo(
    () => (
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
          body: {
            backgroundColor: colors.charcoal[100],
          },
        }}
      >
        {text}
      </Markdown>
    ),
    [statement.id, text, textSize, lineHeight],
  )

  return (
    <SwipeMenu onArchive={onArchive} onDelete={onDelete}>
      <CardWrapper style={[styles.container, containerStyle, animatedStyle]}>
        <View style={[styles.card, style]}>
          <View style={styles.contentContainer}>
            <EditableOnTap
              value={text}
              onChange={setText}
              onSave={handleSave}
              markdownPreview={markdownPreview}
            >
              {markdownPreview}
            </EditableOnTap>
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
