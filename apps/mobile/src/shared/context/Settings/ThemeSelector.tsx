import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '../../../../lib/theme/context'
import { ThemeOption } from '../../../../lib/theme/service'

const THEME_OPTIONS: { label: string; value: ThemeOption }[] = [
  { label: 'Light', value: ThemeOption.LIGHT },
  { label: 'Dark', value: ThemeOption.DARK },
  { label: 'System', value: ThemeOption.SYSTEM },
]

const ThemeSelector = () => {
  const { theme, setTheme, themeObject } = useTheme()
  const styles = makeStyles(themeObject)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theme</Text>
      <View style={styles.optionsRow}>
        {THEME_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.option,
              theme === opt.value && styles.selectedOption,
            ]}
            onPress={() => setTheme(opt.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: theme === opt.value }}
          >
            <Text
              style={[
                styles.optionText,
                theme === opt.value && styles.selectedOptionText,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const makeStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginBottom: 24,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.primaryText,
      marginBottom: 8,
    },
    optionsRow: {
      flexDirection: 'row',
      gap: 12,
    },
    option: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.foregroundBackground,
      borderWidth: 1,
      borderColor: theme.colors.hoverAccent,
    },
    selectedOption: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.tertiaryText,
    },
    optionText: {
      color: theme.colors.primaryText,
      fontSize: 15,
    },
    selectedOptionText: {
      color: theme.colors.primaryText,
      fontWeight: '700',
    },
  })

export default ThemeSelector
