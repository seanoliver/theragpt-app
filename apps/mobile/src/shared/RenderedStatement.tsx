import { Statement } from '@still/logic/src/statement/types';
import { useState } from 'react';
import {
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated from 'react-native-reanimated';
import { colors } from '../../lib/theme';
import { EditableOnTap } from './EditableOnTap';

interface RenderedStatementProps {
  statement: Statement
  size?: 'sm' | 'lg'
  style?: ViewStyle
  animatedStyle?: any
  containerStyle?: ViewStyle
  editable?: boolean
}

export function RenderedStatement({
  statement,
  size = 'sm',
  style,
  animatedStyle,
  containerStyle,
  editable = true,
}: RenderedStatementProps) {
  const textSize = size === 'lg' ? 28 : 16
  const lineHeight = size === 'lg' ? 40 : 24

  const CardWrapper = animatedStyle ? Animated.View : View

  const [text, setText] = useState(statement.text)

  if (!editable) {
    return (
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
    )
  }

  return (
    <CardWrapper style={[styles.container, containerStyle, animatedStyle]}>
      <View style={[styles.card, style]}>
        <View style={styles.contentContainer}>
          <EditableOnTap
            value={text}
            onChange={setText}
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
