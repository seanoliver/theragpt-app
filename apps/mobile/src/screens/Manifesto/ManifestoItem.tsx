import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { Statement } from '@still/logic/src/statement/statementService'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '../../../lib/theme/context'
import { SwipeMenu } from '../../shared/SwipeMenu'
import { Theme } from '@/apps/mobile/lib/theme'

interface ManifestoItemProps {
  statement: Statement
  editable?: boolean
  onArchive: () => void
  onDelete: (id: string) => void
}

export const ManifestoItem = ({
  statement,
  onArchive,
  onDelete,
}: ManifestoItemProps) => {
  const router = useRouter()
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)
  const handlePress = () => {
    router.push(`/statements/${statement.id}`)
  }

  const swipeActions = useMemo(
    () => [
      {
        label: '',
        icon: (
          <FontAwesome name="archive" size={18} color={theme.colors.accent} />
        ),
        backgroundColor: theme.colors.accent + '22',
        textColor: theme.colors.accent,
        onPress: onArchive,
      },
      {
        label: '',
        icon: <Ionicons name="trash" size={18} color="#d32f2f" />,
        backgroundColor: '#d32f2f22',
        textColor: '#d32f2f',
        onPress: () => onDelete(statement.id),
      },
    ],
    [onArchive, onDelete, statement.id, theme],
  )

  return (
    <SwipeMenu actions={swipeActions}>
      <View style={[styles.card]}>
        <TouchableOpacity onPress={handlePress}>
          <Text key={statement.id} style={styles.text}>
            {statement.text}
          </Text>
        </TouchableOpacity>
      </View>
    </SwipeMenu>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: 0,
      backgroundColor: 'transparent',
    },
    card: {
      backgroundColor: theme.colors.background,
      paddingVertical: 22,
      paddingHorizontal: 22,
      borderRadius: 18,
      marginHorizontal: 20,
      marginBottom: 18,
      boxShadow: `0px 4px 8px 0px ${theme.colors.borderSubtle}`,

      borderWidth: 0,
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
