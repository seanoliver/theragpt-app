import { Statement } from '@still/logic/src/statement/statementService'
import { useMemo, useState } from 'react'
import { StyleSheet, View, ViewStyle, Text } from 'react-native'
import Animated from 'react-native-reanimated'
import theme, { getThemeByName } from '../../../lib/theme'
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
  const sunsetTheme = getThemeByName('sunset')

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
          color: sunsetTheme.colors.textOnBackground,
          fontFamily: sunsetTheme.fontFamilies.bodySans,
          fontWeight: '400',
          letterSpacing: 0.1,
          marginBottom: 16,
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
          label: '',
          icon: (
            <FontAwesome
              name="archive"
              size={18}
              color={sunsetTheme.colors.accent}
            />
          ),
          backgroundColor: sunsetTheme.colors.accent + '22',
          textColor: sunsetTheme.colors.accent,
          onPress: onArchive,
        },
        {
          label: '',
          icon: <Ionicons name="trash" size={18} color="#d32f2f" />,
          backgroundColor: '#d32f2f22',
          textColor: '#d32f2f',
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
    backgroundColor: 'rgba(255,255,255,0.90)',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: getThemeByName('sunset').colors.border + '1A',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 8,
  },
  text: {
    flex: 1,
    fontSize: MANIFESTO_ITEM_TEXT_SIZE,
    lineHeight: MANIFESTO_ITEM_LINE_HEIGHT,
    textAlign: 'left',
    fontWeight: '400',
    letterSpacing: 0.1,
  },
})
