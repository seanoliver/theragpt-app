import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, tokens } from '../../../../lib/theme'

export function ArchiveEmptyState() {
  return (
    <View style={styles.container}>
      <Ionicons
        name="archive-outline"
        size={48}
        color={colors.charcoal[300]}
        style={styles.icon}
      />
      <Text style={styles.title}>No archived statements</Text>
      <Text style={styles.subtitle}>
        This area is dedicated to your work-in-progress manifesto statements.
      </Text>
      <Text style={styles.subtitle}>
        Use this space to add notes, ideas, quotes, and other thoughts that you
        want to keep but aren't yet ready to add to your active manifesto.
      </Text>
      <Text style={styles.subtitle}>
        Then, you can use this space to workshop and refine statements before
        adding them to your active manifesto.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
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
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'left',
    fontFamily: tokens.fontFamilies.bodySans,
    marginBottom: 16,
  },
})
