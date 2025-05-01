import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Theme, useTheme } from '@/apps/mobile/lib/theme'
import { Card } from '@theragpt/logic'
import { useCardInteractionService } from '../hooks/useCardInteractionService'

export const CardSheetStats = ({ card }: { card: Card }) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  const { netVotes, reviewCount } = useCardInteractionService(card.id)

  const stats = useMemo(
    () => [
      {
        icon: 'calendar-outline',
        value:
          reviewCount > 0 && card.lastReviewed
            ? new Date(card.lastReviewed).toLocaleDateString()
            : 'Never',
        label: 'Last Review',
      },
      {
        icon:
          netVotes === 0
            ? 'checkmark-circle-outline'
            : netVotes > 0
              ? 'chevron-up'
              : 'chevron-down',
        value: netVotes,
        label: 'Net Votes',
      },
      {
        icon: 'eye-outline',
        value: reviewCount,
        label: 'Reviews',
      },
    ],
    [reviewCount, card.lastReviewed, netVotes],
  )

  return (
    <View style={styles.statsRow}>
      {/* Last Reviewed */}
      {stats.map((stat, index) => (
        <React.Fragment key={index}>
          <StatBox
            icon={stat.icon as keyof typeof Ionicons.glyphMap}
            value={stat.value}
            label={stat.label}
          />
          {index < stats.length - 1 && (
            <View
              style={{
                width: 1,
                height: '50%',
                backgroundColor: theme.colors.border,
                alignSelf: 'center',
                marginHorizontal: 6,
              }}
            />
          )}
        </React.Fragment>
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
      <Text style={styles.statLabel}>{label}</Text>
      <Ionicons
        name={icon}
        size={22}
        color={theme.colors.textOnBackground}
        style={styles.statIcon}
      />
      <Text style={styles.statValue}>{value}</Text>
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
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
    },
    statCard: {
      flex: 1,
      flexDirection: 'column',
      gap: 6,
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 10,
      marginHorizontal: 2,
      minWidth: 0,
      backgroundColor: theme.colors.foregroundBackground,
      borderColor: theme.colors.tertiaryText,
    },
    statIcon: {
      marginBottom: 4,
      fontSize: 18,
      color: theme.colors.tertiaryText,
    },
    statValue: {
      fontSize: 12,
      fontWeight: '400',
      marginBottom: 2,
      textAlign: 'center',
      color: theme.colors.tertiaryText,
    },
    statLabel: {
      fontSize: 10,
      fontWeight: '600',
      opacity: 0.7,
      textAlign: 'center',
      color: theme.colors.tertiaryText,
      textTransform: 'uppercase',
    },
  })
