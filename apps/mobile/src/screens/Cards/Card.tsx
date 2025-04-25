import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useTheme } from '../../../lib/theme/context'
import { DisplayCard } from './useCardData'
import { Theme } from '@/apps/mobile/lib/theme'
import { router } from 'expo-router'

// TODO: Add props for meta info (category, lastReviewed, votes, frequency, reviews, etc.)
interface CardProps {
  card: DisplayCard
}

export const Card: React.FC<CardProps> = ({ card }) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  // TODO: Placeholder meta info for demonstration
  const category = card.category || undefined
  const lastReviewed = card.lastReviewed || 'Never'
  const netVotes = card.netVotes ?? 0
  const frequency = card.frequency || undefined
  const reviews = card.reviews || 0

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
    <TouchableOpacity onPress={() => router.push(`/cards/${card.id}`)}>
      <View style={[styles.card]}>
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
        <Text style={styles.text}>{card.text}</Text>
        <View style={styles.footerRow}>
          <View style={styles.footerRowLeft}>
            <Text style={styles.metaText}>{!card.isActive && 'Archived'}</Text>
          </View>
          {reviews && (
            <View style={styles.footerRowRight}>
              <Text style={styles.metaText}>{reviews} reviews</Text>
              <Text style={styles.metaText}> • </Text>
            </View>
          )}
          <Text style={styles.metaText}>Last: {lastReviewed}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
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
      justifyContent: 'space-between',
      marginTop: 4,
      width: '100%',
      color: theme.colors.textDisabled,
    },
    footerRowRight: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    footerRowLeft: {
      flexGrow: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
  })
