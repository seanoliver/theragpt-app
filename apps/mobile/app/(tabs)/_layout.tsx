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
import { ThemeProvider, useTheme } from '../../lib/theme.context'

export default function RootLayout() {
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
                  color={themeObject.colors.accent}
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
                // fontSize: 12,
                paddingTop: 6,
              },
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: 'Manifesto',
                tabBarIcon: ({ color }) => (
                  <FontAwesome name="book" size={22} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="review"
              options={{
                title: 'Review',
                tabBarIcon: ({ color }) => (
                  <FontAwesome name="history" size={28} color={color} />
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
            {/* <Tabs.Screen
                name="settings"
                options={{
                  title: 'Settings',
                  tabBarIcon: ({ color }) => (
                    <FontAwesome name="cog" size={22} color={color} />
                  ),
                }}
              /> */}
          </Tabs>
        </SafeAreaView>
      </KeyboardProvider>
    </ThemeProvider>
  )
}
