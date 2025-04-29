import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import { Card } from '@still/logic';
import { CardScreenEdit } from './CardEdit';

export type CardEditBottomSheetRef = {
  open: (card: Card) => void;
  close: () => void;
};

export const CardEditBottomSheet = forwardRef<CardEditBottomSheetRef, {}>((props, ref) => {
  const sheetRef = useRef<BottomSheet>(null);
  const [card, setCard] = useState<Card | null>(null);

  useImperativeHandle(ref, () => ({
    open: (card: Card) => {
      setCard(card);
      sheetRef.current?.expand();
    },
    close: () => {
      sheetRef.current?.close();
    },
  }));

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['60%']}
      enablePanDownToClose
      onClose={() => setCard(null)}
    >
      <View style={{ flex: 1 }}>
        {card && <CardScreenEdit card={card} />}
      </View>
    </BottomSheet>
  );
});