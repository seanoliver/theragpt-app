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
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, Text } from 'react-native'
import 'react-native-get-random-values'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemeProvider, useTheme } from '../lib/theme/context'
import { Slot } from 'expo-router'
import React from 'react'

const Providers = ({ children }: { children: React.ReactNode }) => {
  // ThemeProvider must be outside useTheme
  return (
    <ThemeProvider>
      <InnerProviders>{children}</InnerProviders>
    </ThemeProvider>
  )
}

const InnerProviders = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme()
  return (
    <KeyboardProvider>
      <StatusBar style={theme === 'dark' ? 'dark' : 'dark'} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {children}
      </SafeAreaView>
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
