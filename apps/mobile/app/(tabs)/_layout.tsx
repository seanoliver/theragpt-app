import { FontAwesome } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-get-random-values'
import { ThemeProvider } from '../../lib/theme.context';
import theme, { getThemeByName } from '../../lib/theme'
import {
  useFonts as usePlayfairFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display'
import {
  useFonts as useInterFonts,
  Inter_400Regular,
  Inter_700Bold,
} from '@expo-google-fonts/inter'
import { ActivityIndicator } from 'react-native'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSegments } from 'expo-router'

export default function RootLayout() {
  const [playfairLoaded] = usePlayfairFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  })
  const [interLoaded] = useInterFonts({
    Inter_400Regular,
    Inter_700Bold,
  })
  const segments = useSegments() as string[]
  const currentTab = segments[0] || 'index'
  const sunsetTheme = getThemeByName('sunset')
  const isManifesto = currentTab === 'index'
  const tabTheme = sunsetTheme

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
          <StatusBar style="auto" />
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <Tabs
              screenOptions={{
                headerShown: false,
                tabBarStyle: {
                  backgroundColor: tabTheme.colors.background,
                  borderTopColor: tabTheme.colors.border,
                },
                tabBarActiveTintColor: tabTheme.colors.textOnBackground,
                tabBarInactiveTintColor: tabTheme.colors.textDisabled,
                headerStyle: {
                  backgroundColor: tabTheme.colors.background,
                },
                headerTintColor: tabTheme.colors.textOnBackground,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                tabBarLabelStyle: {
                  fontSize: 12,
                  paddingTop: 4,
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
