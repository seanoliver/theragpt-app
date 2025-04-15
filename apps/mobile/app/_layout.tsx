import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-get-random-values';
import { colors } from '../lib/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.charcoal[100],
            borderTopColor: colors.charcoal[200],
          },
          tabBarActiveTintColor: colors.text.primary,
          tabBarInactiveTintColor: colors.text.secondary,
          headerStyle: {
            backgroundColor: colors.charcoal[100],
          },
          headerTintColor: colors.text.primary,
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
          name="library"
          options={{
            title: 'Backlog',
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
      </Tabs>
    </>
  )
}
