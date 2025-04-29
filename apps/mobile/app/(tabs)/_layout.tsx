import React from 'react'
import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts as useInterFonts,
} from '@expo-google-fonts/inter'
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  useFonts as usePlayfairFonts,
} from '@expo-google-fonts/playfair-display'
import { FontAwesome } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, View, TouchableOpacity } from 'react-native'
import 'react-native-get-random-values'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { ThemeProvider, useTheme } from '../../lib/theme/context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import SettingsSheet from '../../src/shared/SettingsSheet/SettingsSheet'
import {
  SettingsProvider,
  useSettingsContext,
} from '../../src/shared/SettingsSheet/SettingsSheetContext'

const TabRootLayout = (): JSX.Element => {
  const [playfairLoaded] = usePlayfairFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  })
  const [interLoaded] = useInterFonts({
    Inter_400Regular,
    Inter_700Bold,
  })

  const { theme, themeObject } = useTheme()
  // Use context for settings sheet
  const { visible, openSettings, closeSettings } = useSettingsContext()

  // Stable headerRight callback using context
  const renderHeaderRight = React.useCallback(
    () => (
      <TouchableOpacity
        onPress={openSettings}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <FontAwesome
          name="gear"
          size={22}
          color={themeObject.colors.textOnBackground}
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity>
    ),
    [openSettings, themeObject.colors.textOnBackground],
  )

  if (!playfairLoaded || !interLoaded) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    )
  }

  return (
    <KeyboardProvider>
      <StatusBar style={theme === 'dark' ? 'dark' : 'dark'} />
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: true,
            headerRight: renderHeaderRight,
            headerBackgroundContainerStyle: {
              backgroundColor: themeObject.colors.foregroundBackground,
              borderBottomColor: themeObject.colors.border,
            },
            tabBarStyle: {
              backgroundColor: themeObject.colors.foregroundBackground,
              borderTopColor: themeObject.colors.border,
            },
            tabBarActiveTintColor: themeObject.colors.textOnBackground,
            tabBarInactiveTintColor: themeObject.colors.textDisabled,
            headerStyle: {
              backgroundColor: themeObject.colors.foregroundBackground,
            },
            headerTintColor: themeObject.colors.textOnBackground,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarLabelStyle: {
              paddingTop: 6,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Cards',
              tabBarIcon: ({ color }) => (
                <FontAwesome name="th-list" size={22} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="review"
            options={{
              title: 'Today',
              tabBarIcon: ({ color }) => (
                <FontAwesome name="calendar-o" size={22} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="archive"
            options={{
              title: 'Archive',
              tabBarIcon: ({ color }) => (
                <FontAwesome name="archive" size={22} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </KeyboardProvider>
  )
}

export default TabRootLayout
