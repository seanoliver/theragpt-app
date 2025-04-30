import * as eva from '@eva-design/eva'
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
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-get-random-values'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { ThemeProvider, useTheme } from '../lib/theme/context'
import { evaCustomTheme } from '../lib/theme/eva-custom-theme'
import { FABProvider } from '../src/shared/context/FAB/FABContext'
import { SettingsProvider } from '../src/shared/context/Settings/SettingsContext'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...evaCustomTheme }}>
        <ThemeProvider>
          <SettingsProvider>
            <InnerProviders>{children}</InnerProviders>
          </SettingsProvider>
        </ThemeProvider>
      </ApplicationProvider>
    </GestureHandlerRootView>
  )
}

const InnerProviders = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme()
  return (
    <KeyboardProvider>
      <FABProvider>
        <StatusBar style={theme === 'dark' ? 'dark' : 'dark'} />
        <View style={{ flex: 1 }}>{children}</View>
      </FABProvider>
    </KeyboardProvider>
  )
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can log error to an error reporting service here
    console.error('ErrorBoundary caught an error', error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}
        >
          <StatusBar style="dark" />
          <ActivityIndicator
            size="large"
            color="#d32f2f"
            style={{ marginBottom: 20 }}
          />
          <Text style={{ color: '#d32f2f', fontSize: 18, marginBottom: 8 }}>
            Something went wrong.
          </Text>
          <Text
            style={{
              color: '#333',
              fontSize: 14,
              textAlign: 'center',
              marginHorizontal: 20,
            }}
          >
            {String(this.state.error)}
          </Text>
        </SafeAreaView>
      )
    }
    return this.props.children
  }
}

const RootLayout = () => {
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
    <Providers>
      <ErrorBoundary>
        <Slot />
      </ErrorBoundary>
    </Providers>
  )
}

export default RootLayout
