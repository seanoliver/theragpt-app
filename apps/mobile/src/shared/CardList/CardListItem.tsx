import { Card } from '@/packages/logic/src/cards/cards.service'
import { default as React } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, {
  LinearTransition,
  SlideOutLeft,
} from 'react-native-reanimated'
import { Theme, useTheme } from '../../../lib/theme'
import { SwipeAction, SwipeMenu } from '../SwipeMenu'
import { useCardInteractionService } from '../hooks/useCardInteractionService'
import { Ionicons } from '@expo/vector-icons'

interface CardListItemProps {
  card: Card
  handleOpenBottomSheet: (card: Card) => void
  getSwipeActions: (card: Card) => SwipeAction[]
}

export const CardListItem = ({
  card,
  handleOpenBottomSheet,
  getSwipeActions,
}: CardListItemProps) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  const { reviewCount } = useCardInteractionService(card.id, [card])

  const lastReviewed = card.lastReviewed
    ? new Date(card.lastReviewed).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : 'Never'

  const showHearts = card.upvotes && card.upvotes > 0
  const showArchiveBulletSeparator = !card.isActive && showHearts

  return (
    <SwipeMenu actions={getSwipeActions(card)}>
      <Animated.View
        exiting={SlideOutLeft}
        layout={LinearTransition}
        style={styles.cardWrapper}
      >
        <TouchableOpacity onPress={() => handleOpenBottomSheet(card)}>
          <View style={[styles.card]}>
            <Text style={styles.text}>{card.text}</Text>
            <View style={styles.footerRow}>
              <View style={styles.footerRowLeft}>
                {(!card.isActive || showArchiveBulletSeparator) && (
                  <Text style={styles.metaText}>
                    {!card.isActive ? 'Archived' : ''}
                    {showArchiveBulletSeparator ? ' • ' : ''}
                  </Text>
                )}
                {showHearts ? (
                  <>
                    <Ionicons
                      name="heart-outline"
                      size={14}
                      color={theme.colors.tertiaryText}
                    />
                    <Text style={styles.metaText}> {card.upvotes}</Text>
                  </>
                ) : (
                  <Text style={styles.metaText}></Text>
                )}
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
      </Animated.View>
    </SwipeMenu>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.colors.foregroundBackground,
      borderColor: theme.colors.border,
      ...theme.rnShadows.subtle,
    },
    cardWrapper: {
      marginBottom: 16,
      marginHorizontal: 16,
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
      color: theme.colors.tertiaryText,
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
      color: theme.colors.primaryText,
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginTop: 4,
      width: '100%',
      color: theme.colors.tertiaryText,
    },
    footerRowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    footerRowLeft: {
      flexGrow: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  })
