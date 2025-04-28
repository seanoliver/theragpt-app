import { useTheme } from '@/apps/mobile/lib/theme/context'
import { useState, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CardPager } from './components/CardPager'
import { Theme } from '@/apps/mobile/lib/theme/theme'
import { useCardStore } from '@/apps/mobile/src/store/useCardStore'

export const ReviewScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const loggedCardIds = useRef<Set<string>>(new Set())
  const { cards, isLoading, error } = useCardStore()

  const { themeObject } = useTheme()
  const styles = makeStyles(themeObject)

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    )
  }

  if (!cards || cards.length === 0) {
    return (
      <View>
        <Text>No cards available</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardPagerContainer}>
        <CardPager
          cards={cards}
          currentIndex={currentIndex}
          onPageSelected={setCurrentIndex}
          themeObject={themeObject}
          loggedCardIds={loggedCardIds}
        />
      </View>

      {/* Progress Bar */}
      <View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${((currentIndex + 1) / cards.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background,
    },
    cardPagerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressBarContainer: {
      height: 1,
      backgroundColor: theme.colors.hoverBackground,
    },
    progressBar: {
      height: 10,
      backgroundColor: theme.colors.hoverPrimary,
    },
  })
