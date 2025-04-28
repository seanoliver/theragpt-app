import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useTheme } from '../../../lib/theme/context'
import { Card as CardType } from '@still/logic'
import { Theme } from '@/apps/mobile/lib/theme'
import { router } from 'expo-router'
import { useCardInteractionService } from '@/apps/mobile/src/shared/hooks/useCardInteractionService'

// TODO: Add props for meta info (category, lastReviewed, votes, frequency, reviews, etc.)
interface CardProps {
  card: CardType
}

export const Card: React.FC<CardProps> = ({ card }) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)
  const { netVotes, reviewCount } = useCardInteractionService(card.id)

  const category = card.tags?.[0]
  const lastReviewed = card.lastReviewed
    ? new Date(card.lastReviewed).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : 'Never'
  const frequency = netVotes ? (netVotes > 0 ? 'More' : 'Less') : undefined

  const getNetVotesColor = () => {
    if (netVotes > 0) return theme.colors.successAccent
    if (netVotes < 0) return theme.colors.warningAccent
    return theme.colors.textDisabled
  }

  const getFrequencyColor = () => {
    if (frequency === 'More') return theme.colors.successAccent
    if (frequency === 'Less') return theme.colors.warningAccent
    return theme.colors.textDisabled
  }

  const showHeaderRow = category || netVotes || frequency

  return (
    <TouchableOpacity onPress={() => router.push(`/cards/${card.id}`)}>
      <View style={[styles.card]}>
        {showHeaderRow && (
          <View style={styles.headerRow}>
            <View style={styles.headerRowLeft}>
              {category && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{category}</Text>
                </View>
              )}
            </View>
            <View style={styles.headerRowRight}>
              {netVotes && (
                <Text style={[styles.netVotes, { color: getNetVotesColor() }]}>
                  {netVotes > 0 ? '↑' : netVotes < 0 ? '↓' : '-'}
                  {netVotes}
                </Text>
              )}
              {frequency && (
                <Text
                  style={[styles.frequency, { color: getFrequencyColor() }]}
                >
                  {frequency}
                </Text>
              )}
            </View>
          </View>
        )}
        <Text style={styles.text}>{card.text}</Text>
        <View style={styles.footerRow}>
          <View style={styles.footerRowLeft}>
            <Text style={styles.metaText}>{!card.isActive && 'Archived'}</Text>
          </View>
          {reviewCount > 0 && (
            <View style={styles.footerRowRight}>
              <Text style={styles.metaText}>{reviewCount} reviews</Text>
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
      justifyContent: 'space-between',
      width: '100%',
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
    },
    frequency: {
      fontSize: 12,
      fontWeight: '400',
    },
    headerRowRight: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 8,
    },
    headerRowLeft: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 8,
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
