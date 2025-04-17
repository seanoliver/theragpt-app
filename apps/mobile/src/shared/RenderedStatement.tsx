import { Statement } from '@still/logic/src/statement/types'
import { useState } from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import Markdown from 'react-native-markdown-display'
import Animated from 'react-native-reanimated'
import { colors } from '../../lib/theme'
import { EditableOnTap } from './EditableOnTap'

interface RenderedStatementProps {
  statement: Statement
  size?: 'sm' | 'lg'
  style?: ViewStyle
  animatedStyle?: any
  containerStyle?: ViewStyle
  editable?: boolean
  onSave?: (newText: string) => void
  onArchive?: () => void
  onDelete?: () => void
}

export function RenderedStatement({
  statement,
  size = 'sm',
  style,
  animatedStyle,
  containerStyle,
  editable = true,
  onSave,
  onArchive,
  onDelete,
}: RenderedStatementProps) {
  const textSize = size === 'lg' ? 28 : 16
  const lineHeight = size === 'lg' ? 40 : 24

  const CardWrapper = animatedStyle ? Animated.View : View

  const [text, setText] = useState(statement.text)

  const handleSave = (newText: string) => {
    if (onSave && newText !== statement.text) {
      onSave(newText)
    }
  }

  const renderRightActions = () => (
    <View style={{ flexDirection: 'row', height: '100%' }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', height: '100%' }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <View
              style={{
                backgroundColor: colors.charcoal[300],
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                width: 80,
              }}
            >
              <Text
                style={{
                  color: colors.text.primary,
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
                onPress={onArchive}
              >
                Archive
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <View
              style={{
                backgroundColor: '#E57373',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                width: 80,
              }}
            >
              <Text
                style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}
                onPress={onDelete}
              >
                Delete
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )

  if (!editable) {
    return (
      <Swipeable renderRightActions={renderRightActions}>
        <CardWrapper style={[styles.container, containerStyle, animatedStyle]}>
          <View style={[styles.card, style]}>
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
                {text}
              </Markdown>
            </View>
          </View>
        </CardWrapper>
      </Swipeable>
    )
  }

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <CardWrapper style={[styles.container, containerStyle, animatedStyle]}>
        <View style={[styles.card, style]}>
          <View style={styles.contentContainer}>
            <EditableOnTap
              value={text}
              onChange={setText}
              onSave={handleSave}
              inputStyle={{
                ...styles.text,
                fontSize: textSize,
                lineHeight,
                backgroundColor: 'transparent',
                borderWidth: 0,
                padding: 0,
                margin: 0,
                minHeight: lineHeight + 8,
              }}
              inputProps={{
                selectionColor: colors.text.primary,
                returnKeyType: 'done',
                placeholder: 'Edit statement...',
                placeholderTextColor: '#888',
              }}
              containerStyle={{ flex: 1 }}
              markdownPreview={
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
              }
            >
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
            </EditableOnTap>
          </View>
        </View>
      </CardWrapper>
    </Swipeable>
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
