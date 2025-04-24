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
import { ActivityIndicator } from 'react-native'
import 'react-native-get-random-values'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemeProvider, useTheme } from '../../lib/theme/context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const TabRootLayout = () => {
  const [playfairLoaded] = usePlayfairFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  })
  const [interLoaded] = useInterFonts({
    Inter_400Regular,
    Inter_700Bold,
  })

  const { theme, themeObject } = useTheme()

  if (!playfairLoaded || !interLoaded) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    )
  }

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <StatusBar style={theme === 'dark' ? 'dark' : 'dark'} />
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <Tabs
              screenOptions={{
                headerShown: true,
                headerRight: () => (
                  <FontAwesome
                    name="gear"
                    size={22}
                    color={themeObject.colors.textOnBackground}
                    style={{ marginRight: 20 }}
                  />
                ),
                headerBackgroundContainerStyle: {
                  backgroundColor: themeObject.colors.background,
                  borderBottomColor: themeObject.colors.border,
                },
                tabBarStyle: {
                  backgroundColor: themeObject.colors.background,
                  borderTopColor: themeObject.colors.border,
                },
                tabBarActiveTintColor: themeObject.colors.textOnBackground,
                tabBarInactiveTintColor: themeObject.colors.textDisabled,
                headerStyle: {
                  backgroundColor: themeObject.colors.background,
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
              {/* Hide the card detail screen from the tab bar */}
              <Tabs.Screen
                name="cards/[cardId]"
                options={{
                  href: null,
                }}
              />
            </Tabs>
          </SafeAreaView>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  )
}

export default TabRootLayout
