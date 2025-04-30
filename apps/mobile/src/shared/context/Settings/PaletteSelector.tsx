import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { themes, ThemeMode } from '../../../../lib/theme/palettes'
import { useTheme } from '../../../../lib/theme/context'

const PALETTE_NAMES: ThemeMode[] = ['indigo', 'forest', 'sunset', 'white', 'charcoal']

const PaletteSelector = () => {
  const { themeObject } = useTheme()
  const [selected, setSelected] = useState<ThemeMode>('indigo')

  // Optionally, preview palette by updating local state (integration with theme context can be added)
  const styles = makeStyles(themeObject)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Color Palette</Text>
      <View style={styles.palettesRow}>
        {PALETTE_NAMES.map(name => {
          const palette = themes[name]
          return (
            <TouchableOpacity
              key={name}
              style={[
                styles.paletteOption,
                selected === name && styles.selectedPalette,
              ]}
              onPress={() => setSelected(name)}
              accessibilityRole="button"
              accessibilityState={{ selected: selected === name }}
            >
              <View style={styles.swatchRow}>
                <View style={[styles.swatch, { backgroundColor: palette.primaryBackground }]} />
                <View style={[styles.swatch, { backgroundColor: palette.accent }]} />
                <View style={[styles.swatch, { backgroundColor: palette.foregroundBackground, borderWidth: 1, borderColor: '#ccc' }]} />
              </View>
              <Text style={styles.paletteLabel}>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
            </TouchableOpacity>
          )
        })}
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
      color: theme.text,
      marginBottom: 8,
    },
    palettesRow: {
      flexDirection: 'row',
      gap: 12,
      flexWrap: 'wrap',
    },
    paletteOption: {
      alignItems: 'center',
      padding: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      backgroundColor: theme.background,
      marginRight: 8,
      marginBottom: 8,
      minWidth: 64,
    },
    selectedPalette: {
      borderColor: theme.primary,
      backgroundColor: theme.hoverBackground,
    },
    swatchRow: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    swatch: {
      width: 16,
      height: 16,
      borderRadius: 4,
      marginHorizontal: 2,
    },
    paletteLabel: {
      fontSize: 13,
      color: theme.text,
      textTransform: 'capitalize',
    },
  })

export default PaletteSelector