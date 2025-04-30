import { useTheme } from '@/apps/mobile/lib/theme/context'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { BottomSheetHandle } from '../../BottomSheetHandle'
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react'
import { Platform, StyleSheet, View, Text } from 'react-native'
import ThemeSelector from './ThemeSelector'
import { DebugConsole } from './DebugConsole'

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
  const snapPoints = useMemo(() => ['20%', '50%', '95%'], [])

  const openSettings = useCallback(() => bottomSheetRef.current?.expand(), [])
  const closeSettings = useCallback(() => bottomSheetRef.current?.close(), [])

  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} enableTouchThrough={true} />
    ),
    [],
  )
  // Get the current ENV
  const ENV = process.env.NODE_ENV || 'production'

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
        backdropComponent={renderBackdrop}
        handleComponent={BottomSheetHandle}
        backgroundStyle={styles.sheetBackground}
      >
        <BottomSheetView style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <ThemeSelector />
            {ENV === 'development' && <DebugConsole env={ENV} />}
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
    },
    sheet: {
      backgroundColor: theme.colors.foregroundBackground,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: Platform.OS === 'ios' ? 32 : 16,
      minHeight: 360,
      ...theme.rnShadows.subtle,
    },
    handle: {
      width: 32,
      height: 4,
      borderRadius: 2,
      marginBottom: 8,
    },
    background: {
      flex: 1,
      backgroundColor: theme.colors.foregroundBackground,
    },
    sheetBackground: {
      backgroundColor: theme.colors.foregroundBackground,
    },
  })
