import { Card } from '@/packages/logic/src/cards/cards.service'
import React from 'react'
import { View, Text } from 'react-native'

interface CardSheetEditorProps {
  card: Card
}

export const CardSheetEditor = ({ card }: CardSheetEditorProps) => {
  return (
    <View style={{ flex: 1 }}>
      <Text>CardSheetEditor</Text>
    </View>
  )
}
