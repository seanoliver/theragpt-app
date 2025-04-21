import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import theme from '../../lib/theme'

export function SettingsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.header}>Settings</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Notifications</Text>
        <Switch value={false} disabled />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Theme</Text>
        <Text style={styles.value}>System Default</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>About</Text>
        <Text style={styles.value}>Still v1.0.0</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  contentContainer: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    color: theme.colors.textOnBackground,
    fontWeight: '700',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  label: {
    fontSize: 18,
    color: theme.colors.textOnBackground,
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: theme.colors.textOnBackground,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: theme.colors.hoverBackground,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: theme.colors.textOnBackground,
    fontSize: 16,
    fontWeight: '600',
  },
})
