import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native'
import { useTheme } from '../../lib/theme/context'
import { ThemeOption, getAvailableThemes } from '../../lib/theme/service'

const THEME_LABELS: Record<ThemeOption, string> = {
  [ThemeOption.LIGHT]: 'Light',
  [ThemeOption.DARK]: 'Dark',
  [ThemeOption.SYSTEM]: 'System Default',
}

export function SettingsScreen() {
  const { theme: selectedTheme, setTheme } = useTheme()
  const themeOptions = getAvailableThemes()

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
        <View style={styles.themeSelector}>
          {themeOptions.map(option => (
            <Pressable
              key={option}
              style={[
                styles.themeOption,
                selectedTheme === option && styles.themeOptionSelected,
              ]}
              onPress={() => setTheme(option)}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedTheme === option }}
            >
              <Text
                style={[
                  styles.themeOptionLabel,
                  selectedTheme === option && styles.themeOptionLabelSelected,
                ]}
              >
                {THEME_LABELS[option]}
              </Text>
            </Pressable>
          ))}
        </View>
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
    // backgroundColor: theme.colors.background,
    padding: 20,
  },
  contentContainer: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    // color: theme.colors.textOnBackground,
    fontWeight: '700',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    // borderBottomColor: theme.colors.border,
  },
  label: {
    fontSize: 18,
    // color: theme.colors.textOnBackground,
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    // color: theme.colors.textOnBackground,
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  themeOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    // borderColor: theme.colors.border,
    // backgroundColor: theme.colors.background,
    marginRight: 8,
  },
  themeOptionSelected: {
    // backgroundColor: theme.colors.hoverBackground,
    // borderColor: theme.colors.primary,
  },
  themeOptionLabel: {
    // color: theme.colors.textOnBackground,
    fontSize: 16,
  },
  themeOptionLabelSelected: {
    // color: theme.colors.primary,
    fontWeight: '700',
  },
  logoutButton: {
    marginTop: 40,
    // backgroundColor: theme.colors.hoverBackground,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    // color: theme.colors.textOnBackground,
    fontSize: 16,
    fontWeight: '600',
  },
})
