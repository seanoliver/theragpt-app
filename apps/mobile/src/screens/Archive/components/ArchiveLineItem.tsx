import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { Statement } from '@still/logic/src/statement/statementService'
import { useMemo } from 'react'
import { StyleSheet, View, ViewStyle, Text } from 'react-native'
import theme from '../../../../lib/theme'
import { SwipeMenu } from '../../../shared/SwipeMenu'

interface ArchiveLineItemProps {
  statement: Statement
  style?: ViewStyle
  animatedStyle?: any
  containerStyle?: ViewStyle
  editable?: boolean
  onPublish: () => void
  onDelete: () => void
}

export const ArchiveLineItem = ({
  statement,
  style,
  animatedStyle,
  containerStyle,
  onPublish,
  onDelete,
}: ArchiveLineItemProps) => {
  // const router = useRouter()

  // const handlePress = () => {
  //   router.push(`/statement/${statement.id}`)
  // }

  const swipeActions = useMemo(
    () => [
      {
        label: 'Publish',
        icon: (
          <FontAwesome
            name="arrow-up"
            size={20}
            color={theme.colors.textOnBackground}
          />
        ),
        backgroundColor: theme.colors.accent,
        textColor: theme.colors.textOnBackground,
        onPress: onPublish,
      },
      {
        label: 'Delete',
        icon: <Ionicons name="trash" size={20} color="#fff" />,
        backgroundColor: '#E57373',
        textColor: '#fff',
        onPress: onDelete,
      },
    ],
    [theme, onPublish],
  )

  return (
    <SwipeMenu actions={swipeActions}>
      <View style={[styles.container, containerStyle, animatedStyle]}>
        <View style={[styles.card, style]}>
          <Text style={styles.text}>{statement.text}</Text>
        </View>
      </View>
    </SwipeMenu>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 0,
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingVertical: 22,
    paddingHorizontal: 22,
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    borderWidth: 1.5,
    borderColor: theme.colors.border + '22',
    overflow: 'hidden',
  },
  text: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'left',
    fontWeight: '400',
    letterSpacing: 0.1,
  },
})
