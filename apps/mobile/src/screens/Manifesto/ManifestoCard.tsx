import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../../lib/theme/context'
import { DisplayStatement } from './useManifestoData'
import { Theme } from '@/apps/mobile/lib/theme'

// TODO: Add props for meta info (category, lastReviewed, votes, frequency, reviews, etc.)
interface ManifestoCardProps {
  statement: DisplayStatement
}

export const ManifestoCard: React.FC<ManifestoCardProps> = ({ statement }) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  // TODO: Placeholder meta info for demonstration
  const category = statement.category || undefined
  const lastReviewed = statement.lastReviewed || 'Never'
  const netVotes = statement.netVotes ?? 0
  const frequency = statement.frequency || undefined
  const reviews = statement.reviews ?? 0

  const getNetVotesColor = () => {
    if (netVotes > 0) return theme.colors.successAccent
    if (netVotes < 0) return theme.colors.warningAccent
    return theme.colors.textDisabled
  }

  const getFrequencyColor = () => {
    if (frequency === 'More') return theme.colors.successText
    if (frequency === 'Less') return theme.colors.warningText
    return theme.colors.textDisabled
  }
  const showHeaderRow = category || netVotes || frequency

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {showHeaderRow && (
        <View style={styles.headerRow}>
          {category && (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{category}</Text>
            </View>
          )}
          {netVotes && (
            <Text style={[styles.netVotes, { color: getNetVotesColor() }]}>
              {netVotes > 0 ? '↑' : netVotes < 0 ? '↓' : '-'}
              {netVotes}
            </Text>
          )}
          {frequency && (
            <Text style={[styles.frequency, { color: getFrequencyColor() }]}>
              {frequency}
            </Text>
          )}
        </View>
      )}
      <Text style={styles.text}>{statement.text}</Text>
      <View style={styles.footerRow}>
        {reviews && (
          <>
            <Text style={styles.metaText}>{reviews} reviews</Text>
            <Text style={styles.metaText}> • </Text>
          </>
        )}
        <Text style={styles.metaText}>Last: {lastReviewed}</Text>
      </View>
    </View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      borderRadius: 16,
      padding: 16,
      ...theme.rnShadows.subtle,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 8,
    },
    pill: {
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 2,
      marginRight: 8,
      backgroundColor: theme.colors.accent + '22',
    },
    pillText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.accent,
    },
    metaText: {
      fontSize: 12,
      marginRight: 8,
      color: theme.colors.textDisabled,
    },
    netVotes: {
      fontSize: 12,
      fontWeight: '600',
      marginRight: 8,
    },
    frequency: {
      fontSize: 12,
      fontWeight: '600',
    },
    text: {
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 8,
      color: theme.colors.text,
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginTop: 4,
      width: '100%',
      color: theme.colors.textDisabled,
    },
  })
