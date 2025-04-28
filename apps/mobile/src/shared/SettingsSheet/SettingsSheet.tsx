import React from 'react'
import { View, StyleSheet, Modal, Platform } from 'react-native'
import { useTheme } from '../../../lib/theme/context'
import { useCardService } from '../../hooks/useCardService'
import ThemeSelector from './ThemeSelector'
import PaletteSelector from './PaletteSelector'
import StatisticsDisplay from './StatisticsDisplay'

type SettingsSheetProps = {
  visible: boolean
  onClose: () => void
}

const SettingsSheet = ({ visible, onClose }: SettingsSheetProps) => {
  const { themeObject: theme } = useTheme()
  const { cards } = useCardService(false)

  // Styles
  const styles = makeStyles(theme)

  // Use Modal for cross-platform bottom sheet (replace with custom sheet if available)
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <ThemeSelector />
          <PaletteSelector />
          <StatisticsDisplay cards={cards} />
        </View>
        <View style={styles.background} onTouchEnd={onClose} />
      </View>
    </Modal>
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