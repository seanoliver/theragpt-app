import { useTheme } from '@/apps/mobile/lib/theme/context'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import PaletteSelector from './PaletteSelector'
import ThemeSelector from './ThemeSelector'

type SettingsContextType = {
  bottomSheetRef: React.RefObject<BottomSheet>
  openSettings: () => void
  closeSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
)

export const useSettingsContext = (): SettingsContextType => {
  const ctx = useContext(SettingsContext)
  if (!ctx)
    throw new Error('useSettingsContext must be used with a SettingsContext')
  return ctx
}

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['95%'], [])

  const openSettings = useCallback(() => bottomSheetRef.current?.expand(), [])
  const closeSettings = useCallback(() => bottomSheetRef.current?.close(), [])

  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  return (
    <SettingsContext.Provider
      value={{ openSettings, closeSettings, bottomSheetRef }}
    >
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
        onClose={closeSettings}
      >
        <BottomSheetView style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <ThemeSelector />
            <PaletteSelector />
            {/* <StatisticsDisplay cards={cards} /> */}
          </View>
          <View style={styles.background} onTouchEnd={closeSettings} />
        </BottomSheetView>
      </BottomSheet>
    </SettingsContext.Provider>
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
      shadowRadius: 10,
    },
    handle: {
      width: 32,
      height: 4,
      backgroundColor: theme.text,
      borderRadius: 2,
      marginBottom: 8,
    },
    background: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
  })
