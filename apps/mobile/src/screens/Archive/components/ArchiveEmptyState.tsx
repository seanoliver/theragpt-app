import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, tokens } from '../../../../lib/theme'

export function ArchiveEmptyState() {
  return (
    <View style={styles.container}>
      <Ionicons name="archive-outline" size={48} color={colors.charcoal[300]} style={styles.icon} />
      <Text style={styles.title}>No archived items</Text>
      <Text style={styles.subtitle}>Archived items will appear here. You can archive statements from your main list.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    fontFamily: tokens.fontFamilies.headerSerif,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    fontFamily: tokens.fontFamilies.body,
  },
})