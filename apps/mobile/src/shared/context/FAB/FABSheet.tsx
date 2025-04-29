import React from 'react';
import { View, Text } from 'react-native';
import { useFABContext } from './FABContext';
import { useCardStore } from '@/apps/mobile/src/store/useCardStore';
import { CardSheetEditor } from '@/apps/mobile/src/screens/CardSheet/CardSheetEditor';
import type { Card } from '@/packages/logic/src/cards/cards.service';

export const FABSheet = () => {
  const { editingCard, setEditingCard, closeFAB } = useFABContext();
  const updateCard = useCardStore((state: any) => state.updateCard);

  if (!editingCard) return null;

  return (
    <CardSheetEditor
      card={editingCard}
      onSave={async (text: string) => {
        await updateCard({ ...editingCard, text });
        setEditingCard({ ...editingCard, text });
      }}
      onClose={closeFAB}
    />
  );
};