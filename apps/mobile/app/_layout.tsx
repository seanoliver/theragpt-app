import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import ThemeProvider from './providers/ThemeProvider'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4f4f4',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="analysis"
          options={{
            title: 'Analysis Result',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="reframe-detail"
          options={{
            title: 'Reframe Details',
          }}
        />
      </Stack>
    </ThemeProvider>
  )
}
