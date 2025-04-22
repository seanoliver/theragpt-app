import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { Statement } from '@still/logic/src/statement/statementService'
import { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import theme from '../../../lib/theme'
import { SwipeMenu } from '../../shared/SwipeMenu'
import {
  MANIFESTO_ITEM_LINE_HEIGHT,
  MANIFESTO_ITEM_TEXT_SIZE,
} from './constants'
import { ManifestoItemDisplay } from './ManifestoItemDisplay'
import { ManifestoItemEdit } from './ManifestoItemEdit'

interface ManifestoItemProps {
  statement: Statement
  editable?: boolean
  onSave?: (newText: string) => void
  onArchive: () => void
  onDelete: (id: string) => void
  autoFocus?: boolean
}

export const ManifestoItem = ({
  statement,
  onSave,
  onArchive,
  onDelete,
  autoFocus,
}: ManifestoItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [currentStatement, setCurrentStatement] = useState(statement)

  const handleSave = (newText: string) => {
    if (onSave && newText !== statement.text) {
      onSave(newText)
    }
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
        {isEditing ? (
          <ManifestoItemEdit
            currentStatement={currentStatement}
            setCurrentStatement={setCurrentStatement}
            setIsEditing={setIsEditing}
            autoFocus={autoFocus}
            onSave={handleSave}
          />
        ) : (
          <ManifestoItemDisplay
            statement={statement}
            setIsEditing={setIsEditing}
          />
        )}
      </View>
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
    borderColor: theme.colors.border + '1A',
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
