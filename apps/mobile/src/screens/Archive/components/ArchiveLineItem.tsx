import { Theme } from '@/apps/mobile/lib/theme'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { Card } from '@still/logic'
import { useMemo } from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { useTheme } from '../../../../lib/theme/context'
import { SwipeMenu } from '../../../shared/SwipeMenu'

interface ArchiveLineItemProps {
  card: Card
  style?: ViewStyle
  animatedStyle?: any
  containerStyle?: ViewStyle
  editable?: boolean
  onPublish: () => void
  onDelete: () => void
}

export const ArchiveLineItem = ({
  card,
  style,
  animatedStyle,
  containerStyle,
  onPublish,
  onDelete,
}: ArchiveLineItemProps) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)
  // const router = useRouter()

  // const handlePress = () => {
  //   router.push(`/card/${card.id}`)
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
          <Text style={styles.text}>{card.text}</Text>
        </View>
      </View>
    </SwipeMenu>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: 0,
      marginTop: 20,
      backgroundColor: 'transparent',
    },
    card: {
      backgroundColor: theme.colors.foregroundBackground,
      paddingVertical: 22,
      paddingHorizontal: 22,
      borderRadius: 18,
      marginHorizontal: 20,
      marginBottom: 18,
      ...theme.rnShadows.subtle,
      borderWidth: 0,
    },
    text: {
      flex: 1,
      fontSize: 18,
      lineHeight: 24,
      textAlign: 'left',
      fontWeight: 'bold',
      letterSpacing: 0.1,
      color: '#222',
    },
  })
