import React from 'react'
import { useTheme } from '@/apps/mobile/lib/theme/context'
import { Theme } from '@/apps/mobile/lib/theme/theme'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { createContext, useCallback, useContext, useMemo, useRef } from 'react'
import { StyleSheet } from 'react-native'
import { FABSheet } from './FABSheet'
import type { Card } from '@/packages/logic/src/cards/cards.service'

export type FABContextType = {
  bottomSheetRef: React.RefObject<BottomSheet>
  openFAB: () => void
  closeFAB: () => void
  editingCard: Card | null
  setEditingCard: React.Dispatch<React.SetStateAction<Card | null>>
}

const FABContext = createContext<FABContextType | undefined>(undefined)

export const useFABContext = () => {
  const context = useContext(FABContext)
  if (!context) {
    throw new Error('useFABContext must be used within a FABProvider')
  }
  return context
}

export const FABProvider = ({ children }: { children: React.ReactNode }) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['25%', '50%', '95%'], [])

  const [editingCard, setEditingCard] = React.useState<Card | null>(null)

  const openFAB = useCallback(() => bottomSheetRef.current?.expand(), [])
  const closeFAB = useCallback(() => {
    setEditingCard(null)
    bottomSheetRef.current?.close()
  }, [])

  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} enableTouchThrough={true} />
    ),
    [],
  )

  return (
    <FABContext.Provider
      value={{ bottomSheetRef, openFAB, closeFAB, editingCard, setEditingCard }}
    >
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onClose={closeFAB}
      >
        <BottomSheetView style={styles.overlay}>
          {editingCard && (
            <FABSheet
              editingCard={editingCard}
              setEditingCard={setEditingCard}
              closeFAB={closeFAB}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </FABContext.Provider>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
    },
  })
