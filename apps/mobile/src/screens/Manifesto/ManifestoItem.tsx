import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { Statement } from '@still/logic/src/statement/statementService'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import theme from '../../../lib/theme'
import { SwipeMenu } from '../../shared/SwipeMenu'

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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 0,
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
