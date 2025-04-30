import { Theme } from '@/apps/mobile/lib/theme/theme'
import { Card } from '@/packages/logic/src/cards/cards.service'
import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../../lib/theme/context'
import { CardSheetStats } from './CardSheetStats'
import { CardSheetMenu } from './CardSheetMenu'
import { CardSheetText } from './CardSheetText'
import { CardSheetEditor } from './CardSheetEditor'
import { useCardStore } from '../../store/useCardStore'
import { debounce } from 'lodash'

interface CardSheetProps {
  cardId: string
}

export const CardSheet = ({ cardId }: CardSheetProps) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  const card = useCardStore(state => state.getCardById(cardId))

  const [isEditing, setIsEditing] = useState(false)
  const { updateCard } = useCardStore()

  const onEdit = () => {
    setIsEditing(prev => !prev)
  }

  const debouncedUpdateCard = useCallback(
    debounce((text: string) => updateCard({ id: cardId, text }), 1000),
    [cardId, updateCard],
  )

  const onSave = (text: string) => {
    debouncedUpdateCard(text)
  }

  if (!card) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Card not found.</Text>
      </View>
    )
  }

  const onClose = () => {
    setIsEditing(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isEditing ? (
          <CardSheetEditor card={card} onSave={onSave} onClose={onClose} />
        ) : (
          <>
            <CardSheetText card={card} />
            <CardSheetStats card={card} />
          </>
        )}
        <CardSheetMenu card={card} isEditing={isEditing} onEdit={onEdit} />
      </View>
    </View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      paddingBottom: 8,
      borderBottomWidth: 1,
    },
    backButton: {
      padding: 8,
      width: 40,
      alignItems: 'flex-start',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      textAlign: 'center',
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.foregroundBackground,
    },
    loadingText: {
      color: theme.colors.textOnBackground,
      marginTop: 16,
    },
    errorText: {
      color: theme.colors.errorText,
    },
  })
