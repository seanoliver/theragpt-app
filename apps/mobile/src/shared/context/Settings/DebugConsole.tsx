import { useTheme } from '@/apps/mobile/lib/theme/context'
import { Theme } from '@/apps/mobile/lib/theme/theme'
import React, { useState } from 'react'
import { View, Text, StyleSheet, Button, Modal, ScrollView, TouchableOpacity, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCardStore } from '@/apps/mobile/src/store/useCardStore'

// Try to import expo-constants for version/build info
let Constants: any = null
try {
  // @ts-ignore
  Constants = require('expo-constants').default
} catch (e) {
  // Fallback: Constants not available
}

interface DebugConsoleProps {
  env: string
}

export const DebugConsole = ({ env }: DebugConsoleProps) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)
  const [asyncStorageVisible, setAsyncStorageVisible] = useState(false)
  const [asyncStorageContents, setAsyncStorageContents] = useState<{ [key: string]: string }>({})
  const [loadingStorage, setLoadingStorage] = useState(false)
  const setCards = useCardStore(state => state.setCards)

  if (env !== 'development') return null

  // AsyncStorage: Clear all
  const handleClearAsyncStorage = async () => {
    Alert.alert(
      'Clear AsyncStorage',
      'Are you sure you want to clear all AsyncStorage? This will remove all persisted data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear()
            Alert.alert('AsyncStorage cleared')
          },
        },
      ]
    )
  }

  // AsyncStorage: View all
  const handleViewAsyncStorage = async () => {
    setLoadingStorage(true)
    try {
      const keys = await AsyncStorage.getAllKeys()
      const entries = await AsyncStorage.multiGet(keys)
      const contents: { [key: string]: string } = {}
      entries.forEach(([key, value]) => {
        contents[key] = value ?? ''
      })
      setAsyncStorageContents(contents)
      setAsyncStorageVisible(true)
    } catch (e) {
      Alert.alert('Error', 'Failed to load AsyncStorage contents')
    }
    setLoadingStorage(false)
  }

  // Card Store: Reset
  const handleResetCardStore = async () => {
    Alert.alert(
      'Reset Card Store',
      'Are you sure you want to reset the card store? This will remove all cards.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('card-storage')
            setCards([])
            Alert.alert('Card store reset')
          },
        },
      ]
    )
  }

  // App version/build info
  const getAppInfo = () => {
    if (Constants) {
      const { manifest, expoConfig, nativeAppVersion, nativeBuildVersion } = Constants
      // Try to get info from manifest or expoConfig
      const version = manifest?.version || expoConfig?.version || nativeAppVersion || '1.0.2'
      const build = manifest?.ios?.buildNumber || expoConfig?.ios?.buildNumber || nativeBuildVersion || '2'
      return { version, build }
    }
    // Fallback to static values from app.json
    return { version: '1.0.2', build: '2' }
  }
  const { version, build } = getAppInfo()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Console</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AsyncStorage</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleClearAsyncStorage}>
            <Text style={styles.buttonText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleViewAsyncStorage} disabled={loadingStorage}>
            <Text style={styles.buttonText}>{loadingStorage ? 'Loading...' : 'View Contents'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Card Store</Text>
        <TouchableOpacity style={styles.button} onPress={handleResetCardStore}>
          <Text style={styles.buttonText}>Reset Card Store</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>
        <Text style={styles.infoText}>Version: {version}</Text>
        <Text style={styles.infoText}>Build: {build}</Text>
      </View>

      <Modal
        visible={asyncStorageVisible}
        animationType="slide"
        onRequestClose={() => setAsyncStorageVisible(false)}
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>AsyncStorage Contents</Text>
            <ScrollView style={styles.scrollView}>
              {Object.entries(asyncStorageContents).length === 0 ? (
                <Text style={styles.infoText}>No data in AsyncStorage.</Text>
              ) : (
                Object.entries(asyncStorageContents).map(([key, value]) => (
                  <View key={key} style={styles.kvRow}>
                    <Text style={styles.kvKey}>{key}:</Text>
                    <Text style={styles.kvValue}>{value}</Text>
                  </View>
                ))
              )}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setAsyncStorageVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.colors.primaryBackground,
      borderRadius: 8,
      marginBottom: 16,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.primaryText,
      marginBottom: 8,
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.secondaryText,
      marginBottom: 4,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 8,
    },
    button: {
      backgroundColor: theme.colors.accent,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
      marginRight: 8,
      marginTop: 4,
    },
    buttonText: {
      color: theme.colors.textOnAccent,
      fontWeight: '500',
      fontSize: 14,
    },
    infoText: {
      color: theme.colors.secondaryText,
      fontSize: 13,
      marginBottom: 2,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.foregroundBackground,
      borderRadius: 10,
      padding: 20,
      width: '85%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.primaryText,
      marginBottom: 12,
    },
    scrollView: {
      maxHeight: 300,
      marginBottom: 12,
    },
    kvRow: {
      flexDirection: 'row',
      marginBottom: 6,
      flexWrap: 'wrap',
    },
    kvKey: {
      fontWeight: 'bold',
      color: theme.colors.primaryText,
      marginRight: 4,
    },
    kvValue: {
      color: theme.colors.secondaryText,
      flexShrink: 1,
    },
    closeButton: {
      backgroundColor: theme.colors.accent,
      paddingVertical: 8,
      borderRadius: 6,
      alignItems: 'center',
    },
  })

