import { Theme, useTheme } from '@/apps/mobile/lib/theme'
import { Card } from '@/packages/logic/src/cards/cards.service'
import React, { useState } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'

interface CardSheetEditorProps {
  card: Card
  onSave: (text: string) => void
}

export const CardSheetEditor = ({ card, onSave }: CardSheetEditorProps) => {
  const [text, setText] = useState(card.text)
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  return (
    <View style={[styles.card]}>
      <TextInput
        style={[styles.cardText]}
        multiline
        value={text}
        onChangeText={text => {
          setText(text)
          onSave(text)
        }}
        autoFocus
      />
    </View>
  )
}

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    card: {
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      backgroundColor: theme.colors.foregroundBackground,
    },
    cardText: {
      flex: 1,
      fontSize: 16,
      lineHeight: 32,
      marginBottom: 8,
      color: theme.colors.textOnBackground,
      minHeight: 200,
      padding: 0,
      top: -2,
      textAlignVertical: 'top',
      includeFontPadding: false,
    },
  })
}
