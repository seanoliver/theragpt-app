import React, { useMemo, useRef } from 'react'
import { View, StyleSheet, Modal, Platform } from 'react-native'
import { useTheme } from '../../../lib/theme/context'
import { useCardStore } from '../../store/useCardStore'
import ThemeSelector from './ThemeSelector'
import PaletteSelector from './PaletteSelector'
import StatisticsDisplay from './StatisticsDisplay'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'

type SettingsSheetProps = {
  visible: boolean
  onClose: () => void
}

const SettingsSheet = ({ visible, onClose }: SettingsSheetProps) => {
  const { themeObject: theme } = useTheme()
  const cards = useCardStore(state => state.cards)

  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['95%'], [])

  // Styles
  const styles = makeStyles(theme)

  // Use Modal for cross-platform bottom sheet (replace with custom sheet if available)
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={-1}
      enablePanDownToClose
      onClose={onClose}
    >
      <BottomSheetView style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <ThemeSelector />
          <PaletteSelector />
          <StatisticsDisplay cards={cards} />
        </View>
        <View style={styles.background} onTouchEnd={onClose} />
      </BottomSheetView>
    </BottomSheet>
  )
}

const makeStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    sheet: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: Platform.OS === 'ios' ? 32 : 16,
      minHeight: 360,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 5,
      borderRadius: 3,
      backgroundColor: theme.borderSubtle,
      marginBottom: 16,
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      zIndex: -1,
    },
  })

export default SettingsSheet
