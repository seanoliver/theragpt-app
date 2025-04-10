import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { tokens } from '@theragpt/ui/src/theme'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tokens.colors.primary500,
        tabBarInactiveTintColor: tokens.colors.gray600,
        tabBarStyle: {
          backgroundColor: tokens.colors.background.light,
          borderTopColor: tokens.colors.gray300,
        },
        headerStyle: {
          backgroundColor: tokens.colors.gray100,
        },
        headerTintColor: tokens.colors.gray900,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="thought"
        options={{
          title: 'New Thought',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reframes"
        options={{
          title: 'Reframes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}