import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Theme, useTheme } from '@/apps/mobile/lib/theme'
import { Card } from '@still/logic'
import { useCardInteractionService } from '../../shared/hooks/useCardInteractionService';

export const CardScreenStats = ({ card }: { card: Card }) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  const { netVotes, reviewCount } = useCardInteractionService(card.id)

  const stats = [
    {
      icon: 'calendar',
      value:
        reviewCount > 0 && card.lastReviewed
          ? new Date(card.lastReviewed).toLocaleDateString()
          : 'Never',
      label: 'Last Reviewed',
    },
    {
      icon: netVotes > 0 ? 'chevron-up' : 'chevron-down',
      value: netVotes,
      label: 'Net Votes',
    },
    {
      icon: 'eye',
      value: reviewCount,
      label: 'Reviews',
    },
  ]

  return (
    <View style={styles.statsRow}>
      {/* Last Reviewed */}
      {stats.map((stat, index) => (
        <StatBox
          key={index}
          icon={stat.icon as keyof typeof Ionicons.glyphMap}
          value={stat.value}
          label={stat.label}
        />
      ))}
    </View>
  )
}

const StatBox = ({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap
  value: string | number
  label: string
}) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  return (
    <View style={styles.statCard}>
      <Ionicons
        name={icon}
        size={22}
        color={theme.colors.textOnBackground}
        style={styles.statIcon}
      />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
      gap: 10,
    },
    statCard: {
      flex: 1,
      alignItems: 'center',
      borderRadius: 10,
      borderWidth: 1,
      paddingVertical: 12,
      paddingHorizontal: 10,
      marginHorizontal: 2,
      minWidth: 0,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.borderSubtle,
    },
    statIcon: {
      marginBottom: 4,
    },
    statValue: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 2,
      textAlign: 'center',
      color: theme.colors.textOnBackground,
    },
    statLabel: {
      fontSize: 13,
      fontWeight: '400',
      opacity: 0.7,
      textAlign: 'center',
      color: theme.colors.textOnBackground,
    },
  })
