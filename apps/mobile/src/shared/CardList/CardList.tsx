import { Theme } from '@/apps/mobile/lib/theme'
import { useTheme } from '@/apps/mobile/lib/theme/context'
import { Ionicons } from '@expo/vector-icons'
import BottomSheet, {
  BottomSheetHandle,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { Card as CardType } from '@theragpt/logic'
import React, { useMemo, useRef, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { CardListItem } from './CardListItem'
import { SwipeAction } from '../SwipeMenu'
import { useCardStore } from '../../store/useCardStore'
import { CardSheet } from '../CardSheet/CardSheet'

interface CardListProps {
  cards: CardType[]
}

export const CardList = ({ cards }: CardListProps) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
  const bottomSheetRef = useRef<BottomSheet>(null)

  const snapPoints = useMemo(() => ['25%', '50%', '95%'], [])
  const handleArchive = (cardId: string) => {
    useCardStore.getState().updateCard({ id: cardId, isActive: false })
  }
  const handleDelete = (cardId: string) => {
    useCardStore.getState().deleteCard(cardId)
  }

  const handleOpenBottomSheet = (card: CardType) => {
    setSelectedCard(card)
    bottomSheetRef.current?.expand()
  }

  const getSwipeActions = (card: CardType): SwipeAction[] => [
    {
      label: 'archive',
      icon: (
        <Ionicons name="archive-outline" size={24} color={theme.colors.white} />
      ),
      backgroundColor: theme.colors.accent,
      textColor: theme.colors.white,
      onPress: () => handleArchive(card.id),
    },
    {
      label: 'delete',
      icon: (
        <Ionicons name="trash-outline" size={24} color={theme.colors.white} />
      ),
      backgroundColor: theme.colors.errorAccent,
      textColor: theme.colors.white,
      onPress: () => handleDelete(card.id),
    },
  ]

  return (
    <>
      <FlatList
        data={cards}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          return (
            <CardListItem
              card={item}
              handleOpenBottomSheet={handleOpenBottomSheet}
              getSwipeActions={getSwipeActions}
            />
          )
        }}
        contentContainerStyle={styles.listContent}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
        onClose={() => setSelectedCard(null)}
        handleComponent={BottomSheetHandle}
        backgroundStyle={styles.sheetBackground}
      >
        <BottomSheetView style={{ flex: 1 }}>
          {selectedCard && <CardSheet cardId={selectedCard.id} />}
        </BottomSheetView>
      </BottomSheet>
    </>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    listContent: {
      paddingBottom: 120,
      paddingTop: 16,
    },
    cardWrapper: {
      marginBottom: 16,
      marginHorizontal: 16,
    },
    sheetBackground: {
      backgroundColor: theme.colors.foregroundBackground,
    },
  })
