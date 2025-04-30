import { CardSheetEditor } from '@/apps/mobile/src/shared/CardSheet/CardSheetEditor'
import { useCardStore } from '@/apps/mobile/src/store/useCardStore'
import { Card } from '@/packages/logic/src/cards/cards.service'
import React from 'react'

export const FABSheet = ({
  editingCard,
  setEditingCard,
  closeFAB,
}: {
  editingCard: Card
  setEditingCard: (card: Card) => void
  closeFAB: () => void
}) => {
  const updateCard = useCardStore((state: any) => state.updateCard)

  if (!editingCard) return null

  return (
    <CardSheetEditor
      card={editingCard}
      onSave={async (text: string) => {
        await updateCard({ ...editingCard, text })
        setEditingCard({ ...editingCard, text })
      }}
      onClose={closeFAB}
    />
  )
}
