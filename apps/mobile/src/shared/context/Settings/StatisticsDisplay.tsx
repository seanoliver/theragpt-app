import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../../../lib/theme/context'
import type { Card } from '@still/logic'

type StatisticsDisplayProps = {
  cards: Card[] | null
}

const StatisticsDisplay = ({ cards }: StatisticsDisplayProps) => {
  const { themeObject } = useTheme()
  const styles = makeStyles(themeObject)

  const cardCount = cards ? cards.length : 0
  // Placeholder: reviewsCompleted can be computed if review data is available
  // const reviewsCompleted = cards ? cards.reduce((sum, c) => sum + (c.reviewCount || 0), 0) : 0

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Card Statistics</Text>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{cardCount}</Text>
          <Text style={styles.statLabel}>Cards</Text>
        </View>
        {/* <View style={styles.statBox}>
          <Text style={styles.statValue}>{reviewsCompleted}</Text>
          <Text style={styles.statLabel}>Reviews Completed</Text>
        </View> */}
      </View>
    </View>
  )
}

const makeStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 24,
    },
    statBox: {
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      backgroundColor: theme.hoverBackground,
      minWidth: 80,
    },
    statValue: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.primary,
    },
    statLabel: {
      fontSize: 13,
      color: theme.text,
      marginTop: 2,
    },
  })

export default StatisticsDisplay