import { FontAwesome } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-get-random-values'
import { ThemeProvider } from '../lib/theme.context';
import theme from '../lib/theme'
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

export default function RootLayout() {
  const [playfairLoaded] = usePlayfairFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  })
  const [interLoaded] = useInterFonts({
    Inter_400Regular,
    Inter_700Bold,
  })
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
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: theme.colors.background,
                borderTopColor: theme.colors.border,
              },
              tabBarActiveTintColor: theme.colors.textOnBackground,
              tabBarInactiveTintColor: theme.colors.textOnBackground,
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerTintColor: theme.colors.textOnBackground,
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
            <Tabs.Screen
              name="edit"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="new"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="still"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="onboarding"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: 'Settings',
                tabBarIcon: ({ color }) => (
                  <FontAwesome name="cog" size={22} color={color} />
                ),
              }}
            />
          </Tabs>
        </KeyboardProvider>
      </ThemeProvider>
    )
  }
